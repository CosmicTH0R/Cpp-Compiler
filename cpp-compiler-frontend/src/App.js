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
    <div className="App" style={{ margin: '20px' }}>
      <h1>C++ Compiler</h1>
      <MonacoEditor
        language="cpp"
        value={code}
        onChange={handleChange}
        height="400px"
        theme="vs-dark"
      />
      <div>
        <button onClick={handleCompile} disabled={isCompiling} style={{ marginTop: '20px' }}>
          {isCompiling ? 'Compiling...' : 'Compile'}
        </button>
      </div>
      <h2>Output</h2>
      <pre style={{ background: '#f4f4f4', padding: '10px', borderRadius: '5px' }}>{output}</pre>
    </div>
  );
}

export default App;
