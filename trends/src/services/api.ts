// Base URL for the backend server
const BASE_URL = 'http://localhost:5000/api';

/**
 * Fetch stock symbols from the backend server.
 * Makes an API call to retrieve a list of available stock symbols.
 *
 * @returns {Promise<any[] | null>} Array of valid stock symbols or null if the request fails.
 */
export const fetchStockSymbols = async (): Promise<any[] | null> => {
  try {
    // Sending a GET request to fetch available stock symbols
    const response = await fetch(`${BASE_URL}/symbols`);

    // Check if the response is not successful, throw an error if failed
    if (!response.ok) {
      throw new Error('Failed to fetch stock symbols');
    }

    // Parse the response data to JSON format
    const data = await response.json();

    // Filter and return only valid ticker symbols using a regex pattern
    return data.results.filter((symbol: any) => /^[A-Z]+$/.test(symbol.ticker));
  } catch (error) {
    // Log the error to the console and return null if an error occurs
    console.error('Error fetching stock symbols:', error);
    return null;
  }
};

/**
 * Fetch historical stock bars data from the backend server.
 * Makes an API call to retrieve stock data for the specified symbols, date range, and timeframe.
 *
 * @param {string} symbols - A comma-separated list of stock symbols to fetch data for.
 * @param {string} start - The start date in ISO format (e.g., 2024-10-01T00:00:00Z).
 * @param {string} end - The end date in ISO format (e.g., 2024-10-03T23:59:59Z).
 * @param {string} timeframe - The timeframe of the stock data (e.g., '1min', '5min', 'day').
 * @returns {Promise<any | null>} The historical stock data or null if the request fails.
 */
export const fetchBarsData = async (
  symbols: string,
  start: string,
  end: string,
  timeframe: string
): Promise<any | null> => {
  try {
    // Constructing the request URL with properly encoded parameters
    const response = await fetch(
      `${BASE_URL}/bars?symbols=${encodeURIComponent(symbols)}&start=${encodeURIComponent(start)}&end=${encodeURIComponent(end)}&timeframe=${encodeURIComponent(timeframe)}`
    );

    // Check if the response is not successful, if not throw an error
    if (!response.ok) {
      throw new Error('Failed to fetch bars data');
    }

    // Parse the response data to JSON format and return it
    const data = await response.json();
    return data;
  } catch (error) {
    // Log the error to the console and return null if an error occurs
    console.error('Error fetching bars data:', error);
    return null;
  }
};
