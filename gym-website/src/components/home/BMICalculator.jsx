import { useState } from "react";
import "../../style/Home.css";

export default function BMICalculator() {
    const [height, setHeight] = useState("");
    const [weight, setWeight] = useState("");
    const [bmi, setBmi] = useState(null);
    const [category, setCategory] = useState("");
    const calculateBMI = () => {
        if (!height || !weight) {
            return;
        }
        const heightInMeter = height / 100;
        const bmiValue = (weight / (heightInMeter * heightInMeter)).toFixed(1);
        setBmi(bmiValue);
        if (bmiValue < 18.5) {
            setCategory("Underweight");
        } else if (bmiValue < 25) {
            setCategory("Normal Weight");
        } else if (bmiValue < 30) {
            setCategory("Overweight");
        } else {
            setCategory("Obese");
        }
    };
    const getCategoryColor = (bmiValue) => {
        if (bmiValue < 18.5) return "#ffcc00";
        if (bmiValue >= 18.5 && bmiValue < 25) return "#00ff88";
        if (bmiValue >= 25 && bmiValue < 30) return "#ff8800";
        return "#ff3333";
    };
    return (
        <section className="bmi-section" id="bmi">
            <div className="bmi-container">
                <h2 className="bmi-title">BMI Calculator</h2>
                <p className="bmi-subtitle"> Calculate your Body Mass Index instantly</p>
                <div className="bmi-form">
                    <div className="input-wrapper">
                        <input type="number" placeholder="Height (cm)" value={height} onChange={(e) => {const value = e.target.value; setHeight(value); if (!value || !weight) { setBmi(null); setCategory("");}}} />
                        <input type="number" placeholder="Weight (kg)" value={weight} onChange={(e) => {const value = e.target.value; setWeight(value); if (!height || !value) { setBmi(null); setCategory("");}}} />
                    </div>
                    <button onClick={calculateBMI}>Calculate BMI</button>
                </div>
                {bmi && (<div className="bmi-result">
                    <h3>Your BMI:{bmi}</h3>
                    <p style={{ color: getCategoryColor(bmi) }}>{category}</p>
                </div>
                )}
            </div>
        </section>
    );
}