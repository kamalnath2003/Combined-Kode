const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const { spawn } = require('child_process');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  },
  transports: ['websocket'],
  perMessageDeflate: false
});

app.use(cors());
app.use(express.json());

// Keep track of active clients for each session
const sessionClients = {};

io.on('connection', (socket) => {
  const { id } = socket.handshake.query;
  const sessionDir = path.join(__dirname, 'sessions', id);
  const tempFilePath = path.join(sessionDir, 'Main.java');

  if (!fs.existsSync(sessionDir)) {
    fs.mkdirSync(sessionDir, { recursive: true });
  }

  sessionClients[id] = (sessionClients[id] || 0) + 1; // Increment active client count
  socket.join(id);

  let javaProcess = null;

  // Send existing code to the new client
  if (fs.existsSync(tempFilePath)) {
    const existingCode = fs.readFileSync(tempFilePath, 'utf8');
    socket.emit('codeUpdate', existingCode);
  }

  socket.on('startCode', ({ code }) => {
    if (javaProcess) {
      javaProcess.kill(); // Ensure no previous process is running
      javaProcess = null; // Reset the process reference
    }

    fs.writeFileSync(tempFilePath, code);

    const javac = spawn('javac', [tempFilePath]);

    javac.stderr.on('data', (data) => {
      io.in(id).emit('outputUpdate', `Compilation error: ${data.toString()}`);
      io.in(id).emit('isCompiled', false); // Indicate compilation failed
    });

    javac.on('close', (code) => {
      if (code === 0) {
        io.in(id).emit('compilationSuccess');
        javaProcess = spawn('java', ['-cp', sessionDir, 'Main']);

        javaProcess.stdout.on('data', (data) => {
          io.in(id).emit('outputUpdate', data.toString());
        });

        javaProcess.stderr.on('data', (data) => {
          io.in(id).emit('outputUpdate', `Runtime error: ${data.toString()}`);
        });

        javaProcess.on('close', (code) => {
          io.in(id).emit('endProcess'); // Notify clients that the process has ended
          javaProcess = null; // Reset the process reference after it ends
        });
      } else {
        io.in(id).emit('outputUpdate', 'Compilation failed');
        io.in(id).emit('isCompiled', false); // Indicate compilation failed
      }
    });
  });

  socket.on('sendInput', (input) => {
    if (javaProcess) {
      javaProcess.stdin.write(input + '\n');
      io.in(id).emit('inputUpdate', input); // Broadcast input to all clients in the session
    }
  });

  socket.on('codeChange', (newCode) => {
    fs.writeFileSync(tempFilePath, newCode); // Save the new code
    io.in(id).emit('codeUpdate', newCode); // Broadcast code change
  });

  socket.on('abort', () => {
    if (javaProcess) {
      javaProcess.kill(); // Terminate the running Java process
      io.in(id).emit('outputUpdate', 'Process aborted by user.');
      io.in(id).emit('endProcess'); // Notify clients that the process has ended
      javaProcess = null; // Reset the process reference after aborting
    }
  });

  socket.on('disconnect', () => {
    sessionClients[id] = (sessionClients[id] || 1) - 1; // Decrement active client count

    // Clean up session folder after disconnect if no clients are left
    if (sessionClients[id] <= 0) {
      fs.rmdirSync(path.join(__dirname, 'sessions', id), { recursive: true });
      delete sessionClients[id]; // Remove session from tracking
    }

    if (javaProcess) {
      javaProcess.kill();
      javaProcess = null; // Reset the process reference on disconnect
    }
  });
});

server.listen(5000, () => {
  console.log('Server is listening on port 5000');
});
