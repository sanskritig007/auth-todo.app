"use client";

import { useCallback, useEffect, useState } from "react";

export default function Dashboard() {
  const [title, setTitle] = useState("");
  const [todos, setTodos] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const fetchTodos = useCallback(async () => {
    try {
      const token = localStorage.getItem("jwt");

      if (!token) {
        return;
      }

      const response = await fetch(
        "http://localhost:1337/api/todos",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      console.log("TODOS RESPONSE =", data);

      setTodos(data.data || []);
    } catch (error) {
      console.log(error);
    }
  }, []);

  useEffect(() => {
    const loadDashboard = async () => {
      const token = localStorage.getItem("jwt");

      if (token) {
        setIsLoggedIn(true);
        await fetchTodos();
      }
    };

    loadDashboard();
  }, [fetchTodos]);

  const handleAddTodo = async () => {
    try {
      const token = localStorage.getItem("jwt");

      if (!token) {
        alert("Please login first");
        return;
      }

      if (!title.trim()) {
        alert("Please enter a todo");
        return;
      }

      const response = await fetch(
        "http://localhost:1337/api/todos",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            data: {
              title: title.trim(),
            },
          }),
        }
      );

      const data = await response.json();

      console.log("Status:", response.status);
      console.log("Response:", data);

      if (response.ok) {
        alert("Todo Added Successfully");
        setTitle("");
        fetchTodos(); 
      } else {
        alert(data.error?.message || "Failed to add todo");
      }
    } catch (error) {
      console.log(error);
      alert("Something went wrong");
    }
  };

  return (
    <div>
      <h1>Dashboard</h1>

      <p>
        {isLoggedIn
          ? "User Logged In"
          : "User Not Logged In"}
      </p>

      <br />

      <input
        type="text"
        placeholder="Enter Todo"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <button onClick={handleAddTodo}>
        Add Todo
      </button>

      <br />
      <br />

      <h2>My Todos</h2>
      {todos?.map((todo) => (
        <div key={todo.id}>
            {todo.title}
            </div>
        ))}
    </div>
  );
}
