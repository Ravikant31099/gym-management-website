import Navbar from "../components/home/Navbar";
import Hero from "../components/home/Hero";
import Service from "../components/home/Service";
import Pricing from "../components/home/Pricing";
import Contact from "../components/home/Contact";
import Footer from "../components/home/Footer";
import Testimonals from "../components/home/Testimonals";
import BMICalculator from "../components/home/BMICalculator";
import { useState } from 'react';

function App() {
  const [selectedPlanMessage, setSelectedPlanMessage] = useState('');

  return (
    <main>
      <Navbar />
      <Hero />
      <Service />
      <Pricing onSelectPlan={(planName) => setSelectedPlanMessage({
        name: planName,
        text: `Hey FitZone Team! I'm ready to crush my fitness goals and want to get started with the ${planName}. Please guide me with the next steps!`,
        timestamp: Date.now()
      })} />
      <BMICalculator />
      <Testimonals />
      <Contact planMessage={selectedPlanMessage} />
      <Footer />
    </main>
  );
}
export default App;