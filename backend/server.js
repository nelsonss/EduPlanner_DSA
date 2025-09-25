import express from 'express';
import { GoogleGenAI } from '@google/genai';
import cors from 'cors';
import 'dotenv/config';

// Initialize Express App
const app = express();
const port = 3001;

// --- Middleware Setup ---
// Enable CORS for all routes, allowing the frontend to communicate with this backend.
app.use(cors());
// Enable the express.json middleware to parse JSON request bodies.
app.use(express.json());

// --- API Key and GenAI Client Initialization ---
// Securely get the API key from environment variables.
const apiKey = process.env.API_KEY;
if (!apiKey) {
  console.error("FATAL ERROR: API_KEY is not defined in the .env file.");
  process.exit(1); // Exit the process with an error code if the key is missing.
}

// Initialize the Google GenAI client with the secure API key.
const ai = new GoogleGenAI({ apiKey });

// --- API Proxy Endpoint ---
app.post('/api/generate', async (req, res) => {
  try {
    // Destructure 'contents' and 'config' from the client's request body.
    const { contents, config } = req.body;

    // Basic validation to ensure 'contents' is provided.
    if (!contents) {
      return res.status(400).json({ error: 'The "contents" field is required in the request body.' });
    }

    // Forward the request to the Google GenAI API using the Node.js SDK.
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: contents,
      config: config, // Pass along any model configuration from the client.
    });

    // Determine the response format based on the client's request config.
    if (config?.responseMimeType === 'application/json') {
      // If JSON was requested, parse the text response from Gemini and send the object.
      const jsonResponse = JSON.parse(response.text);
      res.json(jsonResponse);
    } else {
      // Otherwise, send the text response in the format expected by the frontend.
      res.json({ text: response.text });
    }

  } catch (error) {
    console.error('Error proxying request to Gemini API:', error);
    // Send a generic 500 Internal Server Error response if anything goes wrong.
    res.status(500).json({ error: 'An internal server error occurred while contacting the Gemini API.' });
  }
});

// --- Start the Server ---
app.listen(port, () => {
  console.log(`🚀 Secure Gemini proxy server is running on http://localhost:${port}`);
  console.log("Ensure you have a .env file in this directory with your API_KEY.");
});
