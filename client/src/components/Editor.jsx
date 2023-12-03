import React, { useEffect, useState } from "react";
import { useRef } from "react";
import { ACTIONS } from "../Action";
import { basicSetup } from "codemirror";
import { EditorView, keymap } from "@codemirror/view";
import { javascript } from "@codemirror/lang-javascript";
import { Compartment, EditorState } from "@codemirror/state";
import { oneDark } from "@codemirror/theme-one-dark";
import { defaultKeymap, indentWithTab } from "@codemirror/commands";

const Editor = ({ socketRef, roomId, onCodeChange }) => {
  const editor = useRef();
  const codeMirrorRef = useRef();

  
  const updateValue = EditorView.updateListener.of(function (e) {
    if (e.selectionSet) {
      const code = e.state.doc.toString();
      onCodeChange(code);
      socketRef.current.emit(ACTIONS.CODE_CHANGE, {
        roomId,
        code,
      });
    }
  });

  useEffect(() => {
    if (socketRef.current) {
      socketRef.current.on(ACTIONS.CODE_CHANGE, ({ code }) => {
        if (code !== null) {
          onCodeChange(code);
          codeMirrorRef.current.dispatch({
            changes: {
              from: 0,
              to: codeMirrorRef.current.state.doc.length,
              insert: code,
            },
          });
        }
      });
    }

  }, [socketRef.current]);

  useEffect(() => {
    const editorTheme = new Compartment();
    const customTheme = EditorView.theme({
      "&": {
        color: "#DDD",
        fontSize: "25px",
        fontFamily: "'Roboto Mono',Consolas,monospace",
      },
    });
    const startState = EditorState.create({
      extensions: [
        updateValue,
        customTheme,
        basicSetup,
        keymap.of([defaultKeymap, indentWithTab]),
        javascript(),
        editorTheme.of(oneDark),
      ],
    });

    const view = new EditorView({
      state: startState,
      extensions: [customTheme],
      parent: editor.current,
    });

    codeMirrorRef.current = view;

    return () => {
      view.destroy();
    };
  }, []);

  return <div ref={editor}></div>;
};

export default Editor;
