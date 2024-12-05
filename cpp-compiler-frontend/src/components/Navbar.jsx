import React from "react";
import { FaRobot } from "react-icons/fa";

function Navbar({
  toggleTheme,
  isDarkMode,
  toggleAISection,
  handleCompile,
  isCompiling,
}) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "10px 20px",
        backgroundColor: isDarkMode ? "#333" : "#fff",
        color: isDarkMode ? "#fff" : "#000",
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
      }}
    >
      {/* Left: Branding */}
      <h2 style={{ margin: 0 }}>EasyCompilerforU</h2>

      {/* Center: Compile Button */}
      <button
        onClick={handleCompile}
        disabled={isCompiling}
        style={{
          backgroundColor: isCompiling ? "#888" : "#007BFF",
          color: "#fff",
          border: "none",
          padding: "10px 20px",
          cursor: isCompiling ? "not-allowed" : "pointer",
          fontSize: "16px",
          borderRadius: "5px",
          flex: 1,
          maxWidth: "150px",
          textAlign: "center",
        }}
      >
        {isCompiling ? "Compiling..." : "Compile"}
      </button>

      {/* Right: Ask AI and Theme Toggle */}
      <div style={{ display: "flex", gap: "10px" }}>
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
        <button
          onClick={toggleAISection}
          style={{
            backgroundColor: "#007BFF",
            color: "#fff",
            border: "none",
            padding: "10px 20px",
            cursor: "pointer",
            fontSize: "16px",
            marginLeft: "10px",
            borderRadius: "5px",
          }}
        >
          <FaRobot style={{ marginRight: "8px" }} />
          Ask AI
        </button>
      </div>
    </div>
  );
}

export default Navbar;
