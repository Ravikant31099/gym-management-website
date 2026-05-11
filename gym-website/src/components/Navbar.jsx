export default function Navbar() {
  return (
    <nav style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "20px 50px",
      background: "#111827",
      position: "sticky",
      top: 0,
      zIndex: 1000,
      boxShadow: "0 2px 10px rgba(0,0,0,0.3)"
    }}>
      <h2>FitZone 💪</h2>
      <div>
        <a href="#service">Services</a>
        <a href="#pricing">Pricing</a>
        <a href="#contact">Contact</a>
      </div>
    </nav>
  );
}