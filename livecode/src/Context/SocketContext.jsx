import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';

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
  const [fileName, setFileName] = useState('Main.java');
  const [penEnabled, setPenEnabled] = useState(false);
  const canvasRef = useRef(null);
  const [socket, setSocket] = useState(null); // <--- Store socket in state

  useEffect(() => {
    const socketInstance = io(process.env.REACT_APP_URL || 'http://localhost:5000', {
      query: { id: sessionId },
      transports: ['websocket'],
    });

    setSocket(socketInstance); // <--- Set socket instance in state

    socketInstance.on('codeUpdate', (newCode) => setCode(newCode));
    socketInstance.on('outputUpdate', (data) => setOutput((prev) => prev + data));
    socketInstance.on('inputUpdate', (newInput) => setInput(newInput));
    socketInstance.on('endProcess', () => {
      setIsRunning(false);
      setIsCompiled(false);
    });

    return () => socketInstance.disconnect();
  }, [sessionId]);

  const handleFileNameChange = (event) => {
    setFileName(event.target.value);
  };

  const debounce = (func, delay) => {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => func(...args), delay);
    };
  };

  const handleCodeChange = debounce((value) => {
    setCode(value);
    if (socket) { // <--- Ensure socket is available before emitting
      socket.emit('codeChange', value);
    }
  }, 300);

  const handleSaveCode = () => {
    const blob = new Blob([code], { type: 'text/java' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(url);
  };

  const togglePen = () => {
    setPenEnabled(!penEnabled);
  };

  const clearDrawing = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const startDrawing = (event) => {
    if (!penEnabled) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.beginPath();
    ctx.moveTo(event.nativeEvent.offsetX, event.nativeEvent.offsetY);
    canvas.isDrawing = true;
  };

  const finishDrawing = () => {
    const canvas = canvasRef.current;
    canvas.isDrawing = false;
  };

  const draw = (event) => {
    if (!penEnabled) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!canvas.isDrawing) return;
    ctx.lineTo(event.nativeEvent.offsetX, event.nativeEvent.offsetY);
    ctx.stroke();
  };

  return (
    <SocketContext.Provider
      value={{
        code,
        setCode,
        output,
        input,
        setInput,
        isRunning,
        isCompiled,
        fileName,
        handleFileNameChange,
        handleSaveCode,
        penEnabled,
        togglePen,
        clearDrawing,
        canvasRef,
        startDrawing,
        finishDrawing,
        draw,
        socket, // <--- Pass socket to the context
        debounce,
        handleCodeChange
      }}
    >
      {children}
    </SocketContext.Provider>
  );
}
