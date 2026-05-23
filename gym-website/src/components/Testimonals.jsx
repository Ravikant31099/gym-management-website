import '../style/Home.css';
export default function Testimonials() {
    const reviews = [
        {
            name: "William Brown",
            feedback: "FitZone has transformed my fitness journey! The trainers are amazing and the community is so supportive. I've never felt better!"
        },
        {
            name: "Rosa Davis",
            feedback: "I love the variety of classes at FitZone. There's something for everyone, and the facilities are top-notch. Highly recommend!"
        },
        {
            name: "James Wilson",
            feedback: "The personalized training programs at FitZone have helped me achieve my goals faster than I ever thought possible. The staff is incredibly knowledgeable and friendly."
        }
    ];

    return (
        <section id="testimonials" className="testimonials-section">
            <div className="container">
                <h2 className="testimonials-title">What our Customers Say</h2>
                <div className="testimonials-grid">
                    {reviews.map((review, index) => (
                        <div className="testimonial-card" key={index}>
                            <p className="testimonial-feedback">
                                "{review.feedback}"
                            </p>
                            <h4 className="testimonial-name">
                                {review.name}
                            </h4>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}