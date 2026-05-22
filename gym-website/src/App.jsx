import Admin from "./components/Admin";
import PlanManagement from "./components/PlanManagement";
import Login from "./components/Login";
import Home from "./components/Home";
import ProtectedRoute from "./components/ProtectedRoute";
import { Route, Routes } from "react-router-dom";
import "./App.css";
import { useState, useEffect } from "react";

export default function App() {
  const [sessionExpired, setSessionExpired] = useState(false);
  useEffect(() => {
    const handleSessionExpired = () => {
      setSessionExpired(true);
    };
    window.addEventListener(
      "session-expired",
      handleSessionExpired
    );
    return () => {
      window.removeEventListener(
        "session-expired",
        handleSessionExpired
      );
    };

  }, []);
  return (
    <main>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={
          <ProtectedRoute>
            <Admin />
          </ProtectedRoute>
        }
        />
        <Route path="/admin/plans" element={
          <ProtectedRoute>
            <PlanManagement />
          </ProtectedRoute>
        }
        />
      </Routes>
      {sessionExpired && (
        <div className="session-modal-overlay">
          <div className="session-modal">
            <h2>Session Expired</h2>
            <p> Your session has expired. Please login again. </p>
            <button onClick={() => { 
              localStorage.removeItem("token");
              setSessionExpired(false); 
              window.location.href = "/login"; 
              }}
            >
              Login Again
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
/*
Lead Management - Working in Progress
Login/Logout - Work in Progress
Customer Management - 
Add Customer -
Register -
Feedback management - 
Plan management - 
Loader -
*/