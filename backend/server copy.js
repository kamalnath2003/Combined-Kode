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

// Track active clients and session outputs
const sessionClients = {};
const sessionOutputs = {};

io.on('connection', (socket) => {
  const { id } = socket.handshake.query;
  const sessionDir = path.join(__dirname, 'sessions', id);
  const tempFilePath = path.join(sessionDir, 'Main.java');
  const outputLogPath = path.join(sessionDir, 'output.log');

  if (!fs.existsSync(sessionDir)) {
    fs.mkdirSync(sessionDir, { recursive: true });
    
    // Create boilerplate code for new sessions
    const boilerplateCode = `public class Main {
      public static void main(String[] args) {
        System.out.println("Hello, World!");
      }
    }`;
    fs.writeFileSync(tempFilePath, boilerplateCode);

    // Initialize empty output log for the new session
    fs.writeFileSync(outputLogPath, '');
    sessionOutputs[id] = ''; // Initialize sessionOutputs
  }

  sessionClients[id] = (sessionClients[id] || 0) + 1; // Increment active client count
  socket.join(id);

  let javaProcess = null;

  // Send existing code and output to new client
  if (fs.existsSync(tempFilePath)) {
    const existingCode = fs.readFileSync(tempFilePath, 'utf8');
    socket.emit('codeUpdate', existingCode);
  }

  if (fs.existsSync(outputLogPath)) {
    const existingOutput = fs.readFileSync(outputLogPath, 'utf8');
    socket.emit('outputUpdate', existingOutput);
  }

  socket.on('startCode', ({ code }) => {
    if (javaProcess) {
      javaProcess.kill(); // Ensure no previous process is running
      javaProcess = null; // Reset the process reference
    }

    fs.writeFileSync(tempFilePath, code);
    fs.writeFileSync(outputLogPath, ''); // Clear output log for new run
    sessionOutputs[id] = ''; // Clear sessionOutputs

    const javac = spawn('javac', [tempFilePath]);

    javac.stderr.on('data', (data) => {
      const errorOutput = `Compilation error: ${data.toString()}`;
      fs.appendFileSync(outputLogPath, errorOutput); // Append to output log
      sessionOutputs[id] += errorOutput; // Update sessionOutputs
      io.in(id).emit('outputUpdate', errorOutput);
      io.in(id).emit('isCompiled', false); // Indicate compilation failed
    });

    javac.on('close', (code) => {
      if (code === 0) {
        io.in(id).emit('compilationSuccess');
        javaProcess = spawn('java', ['-cp', sessionDir, 'Main']);

        javaProcess.stdout.on('data', (data) => {
          const output = data.toString();
          fs.appendFileSync(outputLogPath, output); // Append to output log
          sessionOutputs[id] += output; // Update sessionOutputs
          io.in(id).emit('outputUpdate', output);
        });

        javaProcess.stderr.on('data', (data) => {
          const errorOutput = `Runtime error: ${data.toString()}`;
          fs.appendFileSync(outputLogPath, errorOutput); // Append to output log
          sessionOutputs[id] += errorOutput; // Update sessionOutputs
          io.in(id).emit('outputUpdate', errorOutput);
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
      fs.rmdirSync(sessionDir, { recursive: true });
      delete sessionClients[id]; // Remove session from tracking
      delete sessionOutputs[id]; // Remove session output log from tracking
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
