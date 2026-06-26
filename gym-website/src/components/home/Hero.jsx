import gymimage from "../../assets/gym.jpg";
import '../../style/Home.css';
import gymLogo from "../../assets/gym-logo.png";
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Hero() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const [offers, setOffers] = useState([
    { id: 1, badge: "🔥 Hot Deal", title: "FLAT 50% OFF", desc: "Get half price off on annual membership plans today.", coupon: "FIT50", color: "var(--em)" },
    { id: 2, badge: "⚡ Flash Sale", title: "FREE TRAINER", desc: "Personal training guide assigned free for your first month.", coupon: "PTFREE", color: "#34d399" },
    { id: 3, badge: "👑 VIP Pass", title: "3 DAYS FREE", desc: "Access all premium amenities and steam baths with zero charges.", coupon: "VIPPASS", color: "#f1c40f" },
    { id: 4, badge: "🍿 Fuel Pack", title: "FREE SHAKER", desc: "Get a certified leak-proof gym shaker on checkout values above ₹2000.", coupon: "SHAKEIT", color: "#ff7675" },
    { id: 5, badge: "💰 Mega Saver", title: "NO JOIN FEE", desc: "Completely waive off onboarding admin charges for new profiles.", coupon: "ZEROFEES", color: "#a29bfe" }
  ]);

  useEffect(() => {
    if (!isOpen) return;
    const rotateInterval = setInterval(() => {
      setIsExiting(true);
      setTimeout(() => {
        setOffers((prevOffers) => {
          const [topCard, ...rest] = prevOffers;
          return [...rest, topCard];
        });
        setIsExiting(false);
      }, 450);
    }, 2800);
    return () => clearInterval(rotateInterval);
  }, [isOpen]);
  const getCardClassName = (index) => {
    if (index === 0) return isExiting ? "card-inner exit-flip" : "card-inner active";
    if (index === 1) return "card-inner pos-2";
    if (index === 2) return "card-inner pos-3";
    if (index === 3) return "card-inner pos-4";
    return "card-inner pos-5";
  };
  return (
    <main>
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
        <div className="hero-scroll">
          <div className="hero-scroll-bar" />
          <span>Scroll</span>
        </div>
      </section>
      <div className={`offers-sticky-trigger ${isOpen ? 'hidden' : ''}`} onClick={() => setIsOpen(true)}>
        🏷️ View Live Offers (5)
      </div>
      {isOpen && (
        <div className="offers-modal-overlay">
          <button className="offers-modal-close" onClick={() => setIsOpen(false)}>
            Close Offers ✕
          </button>
          <div className="offers-deck-container">
            <div className="offers-3d-deck">
              {offers.map((offer, index) => (
                <div key={offer.id} className={getCardClassName(index)} style={{ '--accent-color': offer.color }}>
                  <span className="deck-parallax-badge" style={{ borderColor: offer.color, color: offer.color }}>{offer.badge} </span>
                  <div className="deck-text-wrap">
                    <h3 className="deck-parallax-title">{offer.title}</h3>
                    <p className="deck-parallax-desc">{offer.desc}</p>
                  </div>
                  <div className="deck-parallax-coupon" style={{ color: offer.color, borderColor: offer.color }}>{offer.coupon}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}