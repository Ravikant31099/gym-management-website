import { useState } from 'react';

export default function Contact() {
    const [success, setSuccess] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Form Data:', formData);

        setSuccess(true);

        setTimeout(() => {
            setSuccess(false);
        }, 3000);

        setFormData({
            name: "",
            email: "",
            phone: "",
            subject: "",
            message: ""
        });
    }

    return (
        <section id="contact">
            <div className="container">
                <h2 style={{
                    fontSize: "40px",
                    marginBottom: "50px"
                }}>Contact Us
                </h2>
                {success && (
                    <div style={{
                        background: "#22c55e",
                        padding: "15px",
                        borderRadius: "8px",
                        marginBottom: "20px",
                        fontWeight: "bold"
                    }}>Message Sent Successfully ✅
                    </div>
                )}
                <div className="contact-container">
                    {/* LEFT SIDE */}
                    <div
                        style={{
                            background: "#1e293b",
                            padding: "30px",
                            borderRadius: "10px",
                            textAlign: "left",
                            height: "100%"
                        }}
                    >
                        <h3 style={{ marginBottom: "20px" }}>
                            Get In Touch
                        </h3>
                        <p style={{ marginBottom: "15px" }}>
                            📍 Mumbai, India
                        </p>
                        <p style={{ marginBottom: "15px" }}>
                            📞 +91 98765 43210
                        </p>
                        <p style={{ marginBottom: "15px" }}>
                            ✉️ fitzone@gmail.com
                        </p>
                        <p style={{
                            marginTop: "30px",
                            color: "#cbd5e1"
                        }}>Start your fitness journey today with FitZone Gym.
                        </p>
                    </div>

                    {/* RIGHT SIDE */}
                    <div
                        style={{
                            background: "#1e293b",
                            padding: "40px",
                            borderRadius: "10px"
                        }}
                    >
                        <form
                            onSubmit={handleSubmit}
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: "20px"
                            }}>
                            <div className="form-grid">
                                <input
                                    type="text"
                                    placeholder="Your Name"
                                    value={formData.name}
                                    onChange={(e) =>
                                        setFormData({ ...formData, name: e.target.value })
                                    }/>
                                <input
                                    type="email"
                                    placeholder="Your Email"
                                    value={formData.email}
                                    onChange={(e) =>
                                        setFormData({ ...formData, email: e.target.value })
                                    }/>
                                <input
                                    type="text"
                                    placeholder="Phone Number"
                                    value={formData.phone}
                                    onChange={(e) =>
                                        setFormData({ ...formData, phone: e.target.value })
                                    }/>
                                <input
                                    type="text"
                                    placeholder="Subject"
                                    value={formData.subject}
                                    onChange={(e) =>
                                        setFormData({ ...formData, subject: e.target.value })
                                    }/>
                            </div>
                            <textarea
                                rows="5"
                                placeholder="Your Message"
                                value={formData.message}
                                onChange={(e) =>
                                    setFormData({ ...formData, message: e.target.value })
                                }/>
                            <button type="submit">Send Message</button>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
}