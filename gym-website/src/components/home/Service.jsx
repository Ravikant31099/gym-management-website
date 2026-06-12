import '../../style/Home.css';
import personalTraining from "../../assets/Personal_Training.jpg";
import weightLoss from "../../assets/Weight_Loss.jpg";
import strengthTrain from "../../assets/Strength_Training.jpg";
import healthySnack from "../../assets/Healthy_Snack.jpg";
import cleanliness from "../../assets/Gym-Deep-Cleaning.jpg";
import calisthenics from "../../assets/Calisthenics.jpg";
import { useEffect, useRef, useState } from "react";

export default function Service() {
    const [showAllServices, setShowAllServices] = useState(false);
    const sectionRef = useRef(null);
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                    }
                });
            },
            { threshold: 0.1 }
        );
        const els = sectionRef.current?.querySelectorAll('.reveal');
        els?.forEach((el) => observer.observe(el));
        return () => observer.disconnect();
    }, [showAllServices]);
    const services = [
        { image: personalTraining, title: "Personal Training",   desc: "One-on-one coaching from expert trainers tailored to your goals." },
        { image: weightLoss,       title: "Weight Loss",         desc: "Customised workout plans designed for maximum fat burning." },
        { image: strengthTrain,    title: "Strength Training",   desc: "Build muscle, power, and improve your overall endurance." },
        { image: healthySnack,     title: "Healthy Snack Bar",   desc: "Nutrient-rich foods and recovery smoothies after every session." },
        { image: cleanliness,      title: "Cleanliness",         desc: "Maintaining a spotless, hygienic environment at all times." },
        { image: calisthenics,     title: "Calisthenics",        desc: "Bodyweight exercises that build real-world functional strength." }
    ];
    const visibleServices = showAllServices ? services : services.slice(0, 3);
    return (
        <section id="service" className="services-section" ref={sectionRef}>
            <div className="container">
                <span className="section-eyebrow reveal">What We Offer</span>
                <h2 className="services-title reveal reveal-delay-1">Our Services</h2>
                <div className="services-grid">
                    {visibleServices.map((service, index) => (
                        <div className={`service-card reveal reveal-delay-${(index % 3) + 1}`} key={index}>
                            <div className="service-image-wrap">
                                <img src={service.image} alt={service.title} className="service-image" />
                                <div className="service-image-overlay" />
                            </div>
                            <div className="service-content">
                                <h3 className="service-card-title">{service.title}</h3>
                                <p className="service-card-desc">{service.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            {services.length > 3 && (
                <div className="view-more-wrapper reveal">
                    <button className="view-more-btn" onClick={() => setShowAllServices(!showAllServices)}>
                        {showAllServices ? "Show Less" : "View All Services"}
                    </button>
                </div>
            )}
        </section>
    );
}
