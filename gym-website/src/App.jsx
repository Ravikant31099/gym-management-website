import "./App.css";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Service from "./components/Service";
import Pricing from "./components/Pricing";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import Testimonals from "./components/Testimonals";

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
    </>
  );
}

export default App;