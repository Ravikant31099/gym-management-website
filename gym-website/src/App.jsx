import Admin from "./components/Admin";
import Login from "./components/Login";
import Home from "./components/Home";
import ProtectedRoute from "./components/ProtectedRoute";
import { Route, Routes } from "react-router-dom";
import "./App.css";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/admin" element={
        <ProtectedRoute>
          <Admin />
        </ProtectedRoute>
      }
      />
      <Route path="/login" element={<Login />} />
    </Routes>
  )
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