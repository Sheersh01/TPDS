import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [count, setCount] = useState(0);
  //chsnges

  // Fetch initial count
  useEffect(() => {
    axios
      .get("http://localhost:5000/count")
      .then((response) => setCount(response.data.count))
      .catch((error) => console.error("Error fetching count:", error));
  }, []);

  // Update count
  const updateCount = (newCount) => {
    axios
      .post("http://localhost:5000/count", { count: newCount })
      .then((response) => setCount(response.data.count))
      .catch((error) => console.error("Error updating count:", error));
  };

  return (
    <div className="App">
      <h1>Counter App</h1>
      <h2>Count: {count}</h2>
      <button onClick={() => updateCount(count + 1)}>Increment</button>
      <button onClick={() => updateCount(count - 1)}>Decrement</button>
    </div>
  );
}

export default App;
