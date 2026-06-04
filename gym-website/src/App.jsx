import Admin from "./page/Admin";
import PlanManagement from "./page/PlanManagement";
import LeadManagement from "./page/LeadManagement";
import CustomerManagement from "./page/CustomerManagement";
import PaymentManagement from "./page/PaymentManagement";
import CustomerAnalytics from "./page/CustomerAnalytics";
import PaymentAnalytics from "./page/PaymentAnalytics";
import LeadAnalytics from "./page/LeadAnalytics";
import Login from "./page/Login";
import Home from "./page/Home";
import ProtectedRoute from "./components/common/ProtectedRoute";
import { Route, Routes } from "react-router-dom";
import "./App.css";
import { useState, useEffect } from "react";
import {clearToken } from "./util/AuthUtils";

export default function App() {
  const [sessionExpired, setSessionExpired] = useState(false);
  useEffect(() => { const handleSessionExpired = () => { setSessionExpired(true);};
    window.addEventListener("session-expired", handleSessionExpired);
    return () => { window.removeEventListener("session-expired", handleSessionExpired); };
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
        <Route path="/admin/leads" element={
          <ProtectedRoute>
            <LeadManagement />
          </ProtectedRoute>
        }
        />
        <Route path="/admin/leads/analytics" element={
          <ProtectedRoute>
            <LeadAnalytics />
          </ProtectedRoute>
        }
        />
        <Route path="/admin/customers" element={
          <ProtectedRoute>
            <CustomerManagement />
          </ProtectedRoute>
        }
        />
        <Route path="/admin/customers/analytics" element={
          <ProtectedRoute>
            <CustomerAnalytics />
          </ProtectedRoute>
        }
        />
        <Route path="/admin/payments" element={
          <ProtectedRoute>
            <PaymentManagement />
          </ProtectedRoute>
        }
        />
        <Route path="/admin/payments/analytics" element={
          <ProtectedRoute>
            <PaymentAnalytics />
          </ProtectedRoute>
        }
        />
      </Routes>
      {sessionExpired && (
        <div className="session-modal-overlay">
          <div className="session-modal">
            <h2>Session Expired</h2>
            <p> Your session has expired. Please login again. </p>
            <button onClick={() => { clearToken(); setSessionExpired(false); window.location.href = "/login";}}>Login Again</button>
          </div>
        </div>
      )}
    </main>
  );
}
/*
Lead Management - Working in Progress
Login/Logout - Work in Progress
Lead Analytics - Work in Progress
Plan Management - Work in Progress (More than 4 records a view all button to be added)
Plan Renewal - Completed. 
Services Management - More than 3 records a view all button to be added
Customer Management - Work in Progress
Customer Analytics -  Work in Progress
Register - 
Feedback management - 
Payment Integration - 
Loader -
*/