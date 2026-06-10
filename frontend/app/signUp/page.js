//signup
"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Signup() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch("http://localhost:1337/api/auth/local/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          email,
          password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Registration Successful");
        localStorage.setItem("jwt", data.jwt);
        localStorage.setItem("user", JSON.stringify(data.user));
        router.push("/dashboard");
      } else {
        alert(data.error?.message || "Registration Failed");
      }
    } catch (error) {
      console.log(error);
      alert("Something went wrong");
    }
  };

  return (
    <main style={pageStyle}>
      <form style={cardStyle} onSubmit={handleSignup}>
        <h1 style={headingStyle}>Sign Up</h1>

        <input
          style={inputStyle}
          type="text"
          placeholder="Username"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
        />

        <input
          style={inputStyle}
          type="email"
          placeholder="Email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />

        <input
          style={inputStyle}
          type="password"
          placeholder="Password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />

        <button style={buttonStyle} type="submit">
          Register
        </button>
      </form>
    </main>
  );
}

const pageStyle = {
  minHeight: "100vh",
  width: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background: "#020617",
  color: "white",
  padding: "20px",
};

const cardStyle = {
  width: "100%",
  maxWidth: "420px",
  display: "flex",
  flexDirection: "column",
  gap: "16px",
  background: "#1e293b",
  borderRadius: "16px",
  padding: "32px",
  pointerEvents: "auto",
  position: "relative",
  zIndex: 1,
};

const headingStyle = {
  fontSize: "32px",
  fontWeight: "700",
  marginBottom: "8px",
};

const inputStyle = {
  width: "100%",
  background: "#0f172a",
  color: "white",
  border: "1px solid #475569",
  borderRadius: "8px",
  padding: "12px 14px",
  outline: "none",
  pointerEvents: "auto",
};

const buttonStyle = {
  width: "100%",
  background: "#3b82f6",
  color: "white",
  border: "none",
  borderRadius: "8px",
  padding: "12px 18px",
  cursor: "pointer",
  pointerEvents: "auto",
};
