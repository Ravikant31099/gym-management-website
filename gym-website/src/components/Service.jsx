import '../style/Home.css';
import personalTraining from "../assets/Personal_Training.jpg";
import weightLoss from "../assets/Weight_Loss.jpg";
import strengthTrain from "../assets/Strength_Training.jpg";
import healthySnack from "../assets/Healthy_Snack.jpg";
import cleanliness from "../assets/Gym-Deep-Cleaning.jpg";
import calisthenics from "../assets/Calisthenics.jpg";
import { useEffect, useState } from "react";

export default function Service() {
    const [showAllServices, setShowAllServices] = useState(false);
    const services = [
        {
            image: personalTraining,
            title: "Personal Training",
            desc: "Get one-on-one coaching from expert trainers."
        },
        {
            image: weightLoss,
            title: "Weight Loss",
            desc: "Customized workout plans for fat burning."
        },
        {
            image: strengthTrain,
            title: "Strength Training",
            desc: "Build muscle and improve endurance."
        },
        {
            image: healthySnack,
            title: "Healthy Snack Bar",
            desc: "Nutrient-rich foods and smoothies"
        },
        {
            image: cleanliness,
            title: "Cleanliness",
            desc: "Maintaining a clean and hygienic environment"
        },
        {
            image: calisthenics,
            title: "Calisthenics",
            desc: "Bodyweight exercises for functional strength"
        }
    ];
    const visibleServices = showAllServices ? services : services.slice(0, 3);
    return (
        <section id="service" className="services-section">
            <div className="container">
                <h2 className="services-title">Our Services</h2>
                <div className="services-grid">
                    {visibleServices.map((service, index) => (
                        <div className="service-card" key={index}>
                            <img src={service.image} alt={service.title} className="service-image" />
                            <div className="service-content">
                                <h3 className="service-card-title">{service.title}</h3>
                                <p className="service-card-desc"> {service.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            {services.length > 3 && (
                <div className="view-more-wrapper">
                    <button className="view-more-btn" onClick={() => setShowAllServices(!showAllServices)}> {showAllServices ? "Show Less" : "View More"}</button>
                </div>
            )}
        </section>
    );
}