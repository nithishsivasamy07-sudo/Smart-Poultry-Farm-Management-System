/**
 * Example backend Express route for communicating with the Antigravity API.
 * This ensures the API key is not exposed to the client-side frontend bundle.
 * 
 * To run:
 * 1. npm install express cors dotenv
 * 2. node server/ai-api.js
 */

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 3001;

app.post('/api/chat', async (req, res) => {
  try {
    const { messages } = req.body;

    // Call the Antigravity AI logic (or your AI provider logic)
    // For local mocking/example purposes when no real API is connected:
    
    // const response = await fetch('https://api.antigravity.foo/v1/chat/completions', {
    //   method: 'POST',
    //   headers: {
    //     'Authorization': `Bearer ${process.env.ANTIGRAVITY_API_KEY}`,
    //     'Content-Type': 'application/json'
    //   },
    //   body: JSON.stringify({
    //     model: 'antigravity-flash',
    //     messages: messages
    //   })
    // });
    
    // const data = await response.json();
    // const reply = data.choices[0].message.content;

    // Simulated response for immediate frontend testing:
    const reply = "Hello! I am your modular AI Assistant. How can I help with your poultry farm today?";

    res.json({ reply });

  } catch (error) {
    console.error("Error communicating with AI:", error);
    res.status(500).json({ error: "Failed to communicate with AI Assistant." });
  }
});

app.listen(PORT, () => {
  console.log(`AI Backend API running on http://localhost:${PORT}`);
});
