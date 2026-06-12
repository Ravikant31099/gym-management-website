import '../../style/Home.css';
import gymLogo from "../../assets/gym-logo.png";

export default function Navbar() {
  return (
    <nav className="site-navbar">
      <h2 className="navbar-logo">FitZone
        <div className="nav-logo-container">
          <img src={gymLogo} alt="Gym Logo" className="nav-gym-logo" />
        </div>
      </h2>
      <div className="navbar-links">
        <a href="#service">Services</a>
        <a href="#pricing">Pricing</a>
        <a href="#contact" className="nav-contact-btn">Contact</a>
      </div>
    </nav>
  );
}