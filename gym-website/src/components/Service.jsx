export default function Service() {
    const service = [
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
        <section id="service">
            <div className="container">
                <h2 style={{ fontSize: "40px", marginBottom: "50px" }}>
                    Our Services
                </h2>
                <div className="card" style={{
                    display: "flex",
                    justifyContent: "center",
                    gap: "30px",
                    flexWrap: "wrap"
                }}>
                    {service.map((service, index) => (
                        <div
                            key={index}
                            style={{
                                background: "#1e293b",
                                padding: "20px",
                                width: "300px",
                                borderRadius: "10px"
                            }}
                        >
                            <h3>{service.title}</h3>
                            <p style={{ marginTop: "15px", color: "#cbd5e1" }}>
                                {service.desc}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}