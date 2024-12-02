import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import MonacoEditor from "react-monaco-editor";

function App() {
  const [code, setCode] = useState(
    '#include <iostream>\nusing namespace std;\n\nint main() {\n cout << "Hello, World!" << endl; \n return 0;\n}'
  );
  const [output, setOutput] = useState("");
  const [isCompiling, setIsCompiling] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [inputBuffer, setInputBuffer] = useState(""); // Buffer for capturing input for cin
  const outputRef = useRef(null); // Reference for the output area to handle focus/scroll

  const handleCompile = async () => {
    setIsCompiling(true);
    try {
      const response = await axios.post(
        "http://localhost:3001/compile",
        { code, input: inputBuffer }, // Send code and input buffer to backend
        { headers: { "Content-Type": "application/json" } }
      );

      if (response.data.success) {
        setOutput(response.data.output); // Update output with the result
      } else {
        setOutput(response.data.error); // Update output with any errors
      }
    } catch (error) {
      setOutput("Error during compilation");
    } finally {
      setIsCompiling(false);
    }
  };

  const handleChange = (newValue) => {
    setCode(newValue); // Update the code in the editor
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode); // Toggle between dark and light mode
  };

  const handleTerminalInput = (e) => {
    if (e.key === "Enter") {
      // When Enter is pressed, send the current input and capture it
      setInputBuffer(inputBuffer + "\n" + e.target.value);
      e.target.value = ""; // Clear the input field after capturing

      // Simulate typing in terminal
      setOutput((prevOutput) => prevOutput + "\n" + e.target.value);
    }
  };

  const clearTerminal = () => {
    setOutput(""); // Clear the terminal content
    setInputBuffer(""); // Clear the input buffer
  };

  return (
    <div
      style={{
        backgroundColor: isDarkMode ? "#000000" : "#D3D3D3",
        color: isDarkMode ? "#fff" : "#000",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Navbar */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          padding: "10px 20px",
          backgroundColor: isDarkMode ? "#333" : "#fff",
          color: isDarkMode ? "#fff" : "#000",
        }}
      >
        <h2 style={{ margin: 0 }}>C++ Compiler</h2>
        <div>
          <button
            onClick={handleCompile}
            disabled={isCompiling}
            style={{
              backgroundColor: "#007BFF",
              color: "#fff",
              border: "none",
              padding: "10px 20px",
              cursor: "pointer",
              fontSize: "16px",
              borderRadius: "5px",
            }}
          >
            {isCompiling ? "Compiling..." : "Compile"}
          </button>
          <button
            onClick={toggleTheme}
            style={{
              backgroundColor: "#28a745",
              color: "#fff",
              border: "none",
              padding: "10px 20px",
              cursor: "pointer",
              fontSize: "16px",
              marginLeft: "10px",
              borderRadius: "5px",
            }}
          >
            {isDarkMode ? "Light Mode" : "Dark Mode"}
          </button>
        </div>
      </div>

      {/* Responsive Layout */}
      <div
        className="main-container"
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gridTemplateRows: "1fr",
          gap: "10px",
          flex: 1,
          padding: "10px",
        }}
      >
        {/* Editor Section */}
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

        {/* Output Section as Terminal */}
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
          {/* Output / Terminal header */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "10px",
            }}
          >
            <h2 style={{ margin: 0, pointerEvents: "none" }}>Output</h2>{" "}
            {/* Fixed and non-editable */}
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

          {/* Editable terminal area */}
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
      </div>

      <style>
        {`
          @media (max-width: 768px) {
            .main-container {
              grid-template-columns: 1fr;
              grid-template-rows: auto auto;
            }
          }
        `}
      </style>
    </div>
  );
}

export default App;