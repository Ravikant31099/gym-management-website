export default function DetailItem({ label, value }) {
        return (
            <div className="detail-item">
                <p className="detail-label">{label}</p>
                <p className="detail-value">{value}</p>
            </div>
        );
    }