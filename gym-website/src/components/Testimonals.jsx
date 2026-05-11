export default function Testimonals() {
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
    ]
    return (
        <section id="testimonials">
            <div className="container">
                <h2 style={{
                    fontSize: "40px",
                    marginBottom: "50px"
                }}>What our Customers Say
                </h2>
                <div style={{
                    display: "flex",
                    gap: "30px",
                    flexWrap: "wrap",
                    justifyContent: "center"
                }}>
                    {reviews.map((review, index) => (
                        <div
                            key={index}
                            className="card"
                            style={{
                                background: "#1e293b",
                                padding: "30px",
                                borderRadius: "10px",
                                width: "300px",
                                boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
                                transition: "0.3s"
                            }}>
                            <p style={{
                                fontStyle: "italic",
                                marginBottom: "20px",
                                lineHeight: "1.5",
                                color: "#cbd5e1"
                            }}> {review.feedback}
                            </p>
                            <h4 style={{
                                color: "#0ea5e9",
                                marginBottom: "10px"
                            }}> {review.name}
                            </h4>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}