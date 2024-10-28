import React, { useState, useEffect } from "react";
import { fetchBarsData, fetchStockSymbols } from "../services/api";
import { Bar, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";
import zoomPlugin from "chartjs-plugin-zoom";
import { useFavorites, FavoriteItem } from "../context/FavoritesContext";

// Register ChartJS components, including zoom functionality
ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Tooltip, Legend, zoomPlugin);

// Define the data structure for each bar (candlestick) data point
interface BarData {
  symbol: string;
  close: number;
  high: number;
  low: number;
  open: number;
  timestamp: string;
  volume: number;
  tradesCount: number;
}

// Define the data structure for stock symbols
interface SymbolData {
  ticker: string;
  name: string;
}

// Function to get the current date in a string format (yyyy-mm-dd)
const getCurrentDate = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const MainPage: React.FC = () => {
  // State hooks to manage the data for charts, user input, and UI settings
  const [barsData, setBarsData] = useState<BarData[]>([]);
  const [symbolsList, setSymbolsList] = useState<SymbolData[]>([]);
  const [stockSymbol1, setStockSymbol1] = useState<string>("");
  const [stockSymbol2, setStockSymbol2] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [startDate, setStartDate] = useState<string>(getCurrentDate());
  const [endDate, setEndDate] = useState<string>(getCurrentDate());
  const [timeframe, setTimeframe] = useState<string>("1min");
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const { addFavorite, updateFavorite, selectedFavorite, selectFavoriteForEdit, favorites } = useFavorites();

  // State to handle updating an existing favorite
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [updateIndex, setUpdateIndex] = useState<number | null>(null);
  const [chartTypeOHLC, setChartTypeOHLC] = useState<"line" | "bar">("line");
  const [chartTypeVolume, setChartTypeVolume] = useState<"line" | "bar">("bar");
  const [chartTypeTrades, setChartTypeTrades] = useState<"line" | "bar">("bar");

  // Manage dark mode by toggling class on body element
  useEffect(() => {
    const body = document.querySelector("body");
    if (isDarkMode) {
      body?.classList.add("dark-mode");
    } else {
      body?.classList.remove("dark-mode");
    }
  }, [isDarkMode]);

  // Fetch stock symbols to provide a list of options for the user
  useEffect(() => {
    const loadSymbols = async () => {
      try {
        const symbolsResponse = await fetchStockSymbols();
        if (symbolsResponse) {
          setSymbolsList(symbolsResponse);
        } else {
          setError("Failed to fetch stock symbols");
        }
      } catch (error) {
        setError("An error occurred while fetching symbols");
      }
    };
    loadSymbols();
  }, []);

  // Load selected favorite when updating an existing favorite item
  useEffect(() => {
    if (selectedFavorite) {
      setStockSymbol1(selectedFavorite.stockSymbol1);
      setStockSymbol2(selectedFavorite.stockSymbol2 || "");
      setStartDate(selectedFavorite.startDate);
      setEndDate(selectedFavorite.endDate);
      setTimeframe(selectedFavorite.timeframe);
      setIsUpdating(true);
      setUpdateIndex(favorites.indexOf(selectedFavorite)); // Set updateIndex for proper update
    }
  }, [selectedFavorite]);

  // Handle fetching bars data for selected symbols and timeframe
  const handleFetchBars = async () => {
    setLoading(true);
    setError("");

    try {
      let symbols = stockSymbol1;
      if (stockSymbol2) {
        symbols += `,${stockSymbol2}`;
      }

      const barsDataResponse = await fetchBarsData(
        symbols,
        `${startDate}T00:00:00Z`,
        `${endDate}T23:59:59Z`,
        timeframe
      );

      if (barsDataResponse && barsDataResponse.bars) {
        const formattedBars = Object.entries(barsDataResponse.bars).flatMap(([symbol, barsArray]) => {
          return (barsArray as any[]).map((bar: any) => ({
            symbol,
            close: bar.c,
            high: bar.h,
            low: bar.l,
            open: bar.o,
            timestamp: bar.t,
            volume: bar.v,
            tradesCount: bar.n,
          }));
        });
        setBarsData(formattedBars);
      } else {
        setError("No bars data available.");
      }
    } catch (error) {
      setError("Failed to fetch bars data.");
    } finally {
      setLoading(false);
    }
  };

  // Handle form submission for fetching data or updating favorites
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isUpdating && updateIndex !== null) {
      const updatedFavorite: FavoriteItem = {
        stockSymbol1,
        stockSymbol2,
        startDate,
        endDate,
        timeframe,
      };
      updateFavorite(updateIndex, updatedFavorite);
      setIsUpdating(false);
      setUpdateIndex(null);
      selectFavoriteForEdit(null);
    } else {
      handleFetchBars();
    }
  };

  // Add the current form data as a new favorite
  const handleAddToFavorites = () => {
    const newFavorite: FavoriteItem = {
      stockSymbol1,
      stockSymbol2,
      startDate,
      endDate,
      timeframe,
    };
    addFavorite(newFavorite);
  };

  // Chart configuration for OHLC data
  const chartDataOHLC = {
    labels: barsData.map((bar) => new Date(bar.timestamp).toLocaleString()),
    datasets: [
      {
        label: "Open",
        data: barsData.map((bar) => bar.open),
        borderColor: "rgba(75, 192, 192, 0.6)",
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        fill: false,
      },
      {
        label: "High",
        data: barsData.map((bar) => bar.high),
        borderColor: "rgba(255, 99, 132, 0.6)",
        backgroundColor: "rgba(255, 99, 132, 0.6)",
        fill: false,
      },
      {
        label: "Low",
        data: barsData.map((bar) => bar.low),
        borderColor: "rgba(54, 162, 235, 0.6)",
        backgroundColor: "rgba(54, 162, 235, 0.6)",
        fill: false,
      },
      {
        label: "Close",
        data: barsData.map((bar) => bar.close),
        borderColor: "rgba(153, 102, 255, 0.6)",
        backgroundColor: "rgba(153, 102, 255, 0.6)",
        fill: false,
      },
    ],
  };

  // Chart configuration for volume data
  const chartDataVolume = {
    labels: barsData.map((bar) => new Date(bar.timestamp).toLocaleString()),
    datasets: [
      {
        label: "Volume",
        data: barsData.map((bar) => bar.volume),
        backgroundColor: "rgba(255, 206, 86, 0.6)",
      },
    ],
  };

  // Chart configuration for trades count data
  const chartDataTrades = {
    labels: barsData.map((bar) => new Date(bar.timestamp).toLocaleString()),
    datasets: [
      {
        label: "Trades Count",
        data: barsData.map((bar) => bar.tradesCount),
        backgroundColor: "rgba(75, 192, 192, 0.6)",
      },
    ],
  };

  // Common chart options, including zoom and pan functionality
  const chartOptions = {
    responsive: true,
    plugins: {
      zoom: {
        pan: {
          enabled: true,
          mode: "x" as const,
        },
        zoom: {
          wheel: {
            enabled: true,
          },
          pinch: {
            enabled: true,
          },
          mode: "x" as const,
        },
      },
    },
  };

  return (
    <div className="main-page">
      <h1>Bars Data</h1>
      <button onClick={() => setIsDarkMode(!isDarkMode)}>Switch to {isDarkMode ? "Light Mode" : "Dark Mode"}</button>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Stock Symbol 1:</label>
            <input
              type="text"
              value={stockSymbol1}
              onChange={(e) => setStockSymbol1(e.target.value.toUpperCase())}
              placeholder="e.g. AAPL"
              list="symbols-list"
            />
            <datalist id="symbols-list">
              {symbolsList.map((symbol) => (
                <option key={symbol.ticker} value={symbol.ticker}>
                  {symbol.ticker} ({symbol.name})
                </option>
              ))}
            </datalist>
          </div>
          <div className="form-group">
            <label>Stock Symbol 2 (optional):</label>
            <input
              type="text"
              value={stockSymbol2}
              onChange={(e) => setStockSymbol2(e.target.value.toUpperCase())}
              placeholder="e.g. TSLA"
              list="symbols-list"
            />
          </div>
          <div className="form-group">
            <label>Start Date:</label>
            <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
          </div>
          <div className="form-group">
            <label>End Date:</label>
            <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
          </div>
          <div className="form-group">
            <label>Timeframe:</label>
            <select value={timeframe} onChange={(e) => setTimeframe(e.target.value)}>
              <option value="1min">1 Minute</option>
              <option value="5min">5 Minutes</option>
              <option value="15min">15 Minutes</option>
              <option value="day">Daily</option>
            </select>
          </div>
          <button type="submit">{isUpdating ? "Update Favorite" : "Fetch Bars Data"}</button>
        </form>
      )}
      <button onClick={handleAddToFavorites}>Add to Favorites</button>
      <div className="charts-wrapper">
        {barsData.length > 0 && (
          <>
            <div className="chart-container">
              <h2>OHLC Data</h2>
              <label>Chart Type:</label>
              <select value={chartTypeOHLC} onChange={(e) => setChartTypeOHLC(e.target.value as "line" | "bar")}>
                <option value="line">Line Chart</option>
                <option value="bar">Bar Chart</option>
              </select>
              {chartTypeOHLC === "line" ? (
                <Line data={chartDataOHLC} options={chartOptions} />
              ) : (
                <Bar data={chartDataOHLC} options={chartOptions} />
              )}
            </div>

            <div className="chart-container">
              <h2>Volume Data</h2>
              <label>Chart Type:</label>
              <select value={chartTypeVolume} onChange={(e) => setChartTypeVolume(e.target.value as "line" | "bar")}
              >
                <option value="line">Line Chart</option>
                <option value="bar">Bar Chart</option>
              </select>
              {chartTypeVolume === "line" ? (
                <Line data={chartDataVolume} options={chartOptions} />
              ) : (
                <Bar data={chartDataVolume} options={chartOptions} />
              )}
            </div>

            <div className="chart-container">
              <h2>Trades Count Data</h2>
              <label>Chart Type:</label>
              <select value={chartTypeTrades} onChange={(e) => setChartTypeTrades(e.target.value as "line" | "bar")}
              >
                <option value="line">Line Chart</option>
                <option value="bar">Bar Chart</option>
              </select>
              {chartTypeTrades === "line" ? (
                <Line data={chartDataTrades} options={chartOptions} />
              ) : (
                <Bar data={chartDataTrades} options={chartOptions} />
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default MainPage;
