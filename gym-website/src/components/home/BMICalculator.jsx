import { useState, useEffect, useRef } from "react";
import { Chart, registerables } from "chart.js";
import "../../style/Home.css";
Chart.register(...registerables);
const HOURS = ["6am", "7am", "8am", "9am", "10am", "11am", "12pm", "1pm", "2pm", "3pm", "4pm", "5pm", "6pm", "7pm", "8pm", "9pm", "10pm"];
const RUSH_DATA = {
    Mon: [12, 28, 45, 38, 22, 18, 20, 24, 19, 22, 30, 55, 72, 68, 52, 35, 18],
    Tue: [10, 25, 40, 35, 20, 16, 22, 26, 20, 25, 35, 60, 75, 70, 55, 38, 20],
    Wed: [14, 30, 48, 40, 24, 20, 22, 26, 21, 24, 32, 58, 70, 65, 50, 32, 16],
    Thu: [11, 27, 42, 36, 21, 17, 21, 25, 19, 23, 33, 62, 78, 72, 58, 40, 22],
    Fri: [13, 32, 50, 42, 26, 22, 25, 30, 24, 28, 40, 65, 80, 76, 62, 45, 28],
    Sat: [8, 14, 22, 35, 48, 52, 50, 45, 40, 42, 50, 58, 62, 55, 45, 30, 15],
    Sun: [6, 10, 18, 28, 40, 46, 44, 40, 36, 38, 46, 50, 54, 48, 38, 24, 10],
};
const PEAK_LABELS = {
    Mon: "Evening rush peaks at 6–7 PM",
    Tue: "Evening rush peaks at 6–7 PM",
    Wed: "Evening rush peaks at 6–7 PM",
    Thu: "Evening rush peaks at 6–7 PM",
    Fri: "Busiest day — peak at 6 PM",
    Sat: "Steady throughout the morning",
    Sun: "Quietest day of the week",
};

