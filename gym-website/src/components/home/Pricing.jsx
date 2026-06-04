import '../../style/Home.css';
import { useEffect, useState } from "react";

export default function Pricing() {
    const [plans, setPlans] = useState([]);
    const [showAllPlans, setShowAllPlans] = useState(false);
    const visiblePlans = showAllPlans ? plans : plans.slice(0, 3);
    useEffect(() => {
        fetchPlans();
    }, []);
    const fetchPlans = async () => {
        try {
            const response = await fetch(`http://localhost:8080/api/plans`);
            const data = await response.json();
            setPlans(data);
        } catch (error) {
            console.log(error);
        }
    };
    return (
        <section id="pricing" className="pricing-section">
            <div className="container">
                <h2 className="pricing-title">Membership Plans</h2>
                <div className="pricing-grid">
                    {visiblePlans.map((plan, index) => (
                        <div
                            className={`pricing-card ${plan.popular ? 'popular-card' : ''}`}
                            key={index}
                        >
                            {plan.popular && <span className="popular-badge">Most Popular</span>}
                            <h3 className="plan-name">{plan.name}</h3>
                            <div className="price-container">
                                <span className="price-amount">{plan.price}</span>
                                <span className="price-period">{plan.period}</span>
                            </div>
                            <button className="pricing-btn" type="button">Choose Plan</button>
                        </div>
                    ))}
                </div>
            </div>
            {plans.length > 3 && (
                <div className="view-more-wrapper">
                    <button className="view-more-btn" onClick={() => setShowAllPlans(!showAllPlans)}> {showAllPlans ? "Show Less" : "View More"}</button>
                </div>
            )}
        </section>
    );
}