import '../../style/Home.css';
import { useState, useEffect, useRef } from 'react';

export default function Testimonials() {
    const [activeIndex, setActiveIndex] = useState(0);
    const scrollTrackRef = useRef(null);
    const autoplayRef = useRef(null);
    const visibleCards = 3;
    const sectionRef = useRef(null);
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
        },
        {
            name: "Aanya Sharma",
            initials: "AS",
            role: "Member since 2024",
            feedback: "The vibe here is unmatched. It doesn't matter if you are a beginner or an athlete, the trainers tailor everything perfectly. Absolutely clean and premium equipment!"
        },
        {
            name: "Rohan Malhotra",
            initials: "RM",
            role: "Member since 2025",
            feedback: "Switching to FitZone was the best decision I've made for my health. The strength training zone is massive, and the crowd is incredibly motivating."
        },
        {
            name: "Priya Nair",
            initials: "PN",
            role: "Member since 2023",
            feedback: "I've tried multiple premium gyms across the city, but nothing beats the community and group class energy here. It’s my absolute happy place after a long workday."
        }
    ];
    const totalDots = Math.max(1, reviews.length - visibleCards + 1);

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
    useEffect(() => {
        autoplayRef.current = setInterval(() => {
            setActiveIndex((prevIndex) => {
                const nextIndex = prevIndex >= totalDots - 1 ? 0 : prevIndex + 1;
                scrollToCard(nextIndex);
                return nextIndex;
            });
        }, 2000); 
        return () => clearInterval(autoplayRef.current);
    }, [totalDots]);
    const scrollToCard = (index) => {
        if (!scrollTrackRef.current) return;
        const track = scrollTrackRef.current;
        const firstCard = track.querySelector('.testimonial-card');
        if (firstCard) {
            const gap = parseInt(window.getComputedStyle(track).gap) || 0;
            const cardWidth = firstCard.clientWidth;
            const scrollStep = cardWidth + gap;
            track.scrollTo({
                left: scrollStep * index,
                behavior: 'smooth',
            });
            setActiveIndex(index);
        }
    };
    const handleScroll = () => {
        if (!scrollTrackRef.current) return;
        const track = scrollTrackRef.current;
        const firstCard = track.querySelector('.testimonial-card');
        if (firstCard) {
            const gap = parseInt(window.getComputedStyle(track).gap) || 0;
            const cardWidth = firstCard.clientWidth;
            const scrollStep = cardWidth + gap;         
            const currentComputedIndex = Math.round(track.scrollLeft / scrollStep);
            if (currentComputedIndex !== activeIndex && currentComputedIndex < totalDots) {
                setActiveIndex(currentComputedIndex);
            }
        }
    };
    const handleDotClick = (index) => {
        clearInterval(autoplayRef.current);
        scrollToCard(index);
    };
    return (
        <section id="testimonials" className="testimonials-section" ref={sectionRef}>
            <div className="container">
                <span className="section-eyebrow reveal">Real Results</span>
                <h2 className="testimonials-title reveal reveal-delay-1">What Members Say</h2>
                <div className="testimonials-grid premium-scroll-track" ref={scrollTrackRef} onScroll={handleScroll}>
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
                <div className="testimonial-dots-container">
                    {[...Array(totalDots)].map((_, i) => (
                        <span 
                            key={i} 
                            className={`testimonial-dot ${activeIndex === i ? 'active' : ''}`}
                            onClick={() => handleDotClick(i)}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}
