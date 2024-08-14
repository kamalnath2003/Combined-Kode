import React, { useState, useEffect, useRef } from 'react';
import { Editor } from '@monaco-editor/react';

function OutputBox(props) {
  const [popupPosition, setPopupPosition] = useState({ top: 0, left: 0 });
  const [isSticky, setIsSticky] = useState(false);

  const editorRef = useRef(null);
  const editorScrollTopRef = useRef(0); // Reference to store scroll position

  useEffect(() => {
    const editorInstance = editorRef.current;
    if (editorInstance) {
      // Save current scroll position
      const currentScrollTop = editorInstance.getScrollTop();
      editorScrollTopRef.current = currentScrollTop;

      // Find the position of the last line in the output
      const lastLineNumber = editorInstance.getModel().getLineCount();
      const lastColumn = editorInstance.getModel().getLineMaxColumn(lastLineNumber);

      const position = {
        lineNumber: lastLineNumber,
        column: lastColumn,
      };

      // Get the coordinates for the last line
      const coords = editorInstance.getScrolledVisiblePosition(position);

      if (coords) {

        setIsSticky(true); 


      }


    }
  }, [props.output]); // Recalculate position whenever `props.output` changes

  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor;
  };

  return (
    <>
      <div style={{ position: 'relative' }}>
        <Editor
          height="60vh"
          language="java"
          theme="vs-dark"
          value={props.output}
          options={{
            readOnly: true,
            minimap: { enabled: false },
            wordWrap: 'on',
          }}
          onMount={handleEditorDidMount}
        />
        {props.isCompiled & props.isRunning && (
          <div
            style={{
              position: 'absolute',
              bottom: isSticky ? '20px' : 'auto',
              top: isSticky ? 'auto' : popupPosition.top,
              left: isSticky ? '20px' : popupPosition.left,
              backgroundColor: '#333',
              color: '#fff',
              padding: '8px',
              borderRadius: '4px',
              zIndex: 10,
              width: '90%',
              overflow: 'hidden',
              whiteSpace: 'nowrap',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <textarea
              style={{
                backgroundColor: '#444',
                color: '#fff',
                border: 'none',
                resize: 'none',
                width: '100%',
                marginRight: '8px',
                padding: '4px',
                borderRadius: '4px',
                outline: 'none',
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  if (e.shiftKey) {
                    const start = e.target.selectionStart;
                    const end = e.target.selectionEnd;
                    props.setInput(prevValue =>
                      prevValue.substring(0, start) + '\n' + prevValue.substring(end)
                    );
                    e.preventDefault();
                  } else {
                    e.preventDefault();
                    props.handleSendInput();
                  }
                }
              }}
              onChange={(e) => props.setInput(e.target.value)}
              value={props.input}
              rows={1}
            />
            <button
              style={{
                backgroundColor: '#555',
                color: '#fff',
                border: 'none',
                padding: '4px 8px',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
              onClick={props.handleSendInput}
            >
              ➤
            </button>
          </div>
        )}
      </div>
      <div className="watermark">OUTPUT</div>
    </>
  );
}

export default OutputBox;
