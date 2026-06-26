import "../../style/Admin.css";

export default function ViewModal({
    title,
    children,
    onClose,
    onEdit,
    onDelete
}) {
    return (
        <div className="modal-overlay">
            <div className="modal-box">
                <button className="close-btn" onClick={onClose}>X</button>
                <h2 className="modal-title">{title}</h2>
                <div className="modal-grid">{children}</div>
                <div className="confirm-modal-actions">
                    <button className="payment-delete-btn" onClick={onDelete}>Delete</button>
                </div>
            </div>

        </div>
    );
}