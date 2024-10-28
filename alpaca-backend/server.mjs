import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';
import dotenv from 'dotenv'; // Import dotenv to load environment variables

// Load environment variables from .env file
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware configuration
app.use(cors()); // Enable CORS to allow requests from different origins
app.use(express.json()); // Parse incoming JSON requests

// API keys for Alpaca and Polygon services loaded from environment variables
const ALPACA_API_KEY = process.env.ALPACA_API_KEY;
const ALPACA_API_SECRET = process.env.ALPACA_API_SECRET;
const POLYGON_API_KEY = process.env.POLYGON_API_KEY;

// Endpoint to fetch bars data from Alpaca
// Uses the 'sip' feed for broader market data
app.get('/api/bars', async (req, res) => {
  const { symbols, start, end, timeframe } = req.query;

  // Validate query parameters
  if (!symbols || !start || !end || !timeframe) {
    return res.status(400).json({ error: "Parameters 'symbols', 'start', 'end', and 'timeframe' are required" });
  }

  try {
    // Construct the URL for fetching bar data from Alpaca
    const url = `https://data.alpaca.markets/v2/stocks/bars?symbols=${symbols}&start=${start}&end=${end}&timeframe=${timeframe}&feed=sip`;

    // Send the request to Alpaca with the appropriate headers for authentication
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'APCA-API-KEY-ID': ALPACA_API_KEY,
        'APCA-API-SECRET-KEY': ALPACA_API_SECRET,
        'Accept': 'application/json',
      },
    });

    // Handle non-successful responses by returning an appropriate error message
    if (!response.ok) {
      const errorMessage = await response.text();
      return res.status(response.status).json({
        error: `Failed to fetch bars data from Alpaca: ${errorMessage}`,
      });
    }

    // Successfully retrieve and send bar data as a response
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Error fetching bars data:', error); // Log error for server-side debugging
    res.status(500).json({ error: 'An error occurred while fetching bars data' });
  }
});

// Endpoint to fetch stock symbols from Polygon.io
app.get('/api/symbols', async (req, res) => {
  try {
    // Construct the URL for fetching stock symbols, limiting to 100 for simplicity
    const url = `https://api.polygon.io/v3/reference/tickers?active=true&limit=100&apiKey=${POLYGON_API_KEY}`;
    const response = await fetch(url);

    // Handle non-successful responses by returning an appropriate error message
    if (!response.ok) {
      const errorMessage = await response.text();
      return res.status(response.status).json({
        error: `Failed to fetch symbols from Polygon: ${errorMessage}`,
      });
    }

    // Successfully retrieve and send symbols data as a response
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Error fetching symbols:', error); // Log error for server-side debugging
    res.status(500).json({ error: 'An error occurred while fetching symbols' });
  }
});

// Start the server and listen on the defined port
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
