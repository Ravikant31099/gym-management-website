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
import { logout } from "./util/AuthUtils";

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
            <button onClick={() => { logout(); setSessionExpired(false); window.location.href = "/login"; }}>Login Again</button>
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
5. Audit Logs - Completed.
6. Customer/Payments/Plan Export CSV - Completed.
7. Plan Management Production Ready - Completed.
8. Lead Management Production Ready - Completed.

To Do Activity:
Login/Logout - Work in Progress
Admin User Registration with Role - Work in Progress 

Phase B
1. Dashboard Upgrade
2. Services Management - To be shown on user Application
3. Offer Management - To be shown on user Application
4. Feedback management - To be shown on user Application 

Phase C
1. Attendance Management - Rush Hour to be shown on user Website
2. Role Management
3. Trainer Management - To be shown on user Website
4. Export Reports (Revenue Report/Membership Report/Expiring Members/Attendance Report/Trainer Performance/Lead Conversion/Monthly Business Summary)

Phase D
1. Settings Managment(Gym Details/Logo Upload/GST Number/Invoice Prefix/Currency/Timezone/WhatsApp Templates/Email Templates/Theme)- Same to be updated on shown Website
2. WhatsApp Notifications
3. Email Notifications
4. Razorpay Integration

Phase E — Production Hardening
1. Centralized exception handling review
2. Logging improvements
3. API documentation (Swagger/OpenAPI)
4. Backup/restore strategy
5. Performance optimization
6. Database indexing review
7. Security review
8. Final UX polish
9. Integration testing

Phase F (Commercial Version)
1. Multi-Gym Support
2. Subscription Billing
3. SaaS Deployment

Phase G
1. Bug Fixes if any.
*/