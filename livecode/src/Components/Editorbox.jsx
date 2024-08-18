import React, { useEffect, useState } from 'react';
import { Editor } from '@monaco-editor/react';
import { useSocket } from './SocketProvider';

const Editorbox = (props) => {
  const { code, handleCodeChange, handleEditorDidMount } = props;
  const { socket, setCursor, cursors } = useSocket();
  
  const [editor, setEditor] = useState(null);

  useEffect(() => {
    if (editor) {
      const handleCursorChange = (e) => {
        const model = editor.getModel();
        const position = editor.getPosition();
        setCursor({ position, color: generateRandomColor() });
        socket.emit('cursorUpdate', { position, color: cursorColor });
      };

      const handleEditorCursorChange = (event) => {
        handleCursorChange();
      };

      editor.onDidChangeCursorPosition(handleEditorCursorChange);
      return () => editor.offDidChangeCursorPosition(handleEditorCursorChange);
    }
  }, [editor, socket, cursorColor]);

  useEffect(() => {
    if (socket) {
      socket.on('cursorUpdate', ({ position, color }) => {
        // Render cursor in editor
        renderCursor(position, color);
      });
    }
  }, [socket]);

  const renderCursor = (position, color) => {
    // Implement cursor rendering logic based on position and color
  };

  const generateRandomColor = () => {
    // Generate random color for cursor
    return '#' + Math.floor(Math.random() * 16777215).toString(16);
  };

  return (
    <Editor
      height="60vh"
      language="java"
      theme="vs-dark"
      value={code}
      onChange={handleCodeChange}
      onMount={(editorInstance) => {
        setEditor(editorInstance);
        handleEditorDidMount(editorInstance);
      }}
    />
  );
};

export default Editorbox;
