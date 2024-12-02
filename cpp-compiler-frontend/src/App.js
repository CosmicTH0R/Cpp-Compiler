import React, { useState, useEffect } from 'react';
import axios from 'axios';
import MonacoEditor from 'react-monaco-editor';


function App() {
  const [code, setCode] = useState('#include <iostream>\nusing namespace std;\n\nint main() {\n    cout << "Hello, World!";\n    return 0;\n}');
  const [output, setOutput] = useState('');
  const [isCompiling, setIsCompiling] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);

  const handleCompile = async () => {
    setIsCompiling(true);
    try {
      const response = await axios.post('http://localhost:3001/compile', code, {
        headers: { 'Content-Type': 'text/plain' },
      });

      if (response.data.success) {
        setOutput(response.data.output);
      } else {
        setOutput(response.data.error);
      }
    } catch (error) {
      setOutput('Error during compilation');
    } finally {
      setIsCompiling(false);
    }
  };

  const handleChange = (newValue) => {
    setCode(newValue);
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <div
      style={{
        backgroundColor: isDarkMode ? '#000000' : '#D3D3D3',
        color: isDarkMode ? '#fff' : '#000',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Navbar */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          padding: '10px 20px',
          backgroundColor: isDarkMode ? '#333' : '#fff',
          color: isDarkMode ? '#fff' : '#000',
        }}
      >
        <h2 style={{ margin: 0 }}>C++ Compiler</h2>
        <div>
          <button
            onClick={handleCompile}
            disabled={isCompiling}
            style={{
              backgroundColor: '#007BFF',
              color: '#fff',
              border: 'none',
              padding: '10px 20px',
              cursor: 'pointer',
              fontSize: '16px',
              borderRadius: '5px',
            }}
          >
            {isCompiling ? 'Compiling...' : 'Compile'}
          </button>
          <button
            onClick={toggleTheme}
            style={{
              backgroundColor: '#28a745',
              color: '#fff',
              border: 'none',
              padding: '10px 20px',
              cursor: 'pointer',
              fontSize: '16px',
              marginLeft: '10px',
              borderRadius: '5px',
            }}
          >
            {isDarkMode ? 'Light Mode' : 'Dark Mode'}
          </button>
        </div>
      </div>

      {/* Responsive Layout */}
      <div
        className="main-container"
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gridTemplateRows: '1fr',
          gap: '10px',
          flex: 1,
          padding: '10px',
        }}
      >
        {/* Editor Section */}
        <div
          style={{
            backgroundColor: isDarkMode ? '#1e1e1e' : '#fff',
            padding: '10px',
            borderRadius: '5px',
            overflow: 'hidden',
          }}
        >
          <MonacoEditor
            language="cpp"
            value={code}
            onChange={handleChange}
            height="100%"
            theme={isDarkMode ? 'vs-dark' : 'vs-light'}
          />
        </div>

        {/* Output Section */}
        <div
          style={{
            backgroundColor: isDarkMode ? '#2d2d2d' : '#f4f4f4',
            color: isDarkMode ? '#fff' : '#000',
            padding: '10px',
            borderRadius: '5px',
            overflowY: 'auto',
          }}
        >
          <h2>Output</h2>
          <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>{output}</pre>
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
