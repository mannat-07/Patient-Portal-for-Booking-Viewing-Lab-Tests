import React from "react";
import "../styles/TestCard.css";
import { FaClock } from "react-icons/fa";

const TestCard = ({ test, onBookTest }) => {
  return (
    <div className="test-card">
      <div className="test-icon">
        <span className="icon-container">
          {/* Icon based on test type could be dynamic */}
          {test.name.toLowerCase().includes("blood")
            ? "🩸"
            : test.name.toLowerCase().includes("thyroid")
            ? "🦋"
            : test.name.toLowerCase().includes("vitamin")
            ? "💊"
            : test.name.toLowerCase().includes("liver")
            ? "🔬"
            : "🩺"}
        </span>
        <span className="test-category">
          {test.name.toLowerCase().includes("blood")
            ? "Blood Tests"
            : test.name.toLowerCase().includes("thyroid")
            ? "Endocrine"
            : test.name.toLowerCase().includes("vitamin")
            ? "Vitamins"
            : test.name.toLowerCase().includes("liver")
            ? "Liver Health"
            : "Diagnostic"}
        </span>
      </div>

      <h3 className="test-name">{test.name}</h3>

      <p className="test-description">{test.description}</p>

      <div className="test-details">
        <div className="test-timing">
          <FaClock className="details-icon" />
          <span>Results in 24-48 hours</span>
        </div>
        <div className="test-price">
          <span>₹{test.price}</span>
        </div>
      </div>

      <button className="book-test-btn" onClick={() => onBookTest(test)}>
        Book Test
      </button>
    </div>
  );
};

export default TestCard;
