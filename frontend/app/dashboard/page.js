"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

export default function Dashboard() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [todos, setTodos] = useState([]);

  const fetchTodos = useCallback(async () => {
    try {
      const token = localStorage.getItem("jwt");

      if (!token) {
        return;
      }

      const response = await fetch("http://localhost:1337/api/todos", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

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

      if (!token) {
        router.push("/signIn");
        return;
      }

      await fetchTodos();
    };

    loadDashboard();
  }, [fetchTodos, router]);

  const handleLogout = () => {
    localStorage.removeItem("jwt");
    localStorage.removeItem("user");
    router.push("/signIn");
  };

  const handleAddTodo = async (event) => {
    event.preventDefault();

    try {
      const token = localStorage.getItem("jwt");

      if (!token) {
        alert("Please login first");
        router.push("/signIn");
        return;
      }

      if (!title.trim()) {
        alert("Please enter a todo");
        return;
      }

      const response = await fetch("http://localhost:1337/api/todos", {
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
      });

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

  const handleToggleStatus = async (todo) => {
    try {
      const token = localStorage.getItem("jwt");

      if (!token) {
        alert("Please login first");
        router.push("/signIn");
        return;
      }

      const response = await fetch(
        `http://localhost:1337/api/todos/${todo.documentId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            data: {
              isCompleted: !todo.isCompleted,
            },
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        fetchTodos();
      } else {
        alert(data.error?.message || "Failed to update todo");
      }
    } catch (error) {
      console.log(error);
      alert("Something went wrong");
    }
  };

  const handleDeleteTodo = async (todo) => {
    try {
      const token = localStorage.getItem("jwt");

      if (!token) {
        alert("Please login first");
        router.push("/signIn");
        return;
      }

      const response = await fetch(
        `http://localhost:1337/api/todos/${todo.documentId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (response.ok) {
        fetchTodos();
      } else {
        alert(data.error?.message || "Failed to delete todo");
      }
    } catch (error) {
      console.log(error);
      alert("Something went wrong");
    }
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#020617",
        color: "white",
        padding: "20px",
      }}
    >
      <section
        style={{
          width: "100%",
          maxWidth: "700px",
          margin: "0 auto",
          background: "#1e293b",
          borderRadius: "16px",
          padding: "32px",
          boxShadow: "0 20px 60px rgba(0, 0, 0, 0.35)",
          position: "relative",
          zIndex: 1,
          pointerEvents: "auto",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "16px",
            marginBottom: "12px",
          }}
        >
          <h1 style={{ fontSize: "32px", fontWeight: "700" }}>Todo Dashboard</h1>
          <button
            type="button"
            style={{
              background: "#ef4444",
              color: "white",
              border: "none",
              borderRadius: "8px",
              padding: "10px 16px",
              cursor: "pointer",
              pointerEvents: "auto",
            }}
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>

        <p style={{ color: "#86efac", marginBottom: "24px" }}>User Logged In</p>

        <form
          style={{ display: "flex", gap: "12px", marginBottom: "24px" }}
          onSubmit={handleAddTodo}
        >
          <input
            style={{
              flex: 1,
              minWidth: 0,
              background: "#0f172a",
              color: "white",
              border: "1px solid #475569",
              borderRadius: "8px",
              padding: "12px 14px",
              outline: "none",
              pointerEvents: "auto",
            }}
            type="text"
            placeholder="Enter Todo"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <button
            type="submit"
            style={{
              background: "#3b82f6",
              color: "white",
              border: "none",
              borderRadius: "8px",
              padding: "12px 18px",
              cursor: "pointer",
              pointerEvents: "auto",
            }}
          >
            Add Todo
          </button>
        </form>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "12px",
            marginBottom: "12px",
          }}
        >
          <h2 style={{ fontSize: "22px", fontWeight: "600" }}>My Todos</h2>
          <p style={{ color: "#cbd5e1", fontSize: "14px" }}>
            Completed: {todos.filter((todo) => todo.isCompleted).length} | Pending:{" "}
            {todos.filter((todo) => !todo.isCompleted).length}
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {todos.length === 0 ? (
            <p
              style={{
                background: "#334155",
                color: "#cbd5e1",
                borderRadius: "8px",
                padding: "14px",
              }}
            >
              No todos yet
            </p>
          ) : (
            todos.map((todo) => (
              <div
                style={{
                  background: "#334155",
                  borderRadius: "8px",
                  padding: "14px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "12px",
                }}
                key={todo.id}
              >
                <div>
                  <p
                    style={{
                      fontWeight: "600",
                      textDecoration: todo.isCompleted ? "line-through" : "none",
                    }}
                  >
                    {todo.title}
                  </p>
                  <span
                    style={{
                      color: todo.isCompleted ? "#86efac" : "#facc15",
                      fontSize: "13px",
                    }}
                  >
                    {todo.isCompleted ? "Completed" : "Pending"}
                  </span>
                </div>

                <div style={{ display: "flex", gap: "8px" }}>
                  <button
                    type="button"
                    style={{
                      background: todo.isCompleted ? "#64748b" : "#22c55e",
                      color: "white",
                      border: "none",
                      borderRadius: "8px",
                      padding: "8px 10px",
                      cursor: "pointer",
                    }}
                    onClick={() => handleToggleStatus(todo)}
                  >
                    {todo.isCompleted ? "Pending" : "Done"}
                  </button>

                  <button
                    type="button"
                    style={{
                      background: "#ef4444",
                      color: "white",
                      border: "none",
                      borderRadius: "8px",
                      padding: "8px 10px",
                      cursor: "pointer",
                    }}
                    onClick={() => handleDeleteTodo(todo)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </main>
  );
}
