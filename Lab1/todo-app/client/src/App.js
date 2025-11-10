import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");

  // Fetch todos from backend
  useEffect(() => {
    axios
      .get("http://localhost:5000/todos")
      .then((response) => setTodos(response.data))
      .catch((error) => console.error("Error fetching todos:", error));
  }, []);

  // Add a new todo
  const addTodo = () => {
    if (newTodo.trim()) {
      axios
        .post("http://localhost:5000/todos", { text: newTodo })
        .then((response) => {
          setTodos([...todos, response.data]);
          setNewTodo("");
        })
        .catch((error) => console.error("Error adding todo:", error));
    }
  };

  return (
    <div className="App">
      <h1>Simple To-Do List</h1>
      <input
        type="text"
        value={newTodo}
        onChange={(e) => setNewTodo(e.target.value)}
        placeholder="Enter a new task"
      />
      <button onClick={addTodo}>Add Task</button>
      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>{todo.text}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
