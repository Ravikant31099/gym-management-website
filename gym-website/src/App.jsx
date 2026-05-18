import "./App.css";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Service from "./components/Service";
import Pricing from "./components/Pricing";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import Testimonals from "./components/Testimonals";
import Admin from "./components/Admin";
import Login from "./components/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import { Route, Routes } from "react-router-dom";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
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
function App() {
  return (
    <>
      <Navbar />
      <Hero />
      <Service />
      <Pricing />
      <Testimonals />
      <Contact />
      <Footer />
      <Admin />
    </>
  );
}
export default App;

Lead Management - Working in Progress
Login/Logout - Work in Progress
Customer Management - 
Add Customer -
Register -
Feedback management - 
Plan management - 
Loader -
*/