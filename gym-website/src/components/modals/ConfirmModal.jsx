import "../../style/Admin.css";

export default function ConfirmModal({
    title,
    description,
    onClose,
    onConfirm,
    loading
}) {
    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="confirm-modal-box" onClick={(e) => e.stopPropagation()}>
                <h2 className="confirm-modal-title">{title}</h2>
                <p className="confirm-modal-desc">{description}</p>
                <div className="confirm-modal-actions">
                    <button className="confirm-btn-cancel" onClick={onClose}>Cancel</button>
                    <button className="confirm-btn-danger" onClick={onConfirm} disabled={loading}>{loading ? "Processing..." : "Confirm"}</button>
                </div>
            </div>
        </div>
    );
}