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
                <div className="form-modal-actions">
                    <button className="cancel-btn" onClick={onClose}> Cancel </button>
                    <button className="add-btn" onClick={onSubmit} disabled={loading}>{ loading ? "Processing..." : buttonText}</button>
                </div>
            </div>
        </div>
    );
}