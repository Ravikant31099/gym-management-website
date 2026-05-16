import '../style/Service.css';
export default function Service() {
    const services = [
        {
            title: "Personal Training",
            desc: "Get one-on-one coaching from expert trainers."
        },
        {
            title: "Weight Loss",
            desc: "Customized workout plans for fat burning."
        },
        {
            title: "Strength Training",
            desc: "Build muscle and improve endurance."
        }
    ];

    return (
        <section id="service" className="services-section">
            <div className="container">
                <h2 className="services-title">Our Services</h2>
                <div className="services-grid">
                    {services.map((service, index) => (
                        <div className="service-card" key={index}>
                            <h3 className="service-card-title">{service.title}</h3>
                            <p className="service-card-desc">
                                {service.desc}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}