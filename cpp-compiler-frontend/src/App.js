import React, { useState } from 'react';
import axios from 'axios';
import MonacoEditor from 'react-monaco-editor';

function App() {
  const [code, setCode] = useState('#include <iostream>\nusing namespace std;\n\nint main() {\n    cout << "Hello, World!";\n    return 0;\n}');
  const [output, setOutput] = useState('');
  const [isCompiling, setIsCompiling] = useState(false);

  const handleCompile = async () => {
    setIsCompiling(true);
    try {
      // Send the C++ code to the backend for compilation
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

  return (
    <div className="App">
      {/* Navbar */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        padding: '10px 20px',
        backgroundColor: '#333',
        color: '#fff'
      }}>
        <h2 style={{ margin: 0 }}>C++ Compiler</h2>
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
            borderRadius: '5px'
          }}
        >
          {isCompiling ? 'Compiling...' : 'Compile'}
        </button>
      </div>

      <div style={{ display: 'flex', margin: '20px' }}>
        <div style={{ flex: 1, marginRight: '20px' }}>
          <MonacoEditor
            language="cpp"
            value={code}
            onChange={handleChange}
            height="400px"
            theme="vs-dark"
          />
        </div>
        <div style={{ flex: 1 }}>
          <h1>Terminal</h1>
          <h2>Output</h2>
          <pre style={{ background: '#f4f4f4', padding: '10px', borderRadius: '5px', minHeight: '400px' }}>
            {output}
          </pre>
        </div>
      </div>
    </div>
  );
}

export default App;
