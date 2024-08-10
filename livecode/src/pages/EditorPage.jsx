import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Editor } from '@monaco-editor/react';
import io from 'socket.io-client';
import Navbar from '../Components/Navbar';
import { javaSuggestions } from '../Components/javaSuggestions'; // Import your custom suggestions

function EditorPage() {
  const { id } = useParams();
  const [code, setCode] = useState('// Shared Java code goes here\n');
  const [output, setOutput] = useState('');
  const [input, setInput] = useState('');
  const [fileName, setFileName] = useState('Main.java');
  const [socket, setSocket] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [isCompiled, setIsCompiled] = useState(false);

  useEffect(() => {
    const socketInstance = io(
      process.env.NODE_ENV === 'production' 
        // ? 'https://kode-io-1.onrender.com' 
        ? 'http://localhost:5000' 
        : 'http://localhost:5000', 
      {
        query: { id },  
        transports: ['websocket'],
      }
    );

    setSocket(socketInstance);

    socketInstance.on('codeUpdate', (newCode) => {
      setCode(newCode);
    });

    socketInstance.on('outputUpdate', (data) => {
      setOutput((prevOutput) => prevOutput + data);
    });

    socketInstance.on('inputUpdate', (newInput) => {
      setInput(newInput);
    });

    socketInstance.on('endProcess', () => {
      setIsRunning(false);
      setIsCompiled(false);
    });

    return () => {
      socketInstance.disconnect();
    };
  }, [id]);

  const handleCodeChange = (value) => {
    setCode(value);
    if (socket) {
      socket.emit('codeChange', value);
    }
  };

  const handleCompileAndRun = () => {
    if (socket) {
      setOutput('');
      setIsRunning(true);
      setIsCompiled(false);
      socket.emit('startCode', { code });
    }
  };

  const handleSendInput = () => {
    if (socket && isRunning) {
      socket.emit('sendInput', input);
      setInput('');
    }
  };

  const handleAbort = () => {
    if (socket) {
      socket.emit('abortCode');
      setIsRunning(false);
    }
  };

  const handleFileNameChange = (event) => {
    setFileName(event.target.value);
  };

  const handleSaveCode = () => {
    const blob = new Blob([code], { type: 'text/java' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    if (output && isRunning && !isCompiled) {
      setIsCompiled(true);
    }
  }, [output, isRunning, isCompiled]);

  // Define custom completion items provider
  // const setupMonacoEditor = (editor) => {
  //   monaco.languages.registerCompletionItemProvider('java', javaSuggestions(monaco));
  // };

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col">
          <h2>Session ID: {id}</h2>
        </div>
      </div>
      <div className="row">
        <div className="col">
          <div className="editor-page">
            <Editor
              height="60vh"
              language="java"
              theme="vs-dark"
              value={code}
              onChange={handleCodeChange}
              // editorDidMount={setupMonacoEditor} // Setup Monaco Editor with custom suggestions
            />
          </div>
        </div>
        <div className="col boxx output-container" id="outputbox">
          <div className="output-container">
            <div className="output-label">Output:</div>
            <pre>{output}</pre>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col">
          <button onClick={handleCompileAndRun} disabled={isRunning}>
            Compile & Run
          </button>
          <button onClick={handleAbort} disabled={!isRunning}>
            Abort
          </button>
          {isRunning && (
            <div>
              <textarea
                placeholder="Enter input for your program"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                rows="4"
                style={{ width: '100%', marginTop: '10px' }}
              />
              <button onClick={handleSendInput} disabled={!isCompiled}>
                Send Input
              </button>
            </div>
          )}
          <div style={{ marginTop: '20px' }}>
            <input
              type="text"
              value={fileName}
              onChange={handleFileNameChange}
              placeholder="Enter file name"
              style={{ width: '200px', marginRight: '10px' }}
            />
          
            <button onClick={handleSaveCode}>
              Save Code
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditorPage;
