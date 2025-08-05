import "./App.css";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import LandingPage from "./Pages/LandingPage";
import LabTestCatalog from "./Pages/LabTestCatalog";
import MyBookings from "./Pages/MyBookings";
import Navbar, { AuthProvider, useAuth } from "./Components/Navbar";
import Login from "./Pages/Login";
import Register from "./Pages/Register";


const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <div className="loading-spinner">Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  return children;
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

function AppContent() {
  const { isLoading } = useAuth();

  if (isLoading) {
    return <div className="loading-spinner">Loading...</div>;
  }

  return (
    <>
      <Navbar />
      <Routes>
        <Route element={<LandingPage />} path="/" />
        <Route element={<LabTestCatalog />} path="/lab-tests" />
        <Route
          path="/my-bookings"
          element={
            <ProtectedRoute>
              <MyBookings />
            </ProtectedRoute>
          }
        />
        <Route element={<Login />} path="/login" />
        <Route element={<Register />} path="/signup" />
      </Routes>
    </>
  );
}

export default App;
