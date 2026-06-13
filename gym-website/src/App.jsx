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
    </main>
  );
}
/*
Lead Management - Working in Progress
Login/Logout - Work in Progress
Lead Analytics - Work in Progress
Plan Management - Work in Progress
Plan Renewal - Work in Progress. 
Customer Management - Work in Progress
Customer Analytics -  Work in Progress
User Application Page - Work in Progress 
imporvement idea(User Application Page) :
Need to add animated website, 
on click of service complete infromation to be displayed, 
on click plan full detials of plan to be displayed, 
Need to add Weekly Rush Line graph beside Bmi Calculator.
More Feedback option on click - view top 10 feedback, on screen only top 3 feedback.

Phase A
1. Loader Integration
2. Dashboard Upgrade
3. Export Reports
4. Register 
5. Feedback management
6. Services Management
7. Attendance Management
Phase B
1. Email Notifications
2. Role Management
Phase C
1. Razorpay Integration
2. WhatsApp Notifications
Phase D (Commercial Version)
1. Multi-Gym Support
2. Subscription Billing
3. SaaS Deployment

Currently we are making Customer Management Production ready.
*/