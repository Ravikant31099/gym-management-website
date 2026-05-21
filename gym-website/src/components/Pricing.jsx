import '../style/Pricing.css';
export default function Pricing() {
    const plans = [
        {
            name: "Basic",
            description: "Base tier feature setup",
            priceNum: "₹999",
            period: "/month"
        },
        {
            name: "Pro",
            description: "Most popular tier feature setup",
            priceNum: "₹1,999",
            period: "/month",
            popular: true
        },
        {
            name: "Premium",
            description: "Elite tier feature setup",
            priceNum: "₹2,999",
            period: "/month"
        }
    ];
    return (
        <section id="pricing" className="pricing-section">
            <div className="container">
                <h2 className="pricing-title">Membership Plans</h2>
                <div className="pricing-grid">
                    {plans.map((plan, index) => (
                        <div 
                            className={`pricing-card ${plan.popular ? 'popular-card' : ''}`} 
                            key={index}
                        >
                            {plan.popular && <span className="popular-badge">Most Popular</span>}
                            <h3 className="plan-name">{plan.name}</h3>
                            <div className="price-container">
                                <span className="price-amount">{plan.priceNum}</span>
                                <span className="price-period">{plan.period}</span>
                            </div>
                            <button className="pricing-btn" type="button">Choose Plan</button>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}