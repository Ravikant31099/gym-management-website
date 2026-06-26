import '../../style/Home.css';
import { formatCurrency } from '../../util/CommonUtil';
import { apiRequest, handleApiResponse } from "../../util/api";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";

export default function Pricing({ onSelectPlan }) {
    const [plans, setPlans] = useState([]);
    const [showAllPlans, setShowAllPlans] = useState(false);
    const sectionRef = useRef(null);
    useEffect(() => { fetchPlans(); }, []);
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add('visible'); }),
            { threshold: 0.1 }
        );
        const els = sectionRef.current?.querySelectorAll('.reveal');
        els?.forEach((el) => observer.observe(el));
        return () => observer.disconnect();
    }, [plans, showAllPlans]);
    const fetchPlans = async () => {
        try {
            const response = await apiRequest("/api/plans", "GET");
            await handleApiResponse(response);
            const data = await response.json();
            setPlans(data);
        } catch (error) {
            toast.error(error.message);
        }
    };
    const visiblePlans = showAllPlans ? plans : plans.slice(0, 3);
    const handleChoosePlan = (planName) => {
        if (onSelectPlan) {
            onSelectPlan(planName);
        }
        const contactSection = document.getElementById('contact');
        if (contactSection) {
            contactSection.scrollIntoView({ behavior: 'smooth' });
        }
    };
    return (
        <section id="pricing" className="pricing-section" ref={sectionRef}>
            <div className="container">
                <span className="section-eyebrow reveal">Flexible Options</span>
                <h2 className="pricing-title reveal reveal-delay-1">Membership Plans</h2>
                <div className="pricing-grid">
                    {visiblePlans.map((plan, index) => (
                        <div className={`pricing-card ${plan.popular ? 'popular-card' : ''} reveal reveal-delay-${index + 1}`} key={index}>
                            {plan.popular && <span className="popular-badge">Most Popular</span>}
                            <h3 className="plan-name">{plan.name}</h3>
                            <div className="price-container">
                                <span className="price-amount">{formatCurrency(plan.price)}</span>
                                <span className="price-period">{plan.period}</span>
                            </div>
                            <button className="pricing-btn" type="button" onClick={() => handleChoosePlan(plan.name)}>Choose Plan</button>
                        </div>
                    ))}
                </div>
            </div>
            {plans.length > 3 && (
                <div className="view-more-wrapper reveal">
                    <button className="view-more-btn" onClick={() => setShowAllPlans(!showAllPlans)}>
                        {showAllPlans ? "Show Less" : "View More Plans"}
                    </button>
                </div>
            )}
        </section>
    );
}
