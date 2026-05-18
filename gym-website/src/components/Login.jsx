import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../style/Login.css";
import adminImage from "../assets/admin-bg.jpg";
export default function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await fetch("http://localhost:8080/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password })
            });

            if (!response.ok) {
                alert("Invalid Credentials");
                return;
            }

            const data = await response.json();
            localStorage.setItem("token", data.token);
            navigate("/admin");

        } catch (error) {
            console.error(error);
            alert("Login Failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <section
            className="hero-section"
            style={{ '--adminImage': `url(${adminImage})` }}
        >
            <div className="login-container">
                <form className="login-card" onSubmit={handleLogin}>
                    <div className="login-header">
                        <h1>Admin Portal</h1>
                        <p>Enter your credentials to manage the system</p>
                    </div>

                    <div className="input-group">
                        <input
                            type="text"
                            placeholder="Username"
                            className="input-field"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>

                    <div className="input-group">
                        <input
                            type="password"
                            placeholder="Password"
                            className="input-field"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="login-button"
                        disabled={loading}
                    >
                        {loading ? "Authenticating..." : "Sign In"}
                    </button>
                </form>
            </div>
        </section>
    );
}