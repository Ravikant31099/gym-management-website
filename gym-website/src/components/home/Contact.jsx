import { useState, useEffect } from 'react';
import '../../style/Home.css';
import { FaInstagram, FaFacebook, FaWhatsapp, FaYoutube, FaMapMarkerAlt } from 'react-icons/fa';
import { allowOnlyAlphabets, allowOnlyNumbers } from "../../util/CommonUtil";
const BASE_URL = import.meta.env.VITE_API_LOCALURL;

export default function Contact({ planMessage }) {
    const [success, setSuccess] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [infoMessage, setInfoMessage] = useState("");
    const [formData, setFormData] = useState({ name: '', email: '', phone: '', subject: '', message: '' });

    useEffect(() => {
        if (planMessage && planMessage.text) {
            setFormData((prevData) => ({
                ...prevData,
                message: planMessage.text,
                subject: `Gym Membership - ${planMessage.name}`
            }));
            setInfoMessage(`Awesome choice! 🙌 Just drop your contact info below, and our fitness expert will reach out to you soon.`);
            const timer = setTimeout(() => { setInfoMessage(""); }, 3000);
            return () => clearTimeout(timer);
        }
    }, [planMessage]);

    const handleInputChange = (e) => {
        let { name, value } = e.target;
        if (name === "name") {
            value = allowOnlyAlphabets(value);
        }
        if (name === "phone") {
            value = allowOnlyNumbers(value);
        }
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (submitting) return;
        setSubmitting(true);
        try {
            const response = await fetch(`${BASE_URL}/api/leads`, {
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
                setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
            } else {
                let publicMessage = "Something went wrong. Please try again.";
                try {
                    const errorData = await response.json();
                    if (typeof errorData.message === "string" && errorData.message.trim()) {
                        publicMessage = errorData.message;
                    }
                } catch (parseError) {
                    console.log(parseError);
                }
                setErrorMessage(publicMessage);
                setTimeout(() => {
                    setErrorMessage("");
                }, 4000);
            }
        } catch (error) {
            setErrorMessage("We couldn't reach the server. Please check your connection and try again.");
            setTimeout(() => {
                setErrorMessage("");
            }, 3000);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <section id="contact">
            <div className="container">
                <h2 className="contact-title">{formData.subject ? `Join ${formData.subject.split(' - ')[1]}` : "Contact Us"}</h2>
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
                {infoMessage && (
                    <div className="alert alert-info" style={{ backgroundColor: '#e1f5fe', color: '#0288d1', padding: '10px', borderRadius: '5px', marginBottom: '15px', fontWeight: 'bold' }}>
                        ℹ️ {infoMessage}
                    </div>
                )}
                <div className="contact-container">
                    {/* LEFT SIDE — Moves below on mobile via CSS order: 2 */}
                    <div className="contact-info">
                        <h3>Get In Touch</h3>
                        <a href="tel:+919890743706" target="_blank" rel="noreferrer" className="contact-link"><p>📞 +91 98765 43210</p></a>
                        <a href="mailto:fitzonegym@gmail.com" target="_blank" rel="noreferrer" className="contact-link"><p>✉️ fitzone@gmail.com</p></a>
                        <div className="location-row">
                            <a href="https://maps.google.com" target="_blank" rel="noreferrer" className="map-btn"> <FaMapMarkerAlt /> Mumbai, India</a>
                        </div>
                        <span className="contact-subtext"> Start your fitness journey today with FitZone Gym.</span>
                        <div className="social-media-container">
                            <h3> Connect With Us</h3>
                            <div className="social-icons">
                                <a href="https://instagram.com" target="_blank" rel="noreferrer"><FaInstagram /></a>
                                <a href="https://facebook.com" target="_blank" rel="noreferrer"><FaFacebook /></a>
                                <a href="https://youtube.com" target="_blank" rel="noreferrer"><FaYoutube /></a>
                                <a href="https://wa.me/919999999999" target="_blank" rel="noreferrer"><FaWhatsapp /></a>
                            </div>
                        </div>
                    </div>
                    {/* RIGHT SIDE — Jumps to the top on mobile via CSS order: 1 */}
                    <div className="contact-form-wrapper">
                        <form onSubmit={handleSubmit} className="contact-form">
                            <div className="form-grid">
                                <input type="text" name="name" placeholder="Your Name" maxLength={50} required value={formData.name} onChange={handleInputChange} />
                                <input type="email" name="email" placeholder="Your Email" maxLength={50} required value={formData.email} onChange={handleInputChange} />
                                <input type="text" name="phone" placeholder="Phone Number" maxLength={12} required value={formData.phone} onChange={handleInputChange} />
                                <input type="text" name="subject" placeholder="Subject" maxLength={100} required value={formData.subject} onChange={handleInputChange} />
                            </div>
                            <textarea rows="5" name="message" placeholder="Your Message" maxLength={500} required value={formData.message} onChange={handleInputChange} />
                            <button type="submit" disabled={submitting}>{submitting ? "Sending..." : "Send Message"}</button>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
}