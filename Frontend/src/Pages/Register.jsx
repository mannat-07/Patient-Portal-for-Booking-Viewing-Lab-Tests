import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Register.css";
import { useAuth } from "../Components/Navbar";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3000/api/auth";

const Register = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone,
          password: form.password,
        }),
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        setError(
          data.message ||
            (data.errors && data.errors[0]?.msg) ||
            "Registration failed"
        );
      } else {
        setSuccess("Registration successful! You can now sign in.");
        setForm({
          name: "",
          email: "",
          phone: "",
          password: "",
          confirmPassword: "",
        });

        if (data.token && data.user) {
          login(data.token, data.user);

          setTimeout(() => {
            navigate("/my-bookings");
          }, 2000);
        } else {
          setTimeout(() => {
            navigate("/lab-tests");
          }, 2000);
        }
      }
    } catch (error) {
      console.error(error);
      setError("Network error");
    }

    setLoading(false);
  };

  return (
    <div className="register-container">
      <form className="register-form" onSubmit={handleSubmit}>
        <h2>Create Your Account</h2>
        <p className="subtitle">
          Join our digital health platform to access lab testing services
        </p>
        {error && <div className="error-msg">{error}</div>}
        {success && <div className="success-msg">{success}</div>}
        <label>
          Full Name
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Enter your full name"
            required
            minLength={3}
          />
        </label>
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
          Phone Number
          <input
            type="text"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="Enter your phone number"
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
              placeholder="Create a password"
              required
              minLength={8}
            />
            <span
              className="toggle-eye"
              onClick={() => setShowPassword((v) => !v)}
            >
              {showPassword ? "🙈" : "👁️"}
            </span>
          </div>
        </label>
        <label>
          Confirm Password
          <div className="password-input">
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm your password"
              required
              minLength={8}
            />
            <span
              className="toggle-eye"
              onClick={() => setShowConfirmPassword((v) => !v)}
            >
              {showConfirmPassword ? "🙈" : "👁️"}
            </span>
          </div>
        </label>
        <button type="submit" disabled={loading}>
          {loading ? "Creating..." : "Create Account"}
        </button>
        <div className="switch-auth">
          Already have an account? <button onClick={() => navigate("/login")}>Sign in here</button>
        </div>
      </form>
    </div>
  );
};

export default Register;
