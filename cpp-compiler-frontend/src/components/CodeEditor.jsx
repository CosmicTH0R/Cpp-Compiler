import React from "react";
import MonacoEditor from "react-monaco-editor";

const CodeEditor = ({ code, handleChange, isDarkMode }) => {
  return (
    <div
      style={{
        backgroundColor: isDarkMode ? "#1e1e1e" : "#fff",
        padding: "10px",
        borderRadius: "5px",
        overflow: "hidden",
      }}
    >
      <MonacoEditor
        language="cpp"
        value={code}
        onChange={handleChange}
        height="100%"
        theme={isDarkMode ? "vs-dark" : "vs-light"}
      />
    </div>
  );
};

export default CodeEditor;
