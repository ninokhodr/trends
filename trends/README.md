# Stock Trends Application

This is a full-stack web application designed to visualize stock market trends, fetching data from Alpaca and Polygon APIs. Users can view historical stock data, manage their favorite stock symbols, and switch between light and dark modes for a customized experience.

## Features

- **Stock Data Visualization**: View historical OHLC (Open, High, Low, Close) data, trading volume, and trade count for selected stocks.
- **Favorites Management**: Add and remove stock symbols to a personalized favorites list for quick access.
- **Dark Mode**: Switch between light and dark modes for a customized viewing experience.
- **Interactive Charts**: Utilize zooming and panning features in charts for better analysis of stock data.

## Technologies Used

### Frontend

- **React**: JavaScript library for building user interfaces.
- **React Router**: For client-side routing.
- **Chart.js & react-chartjs-2**: Used for creating interactive charts.
- **Context API**: Manage global state like favorite stocks.

### Backend

- **Node.js & Express**: Backend server to handle API requests.
- **Alpaca Market Data API**: Provides historical stock data.
- **Polygon.io API**: Fetches available stock symbols.

### Other Tools

- **dotenv**: Manage environment variables securely.
- **Vite**: Fast build tool for modern web projects.
- **CORS**: Middleware to enable cross-origin requests.

## Installation

### Prerequisites

- **Node.js** and **npm** must be installed on your system.

### Setup Instructions

#### 1. Clone the Repository
```sh
git clone YOUR_REPOSITORY_URL
cd trends
```

#### 2. Backend Setup

To set up the backend on your local machine, follow these steps:

- **Navigate to the backend folder**:
  ```sh
  cd alpaca-backend
  ```

- **Copy the example environment file**:
  ```sh
  cp .env.example .env
  ```

- **Edit the `.env` file**: Open `.env` and replace placeholder values with your actual API keys:
  ```sh
  ALPACA_API_KEY=your_real_alpaca_api_key
  ALPACA_API_SECRET=your_real_alpaca_api_secret
  POLYGON_API_KEY=your_real_polygon_api_key
  ```

- **Install the necessary dependencies**:
  ```sh
  npm install
  ```

- **Start the backend server**:
  ```sh
  npm start
  ```

This will start the backend server on `http://localhost:5000` by default (or another specified port). Keep this terminal window open while using the application, as the server will stop if you close it.

#### 3. Frontend Setup

- **Navigate to the frontend folder**:
  ```sh
  cd ../trends
  ```

- **Install the necessary dependencies**:
  ```sh
  npm install
  ```

- **Start the development server**:
  ```sh
  npm start
  ```

By default, the frontend server will run on [http://localhost:3000](http://localhost:3000).

## Usage

1. **Start Both Servers**: Make sure both the backend and frontend servers are running.
2. **Access the Application**: Open your browser and go to [http://localhost:3000](http://localhost:3000).
3. **Search Stock Data**: Enter stock symbols and specify a date range to visualize historical OHLC data.
4. **Favorites Management**: Save stocks to your favorites list for easy access.
5. **Switch Themes**: Click the button to toggle between light and dark modes.

## Project Structure

- **alpaca-backend/**: Contains the backend Express server (`server.mjs`) and handles API calls to Alpaca and Polygon services.
- **trends/**: Contains the frontend React application (`src/` folder contains components, pages, styles, and services).

## Running the Backend Locally

To use the backend on your own computer:

1. Clone the repository as shown in the **Installation** section.
2. In the `alpaca-backend` folder, copy `.env.example` to `.env`, then open `.env` and replace placeholders with your actual API keys.
3. Install dependencies using `npm install`, and start the backend server using `node server.mjs`.

Your backend will run on `http://localhost:5000` and can be accessed by the frontend running on `http://localhost:3000`.

## Deployment

To deploy this project, follow these general steps:

### 1. Backend Deployment

Deploy the Express server using services like **Heroku**, **AWS**, or **DigitalOcean**. Make sure to properly configure environment variables on the hosting platform.

### 2. Frontend Deployment

Deploy the React frontend using services like **Netlify**, **Vercel**, or **GitHub Pages**. Ensure that it points to the correct URL for your backend.

## API Endpoints

### Backend Endpoints

- **Fetch Stock Symbols**:
  - **GET** `/api/symbols`
  - Fetches the list of available stock symbols from Polygon.io.

- **Fetch Historical Bars Data**:
  - **GET** `/api/bars`
  - **Parameters**:
    - `symbols`: Comma-separated list of stock symbols.
    - `start`, `end`: Date range for fetching the data.
    - `timeframe`: The desired timeframe (e.g., 1min, day).

## Acknowledgements

- Thanks to **Alpaca Markets** and **Polygon.io** for providing the stock data APIs.
- Special thanks to the **open-source community** for the wonderful tools and libraries that made this project possible.

## Contributions

Contributions are welcome! Please feel free to submit a **Pull Request** or open an **Issue** for suggestions and improvements.

## Contact

For any questions or inquiries, feel free to contact the repository owner or submit an issue.