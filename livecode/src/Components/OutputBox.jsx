import React, { useEffect } from 'react';
import { Editor } from '@monaco-editor/react';

function OutputBox(props) {
 
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
        />
        {props.isCompiled && (
          <div
            style={{
              position: 'absolute',
              bottom: '20px',
              backgroundColor: '#333',
              marginleft:'10px',
              color: '#fff',
              padding: '8px',
              borderRadius: '4px',
              left:'4%',

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
              left:'100px',

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
