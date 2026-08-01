"use client";

import { useState } from "react";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");

  const handleReset = (e) => {
    e.preventDefault();

    console.log(email);

    alert("Password reset link sent!");
  };

  return (
    <main
      style={{
        maxWidth: "600px",
        margin: "60px auto",
        padding: "40px",
        background: "#fff",
        borderRadius: "12px",
        boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
      }}
    >
      <h1
        style={{
          textAlign: "center",
          color: "#2563eb",
          marginBottom: "15px",
        }}
      >
        Forgot Password
      </h1>

      <p
        style={{
          textAlign: "center",
          color: "#666",
          marginBottom: "35px",
        }}
      >
        Enter your DIU email address and we'll send you a password reset link.
      </p>

      <form onSubmit={handleReset}>
        <label style={labelStyle}>DIU Email</label>

        <input
          type="email"
          placeholder="example@diu.edu.bd"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={inputStyle}
        />

        <button type="submit" style={buttonStyle}>
          Send Reset Link
        </button>
      </form>

      <div
        style={{
          textAlign: "center",
          marginTop: "30px",
        }}
      >
        <Link
          href="/login"
          style={{
            color: "#2563eb",
            textDecoration: "none",
            fontWeight: "600",
          }}
        >
          ← Back to Login
        </Link>
      </div>
    </main>
  );
}

const labelStyle = {
  display: "block",
  marginBottom: "10px",
  fontSize: "18px",
  fontWeight: "600",
};

const inputStyle = {
  width: "100%",
  padding: "15px",
  marginBottom: "25px",
  borderRadius: "8px",
  border: "1px solid #ccc",
  fontSize: "16px",
  boxSizing: "border-box",
};

const buttonStyle = {
  width: "100%",
  padding: "15px",
  backgroundColor: "#2563eb",
  color: "#fff",
  border: "none",
  borderRadius: "8px",
  fontSize: "18px",
  cursor: "pointer",
};