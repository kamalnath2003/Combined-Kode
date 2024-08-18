import { Editor } from '@monaco-editor/react';
import react from 'react'

const Editorbox=(props)=>{


    return(
        <>        
        <Editor
                height="60vh"
                language="java"
                theme="vs-dark"
                value={props.code}
                onChange={props.handleCodeChange}
                onMount={props.handleEditorDidMount} // Register completion provider
              />
        </>
    )
}
export default Editorbox;