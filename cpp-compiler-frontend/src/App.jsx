import React, { useState } from "react";
import Navbar from "./components/Navbar";
import CodeEditor from "./components/CodeEditor";
import OutputTerminal from "./components/OutputTerminal";
import AISidebar from "./components/AISidebar";
import axios from "axios";

function App() {
  const [code, setCode] = useState(
    '#include <iostream>\nusing namespace std;\n\nint main() {\n cout << "Hello, World!" << endl; \n return 0;\n}'
  );
  const [output, setOutput] = useState("");
  const [isCompiling, setIsCompiling] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [inputBuffer, setInputBuffer] = useState("");
  const [isAIVisible, setIsAIVisible] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);

  const handleCompile = async () => {
    setIsCompiling(true);
    try {
      const response = await axios.post(
        "http://localhost:3001/compile",
        { code, input: inputBuffer },
        { headers: { "Content-Type": "application/json" } }
      );
      setOutput(response.data.success ? response.data.output : response.data.error);
    } catch (error) {
      setOutput("Error during compilation: " + error.message);
    } finally {
      setIsCompiling(false);
    }
  };

  const handleChange = (newValue) => setCode(newValue);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  const handleTerminalInput = (e) => {
    if (e.key === "Enter") {
      setInputBuffer(inputBuffer + "\n" + e.target.value);
      e.target.value = "";
      setOutput((prevOutput) => prevOutput + "\n" + e.target.value);
    }
  };

  const clearTerminal = () => {
    setOutput("");
    setInputBuffer("");
  };

  const toggleAISection = () => setIsAIVisible((prevState) => !prevState);

  const handleAIMessage = async (message) => {
    if (!message.trim()) return; // Avoid empty messages

    // Add user's message to chat history
    setChatHistory((prevHistory) => [...prevHistory, { sender: "user", text: message }]);

    try {
      // Call AI API to fetch response
      const response = await axios.post(
        "http://localhost:3001/ai-chat", // Replace with your AI API endpoint
        { message },
        { headers: { "Content-Type": "application/json" } }
      );

      if (response.data.success) {
        // Add AI's response to chat history
        setChatHistory((prevHistory) => [
          ...prevHistory,
          { sender: "ai", text: response.data.reply.trim() },
        ]);
      } else {
        // Handle API errors
        setChatHistory((prevHistory) => [
          ...prevHistory,
          { sender: "ai", text: "Error: " + response.data.error },
        ]);
      }
    } catch (error) {
      // Handle network or other errors
      setChatHistory((prevHistory) => [
        ...prevHistory,
        { sender: "ai", text: "Error: " + error.message },
      ]);
    }
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
      <Navbar
        isCompiling={isCompiling}
        handleCompile={handleCompile}
        toggleAISection={toggleAISection}
        isDarkMode={isDarkMode}
        toggleTheme={toggleTheme}
      />

      {/* Main Content: CodeEditor and OutputTerminal */}
      <div
        className="main-container"
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "10px",
          flex: 1,
          padding: "10px",
        }}
      >
        {/* Code Editor */}
        <CodeEditor
          code={code}
          handleChange={handleChange}
          isDarkMode={isDarkMode}
        />

        {/* Output Terminal */}
        <OutputTerminal
          output={output}
          handleTerminalInput={handleTerminalInput}
          clearTerminal={clearTerminal}
          isDarkMode={isDarkMode}
        />
      </div>

      {/* AI Chatbot Sidebar */}
      <AISidebar
        isAIVisible={isAIVisible}
        toggleAISection={toggleAISection}
        chatHistory={chatHistory}
        handleAIMessage={handleAIMessage}
        isDarkMode={isDarkMode}
      />
    </div>
  );
}

export default App;