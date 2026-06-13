import gymimage from "../../assets/gym.jpg";
import '../../style/Home.css';
import gymLogo from "../../assets/gym-logo.png";
import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Hero() {
  const navigate = useNavigate();
  return (
    <section className="hero-section" style={{ '--hero-bg': `url(${gymimage})` }}>
      <div className="hero-content">
        <span className="hero-eyebrow">FitZone Gym · Mumbai</span>
        <h1 className="hero-title"> Transform<br /> Your <span className="hero-accent">Body</span></h1>
        <div className="hero-logo-container">
          <img src={gymLogo} alt="Gym Logo" className="my-gym-logo" />
        </div>
        <p className="hero-subtitle">
          Build strength, confidence, and discipline — one rep at a time.
        </p>
        <button className="hero-cta-btn" type="button" onClick={() => navigate('/start-journey')}>
          Start Your Journey
        </button>
      </div>
      {/* Scroll indicator */}
      <div className="hero-scroll">
        <div className="hero-scroll-bar" />
        <span>Scroll</span>
      </div>
    </section>
  );
}
