const express = require('express');
const bodyParser = require('body-parser');
const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');
const cors = require('cors');  // Importing CORS

const app = express();
const port = 3001;

app.use(cors());  // Enabling CORS for all routes
app.use(bodyParser.text({ type: 'text/plain' }));

app.get('/', (req, res) => {
  res.send('Backend is working!');
});

app.post('/compile', (req, res) => {
  const code = req.body;
  const filePath = path.join(__dirname, 'temp.cpp');
  const outputFilePath = path.join(__dirname, 'output.exe');

  // Delete the existing output.exe if it exists
  if (fs.existsSync(outputFilePath)) {
    fs.unlinkSync(outputFilePath);
  }

  // Write the provided code to temp.cpp
  fs.writeFileSync(filePath, code);

  // Compile the code with g++
  exec(`g++ "${filePath}" -o "${outputFilePath}"`, (err, stdout, stderr) => {
    if (err) {
      return res.json({ success: false, error: stderr });
    }

    // Run the compiled executable
    exec(`cmd.exe /c "${outputFilePath}"`, (execErr, execStdout, execStderr) => {
      if (execErr) {
        return res.json({ success: false, error: execStderr });
      }
      // Return the output of the compiled program
      return res.json({ success: true, output: execStdout });
    });
  });
});

app.listen(port, () => {
  console.log(`Backend running at http://localhost:${port}`);
});

