import React from "react";
import "../styles/landingPage.css";
import { useNavigate } from "react-router-dom";
import { FaHeartbeat, FaShieldAlt, FaClock, FaUserMd } from "react-icons/fa";

export default function LandingPage() {
  const navigate = useNavigate();
  return (
    <div className="landing-container">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="headline">
            Connect where, <span className="blue-text">You are cared</span>
          </h1>
          <p className="hero-description">
            Access comprehensive lab testing services from the comfort of your
            home. Book tests, track results, and manage your health journey with
            our trusted digital platform.
          </p>
          <div className="cta-buttons">
            <button className="btn-primary" onClick={() => navigate("/signup")}>
              Get Started
            </button>
            <button
              className="btn-secondary"
              onClick={() => navigate("/login")}
            >
              Sign In
            </button>
          </div>
        </div>
        <div className="hero-image">
          <img
            src="/images/medical-illustration.png"
            alt="Medical illustration"
          />
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <h2 className="section-title">Why Choose Our Clinic?</h2>
        <p className="section-subtitle">
          We provide comprehensive healthcare services with a focus on
          convenience, accuracy, and patient care.
        </p>

        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">
              <FaHeartbeat />
            </div>
            <h3 className="feature-title">Comprehensive Care</h3>
            <p className="feature-description">
              Full range of diagnostic tests and health screenings
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <FaShieldAlt />
            </div>
            <h3 className="feature-title">Trusted Results</h3>
            <p className="feature-description">
              Accurate testing with certified laboratory standards
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <FaClock />
            </div>
            <h3 className="feature-title">Quick Turnaround</h3>
            <p className="feature-description">
              Fast processing and timely delivery of results
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <FaUserMd />
            </div>
            <h3 className="feature-title">Expert Support</h3>
            <p className="feature-description">
              Professional healthcare team available to assist
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <h2 className="section-title">Ready to Take Control of Your Health?</h2>
        <p className="section-subtitle">
          Join thousands of patients who trust us with their healthcare needs.
          Start your journey today.
        </p>
        <button className="btn-primary" onClick={() => navigate("/signup")}>
          Create Your Account
        </button>
      </section>

      {/* Footer Section */}
      <footer className="landing-footer">
        <div className="footer-content">
          <div className="footer-section">
            <h3 className="footer-title">MedLab</h3>
            <p className="footer-description">
              Trusted medical testing services for your health and peace of
              mind.
            </p>
          </div>

          <div className="footer-section">
            <h3 className="footer-title">Quick Links</h3>
            <ul className="footer-links">
              <li>
                <button
                  className="footer-link-btn"
                  onClick={() => navigate("/")}
                >
                  About Us
                </button>
              </li>
              <li>
                <button
                  className="footer-link-btn"
                  onClick={() => navigate("/")}
                >
                  Our Services
                </button>
              </li>
              <li>
                <button
                  className="footer-link-btn"
                  onClick={() => navigate("/")}
                >
                  Contact Us
                </button>
              </li>
              <li>
                <button
                  className="footer-link-btn"
                  onClick={() => navigate("/")}
                >
                  FAQ
                </button>
              </li>
            </ul>
          </div>

          <div className="footer-section">
            <h3 className="footer-title">Contact</h3>
            <address className="footer-contact">
              <p>123 Healthcare Avenue</p>
              <p>Himachal Pradesh, India</p>
              <p>Email: mannat.garg.s84@kalvium.community</p>
            </address>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} MedLab. All Rights Reserved.</p>
        </div>
      </footer>
    </div>
  );
}
