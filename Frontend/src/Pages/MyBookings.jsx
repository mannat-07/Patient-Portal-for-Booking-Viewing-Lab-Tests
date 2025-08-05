import React, { useState, useEffect } from "react";
import { FaCalendarAlt, FaCheckCircle, FaDownload, FaTimesCircle } from "react-icons/fa";
import { format } from "date-fns";
import "../styles/MyBookings.css";
import { useAuth } from "../Components/Navbar";

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");

        if (!isAuthenticated || !token) {
          throw new Error("Not authenticated");
        }

        const response = await fetch(`${API_URL}/bookings/my-bookings`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("Failed to fetch bookings");
        }

        const data = await response.json();
        console.log("API response:", data);

        // Extract bookings from API response
        if (data && data.success && Array.isArray(data.bookings)) {
          setBookings(data.bookings);
        } else if (data && Array.isArray(data)) {
          setBookings(data);
        } else if (data && Array.isArray(data.data)) {
          setBookings(data.data);
        } else {
          console.error("Unexpected API response structure:", data);
          setBookings([]);
        }

        setLoading(false);
      } catch (error) {
        console.error("Error fetching bookings:", error);
        setError(error.message);
        setLoading(false);
      }
    };

    fetchBookings();
  }, [API_URL, isAuthenticated]);

  const handleDownloadReport = async (bookingId) => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("Not authenticated");
      }

      const response = await fetch(`${API_URL}/bookings/${bookingId}/report`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to download report");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `report-${bookingId}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Error downloading report:", error);
      alert(`Failed to download report: ${error.message}`);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) return;
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Not authenticated");
      const response = await fetch(`${API_URL}/bookings/${bookingId}/cancel`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Failed to cancel booking");
      }
      // Update the cancelled booking's status in the list
      setBookings((prev) =>
        prev.map((b) =>
          b._id === bookingId ? { ...b, status: "cancelled" } : b
        )
      );
      alert("Booking cancelled successfully.");
    } catch (error) {
      alert(`Failed to cancel booking: ${error.message}`);
    }
  };

  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), "MMM d, yyyy");
    } catch {
      return dateString || "N/A";
    }
  };

  const getStatusClass = (status) => {
    if (!status) return "status-pending";

    switch (status.toLowerCase()) {
      case "completed":
        return "status-completed";
      case "processing":
        return "status-processing";
      case "cancelled":
        return "status-cancelled";
      default:
        return "status-pending";
    }
  };

  if (loading) {
    return <div className="loading">Loading bookings...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  const bookingsArray = Array.isArray(bookings) ? bookings : [];

  return (
    <div className="my-bookings-container">
      <div className="my-bookings-header">
        <h1>My Bookings</h1>
        <p>Track your lab test bookings and download reports</p>
      </div>

      <div className="booking-list">
        {bookingsArray.length === 0 ? (
          <div className="no-bookings">
            You have no bookings yet. Book a test to get started.
          </div>
        ) : (
          bookingsArray.map((booking) => (
            <div key={booking._id} className="booking-card">
              <h2 className="booking-title">
                {booking.test?.name || "Unknown Test"}
              </h2>

              <div className="booking-dates">
                <div className="booking-date-item">
                  <FaCalendarAlt />
                  <span className="booking-date-label">Booked:</span>
                  <span className="booking-date-value">
                    {formatDate(booking.bookingDate)}
                  </span>
                </div>

                {booking.appointmentDate && (
                  <div className="booking-date-item">
                    <FaCalendarAlt />
                    <span className="booking-date-label">Appointment:</span>
                    <span className="booking-date-value">
                      {formatDate(booking.appointmentDate)}
                    </span>
                  </div>
                )}
              </div>

              <div className="booking-details">
                <div className="booking-detail-item">
                  <span className="booking-detail-label">Booking ID:</span>
                  <span className="booking-detail-value">
                    {booking._id?.substring(0, 8) || "N/A"}
                  </span>
                </div>
                <div className="booking-detail-item">
                  <span className="booking-detail-label">Price:</span>
                  <span className="booking-detail-value">
                    ₹{booking.test?.price || "N/A"}
                  </span>
                </div>
              </div>

              <div
                className={`booking-status ${getStatusClass(booking.status)}`}
              >
                {booking.status || "Pending"}
              </div>

              {booking.status?.toLowerCase() === "completed" && (
                <button
                  className="download-report-btn"
                  onClick={() => handleDownloadReport(booking._id)}
                >
                  <FaDownload />
                  Download Report
                </button>
              )}
              {booking.status?.toLowerCase() === "pending" && (
                <button
                  className="cancel-booking-btn"
                  onClick={() => handleCancelBooking(booking._id)}
                  title="Cancel Booking"
                >
                  <FaTimesCircle style={{ marginRight: 6 }} />
                  Cancel Booking
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MyBookings;
