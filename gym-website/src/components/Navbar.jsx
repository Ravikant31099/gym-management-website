import '../style/Home.css';
export default function Navbar() {
  return (
    <nav className="site-navbar">
      <h2 className="navbar-logo">FitZone 💪</h2>
      <div className="navbar-links">
        <a href="#service">Services</a>
        <a href="#pricing">Pricing</a>
        <a href="#contact" className="nav-contact-btn">Contact</a>
      </div>
    </nav>
  );
}