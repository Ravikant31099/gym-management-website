export default function DashboardCard({ title, value, color, onClick }) {
    return (
        <div className="dashboard-card" onClick={onClick}>
            <div
                className="dashboard-circle"
                style={{ background: color }}
            />
            <h3>{title}</h3>
            <h1>{value}</h1>
            <p style={{ color }}>Live Data</p>
        </div>
    );
}