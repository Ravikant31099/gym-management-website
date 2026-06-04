import Navbar from "../components/home/Navbar";
import Hero from "../components/home/Hero";
import Service from "../components/home/Service";
import Pricing from "../components/home/Pricing";
import Contact from "../components/home/Contact";
import Footer from "../components/home/Footer";
import Testimonals from "../components/home/Testimonals";
import BMICalculator from "../components/home/BMICalculator";

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