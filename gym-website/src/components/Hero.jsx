import gymimage from "../assets/gym.jpg";

export default function Hero() {
  return (
    <section style={{
      height: "90vh",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      background: `linear-gradient(rgba(15,23,42,0.8), rgba(15,23,42,0.9)), url(${gymimage})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
    }}>
      <h1 style={{ 
        fontSize: "60px",
        maxWidth: "800px"
        }}>Transform Your Body Today 💪
      </h1>
      <p style={{
        marginTop: "20px",
        fontSize: "20px",
        color: "#cbd5e1",
      }}>Build strength, confidence, and discipline at FitZone Gym
      </p>
      <button 
      style={{
        marginTop: "30px",
        padding: "15px 30px",
        fontSize: "18px"
      }}>Join Now
      </button>
      
    </section>
  );
}