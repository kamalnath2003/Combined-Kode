import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import io from 'socket.io-client';
import { debounce } from 'lodash';

const SocketContext = createContext();

export function useSocket() {
  return useContext(SocketContext);
}

export function SocketProvider({ children, sessionId }) {
  const [code, setCode] = useState('// Shared Java code goes here\n');
  const [output, setOutput] = useState('');
  const [input, setInput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [isCompiled, setIsCompiled] = useState(false);
  const fileName = useRef('Main.java'); // Using useRef for unchanging variables
  const [socket, setSocket] = useState(null);
  const [terminalInput, setTerminalInput] = useState('');

  const handleOutputUpdate = useCallback((data) => {
    setOutput((prev) => prev + data);
  }, []);

  useEffect(() => {
    const socketInstance = io(process.env.NODE_ENV === 'production' 
      ? 'https://kode-full-production.up.railway.app' 
      : 'http://localhost:5000', {
        query: { id: sessionId },
        transports: ['websocket']
    });
    setSocket(socketInstance);

    socketInstance.on('codeUpdate', (newCode) => {
      console.log('Code Update Received:', newCode);
      setCode(newCode);
    });
    
    socketInstance.on('outputUpdate', (data) => {
      console.log('Output Update Received:', data);
      handleOutputUpdate(data);
    });
    
    socketInstance.on('inputUpdate', (newInput) => {
      console.log('Input Update Received:', newInput);
      setInput(newInput);
    });

    socketInstance.on('compilationSuccess', () => {
      console.log('Compilation Success Event Received');
      setIsCompiled(true);
    });

    socketInstance.on('endProcess', () => {
      console.log('Process Ended');
      setIsRunning(false);
      setIsCompiled(false);
    });

    return () => {
      socketInstance.disconnect();
    };
  }, [sessionId, handleOutputUpdate]);

  const debouncedHandleCodeChange = useCallback(
    debounce((value) => {
      setCode(value);
      if (socket) {
        socket.emit('codeChange', value);
      }
    }, 300),
    [socket]
  );

  const handleCodeChange = (value) => {
    debouncedHandleCodeChange(value);
  };

  const handleCompileAndRun = () => {
    setOutput('');
    setIsRunning(true);
    setIsCompiled(false);
    
    if (socket) {
      socket.emit('startCode', { code });
      console.log('Start Code Emitted:', code);
    }
  };

  const handleSendInput = () => {
    if (socket) {
      socket.emit('sendInput', input);
      setInput('');
    }
  };

  const handleSaveCode = () => {
    const blob = new Blob([code], { type: 'text/java' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName.current;
    a.click();
    URL.revokeObjectURL(url);

  };

  const handleTerminalKeyDown = (e) => {
    if (e.key === 'Enter' && isCompiled) {
      e.preventDefault();
      handleSendInput();
      setInput('');
      // setTerminalInput('');  // Clear the input field after sending
    }
  };

  // const handleTerminalChange = (newValue) => {
  //   // Update the terminal input state when user types
  //   (newValue);
  // };
  
  
  const handleClearOutput = () => {
    // Update the terminal input state when user types
    setOutput('');
  };

  const handleAbort = () => {
    if (isRunning && socket) {
      socket.emit('abort');  // Emit the abort event to the server
      setIsRunning(false);   // Update the state to reflect that the process is no longer running
    }
  };

  return (
    <SocketContext.Provider
      value={{
        code,
        input,
        output,
        isRunning,
        isCompiled,
        fileName: fileName.current,
        terminalInput,
        setInput,
        setCode,
        handleCodeChange,
        handleCompileAndRun,
        handleSendInput,
        handleSaveCode,
        handleAbort,
        handleTerminalKeyDown,
        // handleTerminalChange,
        handleClearOutput
      }}
    >
      {children}
    </SocketContext.Provider>
  );
}
