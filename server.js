const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

// Serve static files from the current directory
app.use(express.static(__dirname));

// API endpoint for conversation data
app.get('/api/conversationData', (req, res) => {
  res.json([
    {
      prompt: "¿Cómo estás?",
      options: [
        { text: "Estoy bien, gracias.", correct: true },
        { text: "Tengo hambre.", correct: false },
        { text: "Me llamo Juan.", correct: false }
      ]
    },
    {
      prompt: "¿Qué hora es?",
      options: [
        { text: "Son las tres.", correct: true },
        { text: "Tengo hambre.", correct: false },
        { text: "Me gusta el café.", correct: false }
      ]
    }
  ]);
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
