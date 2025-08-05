import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../styles/Login.css";
import { useAuth } from "../Components/Navbar";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3000/api/auth";

const Login = () => {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const redirectAfterLogin =
    location.state?.redirectAfterLogin || "/my-bookings";
  const testData = location.state?.test;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: form.email,
          password: form.password,
        }),
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) {
        setError(
          data.message || (data.errors && data.errors[0]?.msg) || "Login failed"
        );
      } else {
        login(data.token, data.user);

        setSuccess("Login successful!");

        setTimeout(() => {
          if (redirectAfterLogin === "/book-test" && testData) {
            navigate("/book-test", { state: { test: testData } });
          } else {
            navigate(redirectAfterLogin);
          }
        }, 1000);
      }
    } catch (error) {
      console.error(error);
      setError("Network error");
    }
    setLoading(false);
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Welcome Back</h2>
        <p className="subtitle">Sign in to access your health dashboard</p>
        {error && <div className="error-msg">{error}</div>}
        {success && <div className="success-msg">{success}</div>}
        <label>
          Email Address
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Enter your email address"
            required
          />
        </label>
        <label>
          Password
          <div className="password-input">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
            />
            <span
              className="toggle-eye"
              onClick={() => setShowPassword((v) => !v)}
            >
              {showPassword ? "🙈" : "👁️"}
            </span>
          </div>
        </label>
        <div className="forgot-pass">
          <a href="#">Forgot password?</a>
        </div>
        <button type="submit" disabled={loading}>
          {loading ? "Signing in..." : "Sign In"}
        </button>
        <div className="switch-auth">
          Don't have an account? <button onClick={() => navigate("/signup")}>Register here</button>
        </div>
      </form>
    </div>
  );
};

export default Login;
