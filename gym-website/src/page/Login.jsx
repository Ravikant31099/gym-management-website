import "../style/Login.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { apiRequest, handleApiResponse } from "../util/api";
import { setToken } from "../util/AuthUtils";
import adminImage from "../assets/admin-bg.jpg";
import "react-toastify/dist/ReactToastify.css";

export default function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const handleLogin = async (e) => { e.preventDefault(); setLoading(true);
        try {
            const response = await apiRequest("/api/auth/login", { method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password })
            });
            await handleApiResponse(response);
            const data = await response.json();
            setToken(data.token);
            navigate("/admin");
        } catch (error) {
            console.error(error);
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };
    return (
        <main>
            <section className="hero-section" style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url(${adminImage})` }}>
                <div className="login-container">
                    <div className="brand-logo">
                        <p className="logo">💪</p>
                        <div className="logo-text">
                            <span className="fit">FIT</span><span className="zone">ZONE</span>
                        </div>
                    </div>
                    <form className="login-card" onSubmit={handleLogin}>
                        <div className="login-header">
                            <h1>Admin Portal</h1>
                            <p>Enter your credentials to manage the system</p>
                        </div>
                        <div className="input-group">
                            <input type="text" placeholder="Username" className="input-field" value={username} onChange={(e) => setUsername(e.target.value)} required />
                        </div>
                        <div className="input-group">
                            <input type="password" placeholder="Password" className="input-field" value={password} onChange={(e) => setPassword(e.target.value)} required />
                        </div>
                        <button type="submit" className="login-button" disabled={loading}> {loading ? "Authenticating..." : "Sign In"} </button>
                    </form>
                </div>
            </section>
            <ToastContainer position="top-right" autoClose={3000} theme="dark" />
        </main>
    );
}