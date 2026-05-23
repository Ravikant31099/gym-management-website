import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Service from "../components/Service";
import Pricing from "../components/Pricing";
import Contact from "../components/Contact";
import Footer from "../components/Footer";
import Testimonals from "../components/Testimonals";
import BMICalculator from "../components/BMICalculator";

function App() {
  return (
    <main>
      <Navbar />
      <Hero />
      <Service />
      <Pricing />
      <BMICalculator />
      <Testimonals />
      <Contact />
      <Footer />
    </main>
  );
}
export default App;