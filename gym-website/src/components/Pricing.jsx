export default function Pricing() {
    const plans = [
        {
            name: "Basic",
            price: "₹999/month"
        },
        {
            name: "Pro",
            price: "₹1999/month"
        },
        {
            name: "Premium",
            price: "₹2999/month"
        }
    ];
    return (
        <section id="pricing">
            <div className="container">
                <h2 style={{
                    fontSize: "40px",
                    marginBottom: "50px"
                }}>
                    Membership Plans
                </h2>
                <div style={{
                    display: "flex",
                    justifyContent: "center",
                    gap: "30px",
                    flexWrap: "wrap"
                }}>
                    {plans.map((plan, index) => (
                        <div className="card"
                            key={index}
                            style={{
                                background: "#1e293b",
                                padding: "20px",
                                width: "250px",
                                borderRadius: "10px"
                            }}
                        >
                            <h3>{plan.name}</h3>
                            <h1 className="price-text">
                                {plan.price}
                            </h1>
                            <button>Choose Plan</button>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}