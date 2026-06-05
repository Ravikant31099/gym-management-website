import '../../style/Home.css';
import "react-toastify/dist/ReactToastify.css";
import { formatCurrency } from '../../util/CommonUtil';
import { apiRequest, handleApiResponse } from "../../util/api";
import { toast, ToastContainer } from "react-toastify";
import { useEffect, useState } from "react";

export default function Pricing() {
    useEffect(() => { fetchPlans(); }, []);
    const [plans, setPlans] = useState([]);
    const [showAllPlans, setShowAllPlans] = useState(false);
    const visiblePlans = showAllPlans ? plans : plans.slice(0, 3);
    const fetchPlans = async () => {
        try {
            const response = await apiRequest("/api/plans", "GET");
            await handleApiResponse(response);
            const data = await response.json();
            setPlans(data);
        } catch (error) {
            console.log(error);
            toast.error(error.message);
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
                                <span className="price-amount">{formatCurrency(plan.price)}</span>
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
            <ToastContainer position="top-right" autoClose={3000} theme="dark" />
        </section>
        
    );
}