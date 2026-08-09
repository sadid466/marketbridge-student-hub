"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { signIn, useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const registered = searchParams.get("registered");
  const { data: session, status } = useSession();

  const [studentId, setStudentId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Automatically redirect authenticated users away from the login page
  useEffect(() => {
    if (status === "authenticated") {
      router.push("/");
    }
  }, [status, router]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await signIn("credentials", {
        studentId,
        password,
        redirect: false,
      });

      if (res?.error) {
        setError(res.error);
      } else {
        router.push("/");
        router.refresh();
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
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
          marginBottom: "35px",
          color: "#2563eb",
        }}
      >
        Login to your MarketBridge Account
      </h1>

      {registered && (
        <div
          style={{
            padding: "12px",
            marginBottom: "20px",
            background: "#d1fae5",
            color: "#065f46",
            borderRadius: "8px",
            textAlign: "center",
          }}
        >
          Account created successfully! Please log in.
        </div>
      )}

      {error && (
        <div
          style={{
            padding: "12px",
            marginBottom: "20px",
            background: "#fee2e2",
            color: "#991b1b",
            borderRadius: "8px",
            textAlign: "center",
          }}
        >
          {error}
        </div>
      )}

      <form onSubmit={handleLogin}>
        {/* DIU Student ID */}
        <label style={labelStyle}>DIU Student ID</label>
        <input
          type="text"
          placeholder="221-35-XXXX"
          value={studentId}
          onChange={(e) => setStudentId(e.target.value)}
          required
          style={inputStyle}
        />

        {/* Password */}
        <label style={labelStyle}>Password</label>
        <div style={{ position: "relative" }}>
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={inputStyle}
          />

          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            style={eyeButton}
          >
            {showPassword ? <EyeOff size={22} /> : <Eye size={22} />}
          </button>
        </div>

        {/* Forgot Password */}
        <div
          style={{
            textAlign: "right",
            marginBottom: "25px",
          }}
        >
          <Link
            href="/forgot-password"
            style={{
              color: "#2563eb",
              textDecoration: "none",
              fontWeight: "500",
            }}
          >
            Forgot Password?
          </Link>
        </div>

        {/* Login Button */}
        <button type="submit" disabled={loading} style={loginButton}>
          {loading ? "Logging in..." : "Login"}
        </button>

        <hr style={{ margin: "35px 0" }} />

        {/* Google Button */}
        <button
          type="button"
          onClick={() => signIn("google", { callbackUrl: "/" })}
          style={googleButton}
        >
          Continue with Google
        </button>

        {/* Register */}
        <p
          style={{
            textAlign: "center",
            marginTop: "25px",
          }}
        >
          Don't have an account?{" "}
          <Link
            href="/register"
            style={{
              color: "#2563eb",
              fontWeight: "bold",
              textDecoration: "none",
            }}
          >
            Register
          </Link>
        </p>
      </form>
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

const eyeButton = {
  position: "absolute",
  right: "15px",
  top: "35%",
  transform: "translateY(-50%)",
  border: "none",
  background: "transparent",
  cursor: "pointer",
};

const loginButton = {
  width: "100%",
  padding: "15px",
  backgroundColor: "#2563eb",
  color: "#fff",
  border: "none",
  borderRadius: "8px",
  fontSize: "18px",
  cursor: "pointer",
};

const googleButton = {
  width: "100%",
  padding: "15px",
  backgroundColor: "#fff",
  color: "#333",
  border: "1px solid #ccc",
  borderRadius: "8px",
  fontSize: "17px",
  cursor: "pointer",
};