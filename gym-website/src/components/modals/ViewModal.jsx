import "../../style/Admin.css";

export default function ViewModal({
    title,
    children,
    onClose
}) {
    return (
        <div className="modal-overlay">
            <div className="modal-box">
                <button className="close-btn" onClick={onClose}>X</button>
                <h2 className="modal-title">{title}</h2>
                <div className="modal-grid">{children}</div>
            </div>
        </div>
    );
}