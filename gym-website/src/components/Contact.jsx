import { useState } from 'react';
import '../style/Home.css';
import { FaInstagram, FaFacebook, FaWhatsapp, FaYoutube, FaMapMarkerAlt } from 'react-icons/fa';

export default function Contact() {
    const [success, setSuccess] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch("http://localhost:8080/api/leads", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formData)
            });
            if (response.ok) {
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
            } else {
                const errorData = await response.json();
                const messages = Object.values(errorData);
                setErrorMessage(messages.join(" - "));
                setTimeout(() => {
                    setErrorMessage("");
                }, 4000);
            }
        } catch (error) {
            setErrorMessage("Backend connection failed due to " + error.message);
            setTimeout(() => {
                setErrorMessage("");
            }, 3000);
        }
        console.log('Form Data:', formData);
    };

    return (
        <section id="contact">
            <div className="container">
                <h2 className="contact-title">Contact Us</h2>
                {success && (
                    <div className="alert alert-success">
                        Message Sent Successfully ✅
                    </div>
                )}
                {errorMessage && (
                    <div className="alert alert-error">
                        {errorMessage}
                    </div>
                )}
                <div className="contact-container">
                    {/* LEFT SIDE */}
                    <div className="contact-info">
                        <h3>Get In Touch</h3>
                        <p>📞 +91 98765 43210</p>
                        <p>✉️ fitzone@gmail.com</p>
                        <div className="location-row">
                            <a href="https://maps.google.com/?q=YOUR_GYM_LOCATION" target="_blank" rel="noreferrer" className="map-btn"> <FaMapMarkerAlt /> Mumbai, India</a>
                        </div>
                        <p className="contact-subtext">
                            Start your fitness journey today with FitZone Gym.
                        </p>
                        <div className="social-media-container">
                            <h3> Follow Us</h3>
                            <div className="social-icons">
                                <a href="https://instagram.com" target="_blank" rel="noreferrer"><FaInstagram /></a>
                                <a href="https://facebook.com" target="_blank" rel="noreferrer"><FaFacebook /></a>
                                <a href="https://youtube.com" target="_blank" rel="noreferrer"><FaYoutube /></a>
                                <a href="https://wa.me/919999999999" target="_blank" rel="noreferrer"><FaWhatsapp /></a>
                            </div>
                        </div>
                    </div>
                    {/* RIGHT SIDE */}
                    <div className="contact-form-wrapper">
                        <form onSubmit={handleSubmit} className="contact-form">
                            <div className="form-grid">
                                <input type="text" placeholder="Your Name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                                <input type="email" placeholder="Your Email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                                <input type="text" placeholder="Phone Number" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
                                <input type="text" placeholder="Subject" value={formData.subject} onChange={(e) => setFormData({ ...formData, subject: e.target.value })} />
                            </div>
                            <textarea rows="5" placeholder="Your Message" value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} />
                            <button type="submit">Send Message</button>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
}