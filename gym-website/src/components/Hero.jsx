import gymimage from "../assets/gym.jpg";
import '../style/Hero.css'; // Importing the separate hero styles

export default function Hero() {
  return (
    <section 
      className="hero-section" 
      style={{ '--hero-bg': `url(${gymimage})` }}
    >
      <div className="hero-content">
        <h1 className="hero-title">
          Transform Your Body Today
        </h1>
        <h1 className="hero-logo">💪</h1>
        <p className="hero-subtitle">
          Build strength, confidence, and discipline at FitZone Gym
        </p>
        <button className="hero-cta-btn" type="button">
          Join Now
        </button>
      </div>
    </section>
  );
}