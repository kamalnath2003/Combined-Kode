import React, { useEffect } from 'react';
import { SocketProvider, useSocket } from '../Context/SocketContext';
import { Editor } from '@monaco-editor/react';
import Navbar from '../Components/Navbar';
import { useParams } from 'react-router-dom';
import '../pages/Editorpage.css';
import OutputBox from '../Components/OutputBox';
import { javaCompletionProvider } from '../Components/javaCompletionProvider'; // Adjust path as necessary
import Editorbox from '../Components/Editorbox';

function EditorPageContent() {
  const { id } = useParams();
  const {
    code,
    handleCodeChange,
    handleCompileAndRun,
    isRunning,
    setInput,
    socket,
    setOutput,
    fileName,
    handleFileNameChange,
    input,
    handleSendInput,
    handleSaveCode,
    output,
    isCompiled,
    handleAbort,
    handleClearOutput,
    isinputwant
  } = useSocket();

  const handleEditorDidMount = (editor, monaco) => {
    javaCompletionProvider(monaco); // Register the completion provider
  };

  return (
    <section className='gradient-custom1 ' style={{paddingBottom:'25%'}}>
      <div className="container-fluid mx-0 p-0 ">
        <Navbar
          page='editor'
          id={id}
          fileName={fileName}
          handleFileNameChange={handleFileNameChange}
          handleSaveCode={handleSaveCode}
        />
        <div className="row d-flex" style={{ marginRight: "0px" }}>
          <div className="col-6">
            <div className="editor-page">
              <Editorbox
              code = {code}
              handleCodeChange= {handleCodeChange}
              handleEditorDidMount = {handleEditorDidMount}
              />              
            </div>
          </div>
          <div className="col-6">
            <div className="editor-container">
              <OutputBox 
                output={output} 
                isCompiled={isCompiled} 
                isRunning={isRunning}
                setInput={setInput} 
                input={input}
                isinputwant={isinputwant}
                socket= {socket}
                setOutput= {setOutput}
                handleSendInput={handleSendInput}
              />
            </div>
          </div>
        </div>
        <div className="row mr-0" style={{ marginRight: "0px" }}>
          <div className="col">
            <button 
              className='button-25 ms-5 px-5' 
              onClick={handleCompileAndRun} 
              disabled={isRunning}
            >
              Run
            </button>
            <button 
              className='button-24 ms-5 px-5' 
              onClick={handleAbort} 
              disabled={!isRunning}
            >
              Abort
            </button>
            <button 
              className='btn btn-outline-dark ms-5 px-4' // Style this button accordingly
              onClick={handleClearOutput}
            >
              Clear Output
            </button>
          </div>
        </div>
      </div>
    </section>
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
