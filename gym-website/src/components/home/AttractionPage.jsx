import React from "react";
import { useNavigate } from "react-router-dom";
import "../../style/AttractionPage.css";
import gymVideo from "../../assets/gym-Video.mp4";
import gymImage1 from "../../assets/gym-gallery1.jpg";
import gymImage2 from "../../assets/gym-gallery2.jpg";
import gymImage3 from "../../assets/gym-gallery3.jpg";
import gymImage4 from "../../assets/gym-gallery4.jpg";
import { Dumbbell, ChartNoAxesCombined, Apple, UserRoundCog, Target, TrendingUp, ShieldCheck, Trophy } from "lucide-react";
import { motion, useScroll } from "framer-motion";

export default function AttractionPage() {
  const { scrollYProgress } = useScroll();
  const navigate = useNavigate();
  const handleRedirect = () => {
    navigate('/', { state: { scrollToContact: true } });
  };
  const problems = [
    {
      icon: Target,
      title: "No Structure"
    },
    {
      icon: TrendingUp,
      title: "No Tracking"
    },
    {
      icon: ShieldCheck,
      title: "No Accountability"
    },
    {
      icon: Trophy,
      title: "No Results"
    }
  ];
  const features = [
    {
      icon: Dumbbell,
      title: "Smart Training Plans",
      description:
        "Personalized workouts designed to match your goals.",
    },
    {
      icon: ChartNoAxesCombined,
      title: "Progress Tracking",
      description:
        "Monitor weight, strength and performance improvements.",
    },
    {
      icon: Apple,
      title: "Nutrition Support",
      description:
        "Customized diet guidance to maximize results.",
    },
    {
      icon: UserRoundCog,
      title: "Expert Coaches",
      description:
        "Get help from experienced fitness professionals.",
    },
  ];
  const journey = [
    {
      phase: "Day 1",
      text: "Fitness assessment and goal planning.",
    },
    {
      phase: "Week 2",
      text: "Structured workouts and accountability.",
    },
    {
      phase: "Month 1",
      text: "Noticeable strength and endurance gains.",
    },
    {
      phase: "Month 3",
      text: "Visible transformation and confidence boost.",
    },
  ];
  const testimonials = [
    {
      name: "Rahul",
      review: "Lost 10kg and completely changed my lifestyle.",
    },
    {
      name: "Priya",
      review: "The trainers kept me motivated throughout.",
    },
    {
      name: "Aman",
      review: "The best investment I've made in myself.",
    },
  ];
  return (
    <div className="attraction-page">
      <div className="section-nav">
        <a href="#hero">01</a>
        <a href="#stats">02</a>
        <a href="#problems">03</a>
        <a href="#features">04</a>
        <a href="#trust">05</a>
        <a href="#gallery">06</a>
        <a href="#journey">07</a>
        <a href="#stories">08</a>
        <a href="#contact">09</a>
      </div>
      <motion.div className="scroll-progress" style={{ scaleX: scrollYProgress }} />
      <section id="hero" className="hero">
        <video autoPlay muted loop playsInline className="hero-video">
          <source src={gymVideo} type="video/mp4" />
        </video>
        <div className="hero-overlay" />
        <motion.div className="hero-content" initial={{ opacity: 0, y: 70 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }}>
          <span className="hero-badge"> FITNESS • DISCIPLINE • RESULTS</span>
          <h1> Become The Strongest Version Of Yourself</h1>
          <p> A complete fitness ecosystem designed to help you build strength, confidence and lasting habits.</p>
        </motion.div>
      </section>
      <section id="stats" className="stats-section">
        <div className="container">
          <div className="stats-grid">
            <motion.div className="stat-card" whileHover={{ y: -5 }}>
              <h3>500+</h3>
              <p>Members Transforming Their Lives</p>
            </motion.div>
            <motion.div className="stat-card" whileHover={{ y: -5 }}>
              <h3>25+</h3>
              <p>Certified Coaches</p>
            </motion.div>
            <motion.div className="stat-card" whileHover={{ y: -5 }} >
              <h3>12K+</h3>
              <p>Workouts Completed</p>
            </motion.div>
            <motion.div className="stat-card" whileHover={{ y: -5 }}>
              <h3>95%</h3>
              <p>Retention Rate</p>
            </motion.div>
          </div>
        </div>
      </section>
      <section id="problems">
        <div className="container">
          <motion.h2 className="section-title" initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }}>
            Why Most Fitness Journeys Fail
          </motion.h2>
          <div className="problem-grid">
            {problems.map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div key={item.title} className="problem-card" initial={{ opacity: 0, y: 60 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: index * 0.15 }} whileHover={{ y: -10, scale: 1.03 }}>
                  <Icon size={40} className="problem-icon" />
                  <h3>{item.title}</h3>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>
      <section id="features" className="features-section">
        <div className="container">
          <h2 className="section-title"> Everything You Need In One Place</h2>
          <div className="features-grid">
            {features.map((feature, index) => (
              <motion.div key={feature.title} className="feature-card" initial={{ opacity: 0, y: 80 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: index * 0.12 }} whileHover={{ y: -12, scale: 1.03 }}>
                <div className="feature-icon">
                  <feature.icon size={42} strokeWidth={1.8} />
                </div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      <section id="trust" className="trust-section">
        <div className="container">
          <h2 className="section-title">Why Members Choose Us</h2>
          <div className="trust-grid">
            {[
              "Personalized Workout Plans",
              "Certified Trainers",
              "Nutrition Guidance",
              "Progress Tracking",
              "Flexible Timings",
              "Motivating Community"
            ].map((item, index) => (
              <motion.div key={item} className="trust-card" initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} whileHover={{ y: -6 }}><span>✓</span>{item}</motion.div>
            ))}
          </div>
        </div>
      </section>
      <section id="gallery" className="gallery-section">
        <div className="container">
          <h2 className="section-title"> Explore Our Facility</h2>
          <p className="gallery-subtitle">
            Designed to help you train smarter, push harder and achieve more.
          </p>
          <div className="gallery-grid">
            <motion.div className="gallery-item large" whileHover={{ scale: 1.03 }}>
              <img src={gymImage1} alt="Gym Floor" loading="lazy"/>
            </motion.div>
            <motion.div className="gallery-item" whileHover={{ scale: 1.03 }}>
              <img src={gymImage2} alt="Strength Zone" loading="lazy"/>
            </motion.div>
            <motion.div className="gallery-item" whileHover={{ scale: 1.03 }}>
              <img src={gymImage3} alt="Heavy Machinary" loading="lazy"/>
            </motion.div>
            <motion.div className="gallery-item" whileHover={{ scale: 1.03 }}>
              <img src={gymImage4} alt="Calesthics" loading="lazy"/>
            </motion.div>
          </div>

        </div>
      </section>
      <section id="journey" className="roadmap-section">
        <div className="container">
          <h2 className="section-title"> Way To Transform </h2>
          <div className="journey-roadmap">
            {[
              "Join",
              "Assessment",
              "Custom Plan",
              "Weekly Tracking",
              "Transformation"
            ].map((step, index) => (
              <motion.div key={step} className="journey-step" initial={{ opacity: 0, scale: 0.7 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: index * 0.15 }} whileHover={{ scale: 1.08 }}>
                <div className="journey-number">{index + 1}</div>
                <h3>{step}</h3>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      <section className="experience-section">
        <div className="container">
          <motion.h2 className="section-title" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}>  Experience Training Differently</motion.h2>
          <p>Personalized coaching, structured programs,progress tracking and expert support designedto keep you moving forward.</p>
        </div>
      </section>
      <section className="timeline-section">
        <div className="container">
          <h2 className="section-title">Your Transformation Journey</h2>
          <div className="timeline">
            {journey.map((item, index) => (
              <motion.div key={item.phase} className="timeline-card" initial={{ opacity: 0, x: index % 2 === 0 ? -120 : 120 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }} whileHover={{ y: -8 }}>
                <div className="timeline-phase">{item.phase}</div>
                <p>{item.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      <section id="stories">
        <div className="container">
          <h2 className="section-title">Success Stories</h2>
          <div className="testimonial-grid">
            {testimonials.map((item, index) => (
              <motion.div key={item.name} className="testimonial-card" initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: index * 0.15 }} whileHover={{ y: -8, scale: 1.03 }}>
                <p>"{item.review}"</p>
                <h4>{item.name}</h4>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      <section id="contact" className="cta-section">
        <motion.div className="cta-content" initial={{ opacity: 0, y: 80 }} whileInView={{ opacity: 1, y: 0, }}>
          <h2> The Strongest Version Of Yourself Is Waiting.</h2>
          <p> Build strength. Build confidence. Build a lifestyle that lasts.</p>
          <motion.button className="floating-cta" onClick={handleRedirect} initial={{ opacity: 0, y: 100 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1 }}>Book Your Free Consultation </motion.button>
        </motion.div>
      </section>
    </div>
  )
};