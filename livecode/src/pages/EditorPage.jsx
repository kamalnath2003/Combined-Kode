import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Editor } from '@monaco-editor/react';
import { useSocket, SocketProvider } from '../Context/SocketContext';
import Navbar from '../Components/Navbar';

function EditorPageContent() {
  const {
    code,
    output,
    input,
    setInput,
    isRunning,
    isCompiled,
    togglePen,
    penEnabled,
    clearDrawing,
    handleCodeChange,
    handleCompileAndRun,
    handleSendInput,
    handleAbort,
    canvasRef,
    fileName,
    handleFileNameChange,
    handleSaveCode,
    startDrawing,
    finishDrawing,
    draw,
  } = useSocket();

  return (
    <div className="container-fluid mx-0 p-0" >
      <Navbar page = 'editor' fileName={fileName} handleFileNameChange={handleFileNameChange} handleSaveCode={handleSaveCode} />
      <div className="row " style={{marginRight:"0px"}}>
        <div className="col">
          <div className="editor-page">
            <Editor
              height="60vh"
              language="java"
              theme="vs-dark"
              value={code}
              onChange={handleCodeChange}
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
      <div className="row mr-0"  style={{marginRight:"0px"}}>
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

                style={{ marginTop: '10px' }}
              />
              <button onClick={handleSendInput} disabled={!isCompiled}>
                Send Input
              </button>
            </div>
          )}


      </div>

          </div>

      {/* <div className="row">
        <div className="col">
          <button onClick={togglePen}>
            {penEnabled ? 'Disable Pen' : 'Enable Pen'}
          </button>
          <button onClick={clearDrawing} disabled={!penEnabled}>
            Clear Drawing
          </button>
          <canvas
            ref={canvasRef}
            onMouseDown={startDrawing}
            onMouseUp={finishDrawing}
            onMouseMove={draw}
            style={{ border: '1px solid black', marginTop: '10px' }}
          />
        </div>
      </div> */}
      
    </div>
  );
}

function EditorPage() {
  const { id } = useParams();

  return (
    <SocketProvider sessionId={id}>
      <EditorPageContent />
    </SocketProvider>
  );
}

export default EditorPage;
