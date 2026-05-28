import "../../style/Admin.css";

export default function FormModal({
    title,
    children,
    onClose,
    onSubmit,
    loading,
    buttonText
}) {
    return (
        <div className="modal-overlay">
            <div className="modal-box">
                <h2 className="modal-title">{title}</h2>
                <div className="modal-grid">{children}</div>
                <div className="confirm-modal-actions">
                    <button className="confirm-btn-cancel" onClick={onClose}> Cancel </button>
                    <button className="add-btn" onClick={onSubmit} disabled={loading}>{ loading ? "Processing..." : buttonText}</button>
                </div>
            </div>
        </div>
    );
}