export default function BMICalculator() {
    const [height, setHeight] = useState("");
    const [weight, setWeight] = useState("");
    const [bmi, setBmi] = useState(null);
    const [category, setCategory] = useState("");
    const [activeDay, setActiveDay] = useState("Mon");
    const chartRef = useRef(null);
    const chartInst = useRef(null);
    const calculateBMI = () => {
        if (!height || !weight) return;
        const hm = height / 100;
        const val = (weight / (hm * hm)).toFixed(1);
        setBmi(val);
        if (val < 18.5) setCategory("Underweight");
        else if (val < 25) setCategory("Normal Weight");
        else if (val < 30) setCategory("Overweight");
        else setCategory("Obese");
    };
    const getCategoryColor = (v) => {
        if (v < 18.5) return "#facc15";
        if (v < 25) return "#10b981";
        if (v < 30) return "#f97316";
        return "#ef4444";
    };
    const gaugePercent = bmi ? Math.min(100, Math.max(0, ((bmi - 10) / 30) * 100)) : 0;
    useEffect(() => {
        if (!chartRef.current) return;
        if (chartInst.current) chartInst.current.destroy();
        const data = RUSH_DATA[activeDay];
        const peak = Math.max(...data);
        chartInst.current = new Chart(chartRef.current, {
            type: "line",
            data: {
                labels: HOURS,
                datasets: [
                    {
                        label: "Members",
                        data,
                        borderColor: "#10b981",
                        backgroundColor: (ctx) => {
                            const gradient = ctx.chart.ctx.createLinearGradient(0, 0, 0, ctx.chart.height);
                            gradient.addColorStop(0, "rgba(16,185,129,0.28)");
                            gradient.addColorStop(1, "rgba(16,185,129,0)");
                            return gradient;
                        },
                        borderWidth: 2.5,
                        fill: true,
                        tension: 0.42,
                        pointRadius: data.map(v => v === peak ? 6 : 0),
                        pointHoverRadius: 6,
                        pointBackgroundColor: data.map(v => v === peak ? "#34d399" : "#10b981"),
                        pointBorderColor: "#0d1422",
                        pointBorderWidth: 2,
                    },
                    {
                        label: "Last Week",
                        data: data.map(v => Math.max(0, v + Math.floor((Math.random() * 14) - 7))),
                        borderColor: "rgba(148,163,184,0.35)",
                        backgroundColor: "transparent",
                        borderWidth: 1.5,
                        fill: false,
                        tension: 0.42,
                        pointRadius: 0,
                        pointHoverRadius: 4,
                        borderDash: [4, 4],
                    }
                ],
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                animation: { duration: 600, easing: "easeInOutQuart" },
                interaction: { mode: "index", intersect: false },
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        backgroundColor: "#111926",
                        borderColor: "rgba(255,255,255,0.08)",
                        borderWidth: 1,
                        padding: 10,
                        titleColor: "#94a3b8",
                        bodyColor: "#f1f5f9",
                        titleFont: { size: 12, family: "'Inter', sans-serif" },
                        bodyFont: { size: 13, family: "'Inter', sans-serif", weight: "600" },
                        callbacks: {
                            label: (ctx) => ` ${ctx.dataset.label}: ${ctx.parsed.y} members`,
                        },
                    },
                },
                scales: {
                    x: {
                        grid: { color: "rgba(255,255,255,0.04)", drawTicks: false },
                        border: { display: false },
                        ticks: {
                            color: "#64748b",
                            font: { size: 11, family: "'Inter', sans-serif" },
                            maxRotation: 0,
                            maxTicksLimit: 9,
                        },
                    },
                    y: {
                        grid: { color: "rgba(255,255,255,0.04)", drawTicks: false },
                        border: { display: false },
                        ticks: {
                            color: "#64748b",
                            font: { size: 11, family: "'Inter', sans-serif" },
                            callback: (v) => `${v}`,
                            maxTicksLimit: 5,
                        },
                        min: 0,
                        suggestedMax: 90,
                    },
                },
            },
        });

        return () => chartInst.current?.destroy();
    }, [activeDay]);

    return (
        <section className="bmi-section" id="bmi">
            <div className="container">
                {/* BMI Calculator */}
                <div className="bmi-container">
                    <h2 className="bmi-title">BMI Calculator</h2>
                    <p className="bmi-subtitle">Calculate your Body Mass Index instantly</p>
                    <div className="bmi-form">
                        <div className="input-wrapper">
                            <input type="number" placeholder="Height (cm)" value={height} onChange={(e) => { const v = e.target.value; setHeight(v); if (!v || !weight) { setBmi(null); setCategory(""); } }}
                            />
                            <input type="number" placeholder="Weight (kg)" value={weight} onChange={(e) => { const v = e.target.value; setWeight(v); if (!height || !v) { setBmi(null); setCategory(""); } }}
                            />
                        </div>
                        <button onClick={calculateBMI}>Calculate BMI</button>
                    </div>
                    {bmi && (
                        <div className="bmi-result">
                            <h3>Your BMI Score</h3>
                            <p style={{ color: getCategoryColor(bmi) }}>
                                {bmi} — {category}
                            </p>
                            <div className="bmi-gauge">
                                <div
                                    className="bmi-gauge-fill"
                                    style={{ width: `${gaugePercent}%`, background: getCategoryColor(bmi) }}
                                />
                            </div>
                        </div>
                    )}
                </div>
                {/* Weekly Rush Hour Chart */}
                <div className="rush-chart-wrapper">
                    <div className="rush-chart-header">
                        <div>
                            <p className="rush-chart-title">Weekly Rush Hour</p>
                            <p className="rush-chart-subtitle">{PEAK_LABELS[activeDay]}</p>
                        </div>
                        <div className="rush-day-tabs">
                            {Object.keys(RUSH_DATA).map((day) => (
                                <button
                                    key={day}
                                    className={`rush-day-tab${activeDay === day ? " active" : ""}`}
                                    onClick={() => setActiveDay(day)}
                                >
                                    {day
                                    }</button>
                            ))}
                        </div>
                    </div>
                    <div className="rush-chart-canvas-wrap">
                        <canvas ref={chartRef} />
                    </div>
                    <div className="rush-chart-legend">
                        <div className="rush-legend-item">
                            <div className="rush-legend-dot" style={{ background: "#10b981" }} />
                            This week
                        </div>
                        <div className="rush-legend-item">
                            <div className="rush-legend-dot" style={{ background: "rgba(148,163,184,0.4)" }} />
                            Last week
                        </div>
                    </div>
                </div>

            </div>
        </section>
    );
}