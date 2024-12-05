import React from "react";
import { useSpring, animated } from "react-spring";

const AISidebar = ({ isAIVisible, toggleAISection, chatHistory, handleAIMessage, isDarkMode }) => {
  const aiInputRef = React.useRef(null);
  const sidebarStyles = useSpring({
    transform: isAIVisible ? "translateX(0)" : "translateX(100%)",
  });

  return (
    <animated.div
      style={{
        ...sidebarStyles,
        position: "fixed",
        borderRadius:10,
        width: "400px",
        height: "90%",
        top: 5,
        bottom: 5,
        right: 0,
        backgroundColor: isDarkMode ? "#333" : "#fff",
        boxShadow: "-2px 0px 5px rgba(0,0,0,0.3)",
        zIndex: 9999,
        padding: "20px",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
        <h3 style={{ margin: 0, color: isDarkMode ? "#fff" : "#000" }}>AI Assistant</h3>
        <button
          onClick={toggleAISection}
          style={{
            backgroundColor: "transparent",
            color: "#FF6347",
            border: "none",
            fontSize: "20px",
            cursor: "pointer",
          }}
        >
          ×
        </button>
      </div>

      <div
        style={{
          flex: 1,
          overflowY: "auto",
          marginBottom: "20px",
          backgroundColor: isDarkMode ? "#444" : "#f8f8f8",
          padding: "10px",
          borderRadius: "8px",
        }}
      >
        {chatHistory.map((message, index) => (
          <div
            key={index}
            style={{
              marginBottom: "15px",
              textAlign: message.sender === "user" ? "right" : "left",
            }}
          >
            <div
              style={{
                display: "inline-block",
                padding: "10px",
                borderRadius: "15px",
                backgroundColor: message.sender === "user" ? "#007BFF" : "#ccc",
                color: message.sender === "user" ? "#fff" : "#000",
                maxWidth: "80%",
                wordWrap: "break-word",
                fontSize: "14px",
              }}
            >
              {message.text}
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
        <input
          ref={aiInputRef}
          type="text"
          placeholder="Ask something..."
          onKeyDown={(e) => {
            if (e.key === "Enter" && aiInputRef.current.value.trim()) {
              handleAIMessage(aiInputRef.current.value);
              aiInputRef.current.value = "";
            }
          }}
          style={{
            padding: "10px",
            width: "100%",
            borderRadius: "5px",
            border: "2px solid #ccc",
            marginBottom: "10px",
            fontSize: "14px",
            outline: "none",
          }}
        />
        <button
          onClick={() => {
            const inputValue = aiInputRef.current.value.trim();
            if (inputValue) {
              handleAIMessage(inputValue);
              aiInputRef.current.value = "";
            }
          }}
          style={{
            backgroundColor: "#007BFF",
            color: "#fff",
            border: "none",
            padding: "12px 15px",
            borderRadius: "5px",
            cursor: "pointer",
            marginBottom: "10px",
            fontSize: "16px",
          }}
        >
          Send
        </button>
      </div>
    </animated.div>
  );
};

export default AISidebar;