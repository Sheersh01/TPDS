import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Link,
} from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import Home from "./components/Home";
import Browse from "./components/Browse";
import Watchlist from "./components/Watchlist";
import Profile from "./components/Profile";
import "./App.css";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user")) || {}
  );

  useEffect(() => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
  }, [token, user]);

  return (
    <Router>
      <div className="App">
        {token && (
          <nav className="navbar">
            <Link to="/home">Home</Link>
            <Link to="/browse">Browse</Link>
            <Link to="/watchlist">Watchlist</Link>
            <Link to="/profile">Profile</Link>
          </nav>
        )}
        <Routes>
          <Route
            path="/login"
            element={<Login setToken={setToken} setUser={setUser} />}
          />
          <Route path="/register" element={<Register />} />
          <Route
            path="/home"
            element={token ? <Home token={token} /> : <Navigate to="/login" />}
          />
          <Route
            path="/browse"
            element={
              token ? <Browse token={token} /> : <Navigate to="/login" />
            }
          />
          <Route
            path="/watchlist"
            element={
              token ? <Watchlist token={token} /> : <Navigate to="/login" />
            }
          />
          <Route
            path="/profile"
            element={
              token ? (
                <Profile user={user} setUser={setUser} token={token} />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
