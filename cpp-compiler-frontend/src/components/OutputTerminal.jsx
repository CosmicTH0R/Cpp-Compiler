import React from "react";

const OutputTerminal = ({
  output,
  handleTerminalInput,
  clearTerminal,
  isDarkMode,
}) => {
  return (
    <div
      style={{
        backgroundColor: isDarkMode ? "#2d2d2d" : "#f4f4f4",
        color: isDarkMode ? "#fff" : "#000",
        padding: "10px",
        borderRadius: "5px",
        overflowY: "auto",
        minHeight: "200px",
        whiteSpace: "pre-wrap",
        fontFamily: "monospace",
        fontSize: "14px",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "10px",
        }}
      >
        <h2 style={{ margin: 0, pointerEvents: "none" }}>Output</h2>
        <button
          onClick={clearTerminal}
          style={{
            backgroundColor: "#dc3545",
            color: "#fff",
            border: "none",
            padding: "5px 10px",
            cursor: "pointer",
            fontSize: "14px",
            borderRadius: "5px",
          }}
        >
          Clear
        </button>
      </div>
      <div
        contentEditable
        suppressContentEditableWarning
        style={{
          flex: 1,
          padding: "5px",
          minHeight: "100px",
          border: "1px solid #ddd",
          overflowY: "auto",
          fontFamily: "monospace",
          whiteSpace: "pre-wrap",
        }}
        onKeyDown={handleTerminalInput}
      >
        {output}
      </div>
    </div>
  );
};

export default OutputTerminal;
