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
import CustomerDetails from "./page/CustomerDetails";
import AttractionPage from "./components/home/AttractionPage";
import ProtectedRoute from "./components/common/ProtectedRoute";
import { Route, Routes, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import { useState, useEffect } from "react";
import { clearToken } from "./util/AuthUtils";

function ScrollToContactHandler() {
  const location = useLocation();
  useEffect(() => {
    if (location.state?.scrollToContact) {
      setTimeout(() => {
        const element = document.getElementById('contact');
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 400);
    }
  }, [location]);
}
export default function App() {
  const [sessionExpired, setSessionExpired] = useState(false);
  useEffect(() => {
    const handleSessionExpired = () => { setSessionExpired(true); };
    window.addEventListener("session-expired", handleSessionExpired);
    return () => { window.removeEventListener("session-expired", handleSessionExpired); };
  }, []);
  return (
    <main>
      <ScrollToContactHandler />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/start-journey" element={<AttractionPage />} />
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
        <Route path="/admin/customers/:id" element={
          <ProtectedRoute>
            <CustomerDetails />
          </ProtectedRoute>
        }
        />
      </Routes>
      {sessionExpired && (
        <div className="session-modal-overlay">
          <div className="session-modal">
            <h2>Session Expired</h2>
            <p> Your session has expired. Please login again. </p>
            <button onClick={() => { clearToken(); setSessionExpired(false); window.location.href = "/login"; }}>Login Again</button>
          </div>
        </div>
      )}
      <ToastContainer position="top-right" autoClose={3000} theme="dark" />
    </main>
  );
}

/*
Phase A Development
Completed Activity: 
1. Customer Management with All Validations Production ready. - Completed.
2. Payment Management with All Validations Production ready. - Completed
3. Plan Renewal with All Validations Production Ready - Completed.
4. Customer Details with Customer Image Upload and All Validations Page Production Ready - Completed.
5. Audit Logs for Customer Management - Completed.
6. Customer/Payments Export CSV - Completed.

To Do Activity:
Lead Management Production Ready - Working in Progress
Plan Management Production Ready - Work in Progress
Audit Logs for Payments Management, Lead Management and Plan Management   
Login/Logout - Work in Progress
Admin User Registration with Role - Work in Progress 

Phase B
2. Dashboard Upgrade
3. Export Reports
5. Feedback management
6. Services Management

Phase C
1. Attendance Management
2. Trainer Management
3. Role Management

Phase D
1. WhatsApp Notifications
2. Email Notifications
3. Razorpay Integration

Phase E (Commercial Version)
1. Multi-Gym Support
2. Subscription Billing
3. SaaS Deployment

Phase F
1. Bug Fixes if any.
*/