import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import Projects from "./components/Projects";
import "./App.css";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token") || "");

  useEffect(() => {
    localStorage.setItem("token", token);
  }, [token]);

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/login" element={<Login setToken={setToken} />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/projects"
            element={
              token ? <Projects token={token} /> : <Navigate to="/login" />
            }
          />
          <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
