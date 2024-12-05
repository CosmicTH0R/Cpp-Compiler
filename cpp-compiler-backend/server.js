const express = require("express");
const bodyParser = require("body-parser");
const { exec } = require("child_process");
const path = require("path");
const fs = require("fs");
const cors = require("cors");
require('dotenv').config();
const { OpenAI } = require("openai"); // Import OpenAI SDK

const app = express();
const port = 3001;

// OpenAI API setup
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Load the API key from the environment variable
});

// Enable CORS for all routes
app.use(cors());
app.use(bodyParser.json()); // Parse JSON requests

// Test route
app.get("/", (req, res) => {
  res.send("Backend is working!");
});

// Compile route with input handling
app.post("/compile", (req, res) => {
  const { code, input } = req.body; // Destructure code and input from the request body
  const filePath = path.join(__dirname, "temp.cpp");
  const outputFilePath = path.join(__dirname, "output.exe");

  // Remove the existing output.exe file if it exists
  if (fs.existsSync(outputFilePath)) {
    fs.unlinkSync(outputFilePath);
  }

  // Write the provided code to a temporary file (temp.cpp)
  fs.writeFileSync(filePath, code);

  // Compile the code using g++
  exec(
    `g++ "${filePath}" -o "${outputFilePath}"`,
    (compileErr, stdout, stderr) => {
      if (compileErr) {
        console.error("Compilation error:", stderr);
        return res.json({ success: false, error: stderr });
      }

      console.log("Compilation successful:", stdout);

      // Pass input via echo and execute the program
      exec(`echo "${input}" | "${outputFilePath}"`, (execErr, execStdout, execStderr) => {
        if (execErr) {
          console.error("Execution error:", execStderr);
          return res.json({ success: false, error: execStderr });
        }

        console.log("Execution successful:", execStdout);
        
        // Return the output of the program
        return res.json({ success: true, output: execStdout });
      });
    }
  );
});

// AI Chatbot route
app.post("/ai-chat", async (req, res) => {
  const { message } = req.body;

  // Check if the message is empty
  if (!message || message.trim() === "") {
    return res.json({ success: false, error: "Message cannot be empty." });
  }

  try {
    // Request the AI to generate a response
    const aiResponse = await openai.chat.completions.create({
      model: "gpt-3.5-turbo", // Specify the GPT model you want to use
      messages: [{ role: "user", content: message }],
    });

    // Extract the AI reply from the response
    const reply = aiResponse.choices[0].message.content;

    // Return the AI's response
    return res.json({ success: true, reply: reply });
  } catch (error) {
    console.error("Error processing AI message:", error.message);
    console.error("Stack trace:", error.stack);
    return res.json({ success: false, error: error.message });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Backend running at http://localhost:${port}`);
});
