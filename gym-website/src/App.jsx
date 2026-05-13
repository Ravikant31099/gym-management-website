import "./App.css";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Service from "./components/Service";
import Pricing from "./components/Pricing";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import Testimonals from "./components/Testimonals";
import Admin from "./components/Admin";

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