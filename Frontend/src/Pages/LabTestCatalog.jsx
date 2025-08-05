import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import TestCard from "../Components/TestCard";
import "../styles/LabTestCatalog.css";
import { FaSearch } from "react-icons/fa";
import { useAuth } from "../Components/Navbar";

export default function LabTestCatalog() {
  const [tests, setTests] = useState([]);
  const [filteredTests, setFilteredTests] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedTest, setSelectedTest] = useState(null);
  const [bookingDate, setBookingDate] = useState("");
  const [bookingTime, setBookingTime] = useState("");
  const [bookingError, setBookingError] = useState("");
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState("");
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const fetchTests = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${import.meta.env.VITE_API_URL}/tests`, {
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("Failed to fetch tests");
        }

        const data = await response.json();
        setTests(data.tests || []);
        setFilteredTests(data.tests || []);
      } catch (err) {
        console.error("Error fetching tests:", err);
        setError("Failed to load tests. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchTests();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredTests(tests);
      return;
    }

    const filtered = tests.filter(
      (test) =>
        test.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        test.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredTests(filtered);
  }, [searchTerm, tests]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleBookTest = (test) => {
    if (!isAuthenticated) {
      navigate("/login", { state: { redirectAfterLogin: "/lab-tests", test } });
    } else {
      setSelectedTest(test);
      setShowModal(true);
      setBookingDate("");
      setBookingTime("");
      setBookingError("");
      setBookingSuccess("");
    }
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    setBookingError("");
    setBookingSuccess("");
    if (!bookingDate) {
      setBookingError("Please select a booking date.");
      return;
    }
    if (!bookingTime) {
      setBookingError("Please select a booking time.");
      return;
    }
    setBookingLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${import.meta.env.VITE_API_URL}/bookings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
        body: JSON.stringify({
          testId: selectedTest._id,
          appointmentDate: bookingDate,
          appointmentTime: bookingTime,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setBookingError(data.message || "Booking failed. Try again.");
      } else {
        setBookingSuccess(
          "Booking successful! You can view it in My Bookings."
        );
        setShowModal(false);
        setSelectedTest(null);
        setBookingDate("");
        setBookingTime("");
      }
    } catch (err) {
      setError(err)
      setBookingError("Network error. Please try again.");
    }
    setBookingLoading(false);
  };

  const today = new Date();
  const minDate = today.toISOString().split("T")[0];
  const maxDateObj = new Date(today);
  maxDateObj.setDate(today.getDate() + 15);
  const maxDate = maxDateObj.toISOString().split("T")[0];

  return (
    <div className="lab-catalog-container">
      {bookingSuccess && (
        <div className="success-message">
          {bookingSuccess}
          <button
            className="close-success"
            onClick={() => setBookingSuccess("")}
            aria-label="Close"
          >
            ×
          </button>
        </div>
      )}
      <div className="catalog-header">
        <h1 className="catalog-title">Lab Test Catalog</h1>
        <p className="catalog-subtitle">
          Browse and book from our comprehensive range of diagnostic tests
        </p>
      </div>

      <div className="search-container">
        <FaSearch className="search-icon" />
        <input
          type="text"
          placeholder="Search lab tests..."
          className="search-input"
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>

      {loading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
        </div>
      ) : error ? (
        <div className="error-message">{error}</div>
      ) : filteredTests.length === 0 ? (
        <div className="error-message">
          No tests found matching your search.
        </div>
      ) : (
        <div className="tests-grid">
          {filteredTests.map((test) => (
            <TestCard key={test._id} test={test} onBookTest={handleBookTest} />
          ))}
        </div>
      )}

      {/* Booking Modal */}
      {showModal && selectedTest && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Book Test: {selectedTest.name}</h2>
            <form onSubmit={handleBookingSubmit}>
              <label>
                Select Date:
                <input
                  type="date"
                  min={minDate}
                  max={maxDate}
                  value={bookingDate}
                  onChange={(e) => setBookingDate(e.target.value)}
                  required
                />
              </label>
              <label>
                Select Time:
                <input
                  type="time"
                  min="09:00"
                  max="17:00"
                  value={bookingTime}
                  onChange={(e) => setBookingTime(e.target.value)}
                  required
                />
              </label>
              {bookingError && (
                <div className="error-message">{bookingError}</div>
              )}
              <div className="modal-actions">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  disabled={bookingLoading}
                >
                  Cancel
                </button>
                <button type="submit" disabled={bookingLoading}>
                  {bookingLoading ? "Booking..." : "Confirm Booking"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
