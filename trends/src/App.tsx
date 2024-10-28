import React from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import "./App.css";
import "./DarkMode.css";
import { FavoritesProvider } from "./context/FavoritesContext";
import MainPage from "./pages/MainPage";
import FavoritesPage from "./pages/FavoritesPage";

const App: React.FC = () => {
  return (
    <FavoritesProvider>
      <Router>
        <div className="App">
          <nav>
            {/* Navigation links to different pages */}
            <Link to="/">Home</Link> | <Link to="/favorites">Favorites</Link>
          </nav>
          <Routes>
            {/* Define the different routes */}
            <Route path="/" element={<MainPage />} />
            <Route path="/favorites" element={<FavoritesPage />} />
          </Routes>
        </div>
      </Router>
    </FavoritesProvider>
  );
};

export default App;
