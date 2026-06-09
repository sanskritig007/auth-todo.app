"use client";

import { useEffect, useState } from "react";

export default function Dashboard() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("jwt");

    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  return (
    <div>
      <h1>Dashboard</h1>

      <p>
        {isLoggedIn
          ? "User Logged In"
          : "User Not Logged In"}
      </p>
    </div>
  );
}