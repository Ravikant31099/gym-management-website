import '../../style/Home.css';
import { useEffect, useRef } from 'react';

export default function Testimonials() {
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
            { threshold: 0.15 }
        );
        const els = sectionRef.current?.querySelectorAll('.reveal');
        els?.forEach((el) => observer.observe(el));
        return () => observer.disconnect();
    }, []);
    const reviews = [
        {
            name: "William Brown",
            initials: "WB",
            role: "Member since 2024",
            feedback: "FitZone has completely transformed my fitness journey. The trainers are phenomenal and the community keeps me coming back every single day."
        },
        {
            name: "Rosa Davis",
            initials: "RD",
            role: "Member since 2023",
            feedback: "I love the variety of classes here. There's something for everyone, and the facilities are absolutely top-notch. Best gym in Mumbai!"
        },
        {
            name: "James Wilson",
            initials: "JW",
            role: "Member since 2022",
            feedback: "The personalised training programs helped me hit my goals faster than I ever thought possible. Incredibly knowledgeable and friendly staff."
        }
    ];
    return (
        <section id="testimonials" className="testimonials-section" ref={sectionRef}>
            <div className="container">
                <span className="section-eyebrow reveal">Real Results</span>
                <h2 className="testimonials-title reveal reveal-delay-1">What Members Say</h2>
                <div className="testimonials-grid">
                    {reviews.map((review, index) => (
                        <div className={`testimonial-card reveal reveal-delay-${index + 1}`} key={index}>
                            <div>
                                <div className="testimonial-stars">
                                    {[...Array(5)].map((_, i) => (
                                        <span key={i} className="testimonial-star">★</span>
                                    ))}
                                </div>
                                <p className="testimonial-feedback">"{review.feedback}"</p>
                            </div>
                            <div className="testimonial-author">
                                <div className="testimonial-avatar">{review.initials}</div>
                                <div>
                                    <h4 className="testimonial-name">{review.name}</h4>
                                    <p className="testimonial-role">{review.role}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
