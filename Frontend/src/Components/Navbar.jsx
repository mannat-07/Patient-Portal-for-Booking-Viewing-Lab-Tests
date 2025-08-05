import React, { useState, useEffect, createContext, useContext } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Navbar.css";
import { FaUserCircle } from "react-icons/fa";

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    isAuthenticated: false,
    user: null,
    isLoading: true,
  });

  const login = (token, userData) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));
    setAuthState({
      isAuthenticated: true,
      user: userData,
      isLoading: false,
    });
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setAuthState({
      isAuthenticated: false,
      user: null,
      isLoading: false,
    });
  };

  const updateAuthState = () => {
    const token = localStorage.getItem("token");
    const userStr = localStorage.getItem("user");
    let user = null;

    try {
      if (userStr && userStr !== "undefined") {
        user = JSON.parse(userStr);
      }
    } catch (err) {
      console.error("Failed to parse user data:", err);
    }

    setAuthState({
      isAuthenticated: !!token,
      user,
      isLoading: false,
    });
  };

  useEffect(() => {
    updateAuthState();

    window.addEventListener("storage", updateAuthState);

    return () => {
      window.removeEventListener("storage", updateAuthState);
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: authState.isAuthenticated,
        user: authState.user,
        isLoading: authState.isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

const Navbar = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-logo" onClick={() => navigate("/")}>
          <span className="logo-text">MedLab</span>
        </div>

        <div className="navbar-links">
          <div className="nav-link" onClick={() => navigate("/lab-tests")}>
            Lab Tests
          </div>
          {isAuthenticated && (
            <div className="nav-link" onClick={() => navigate("/my-bookings")}>
              My Bookings
            </div>
          )}
        </div>

        <div className="navbar-auth">
          {isAuthenticated ? (
            <div className="user-menu">
              <div className="user-info">
                <FaUserCircle className="user-icon" />
                <span>{user?.name || "User"}</span>
              </div>
              <button onClick={handleLogout} className="logout-btn">
                Logout
              </button>
            </div>
          ) : (
            <div className="auth-buttons">
              <div className="login-btn" onClick={() => navigate("/login")}>
                Login
              </div>
              <div className="signup-btn" onClick={() => navigate("/signup")}>
                Sign Up
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
