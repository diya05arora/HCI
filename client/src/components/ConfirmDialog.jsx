function ConfirmDialog({ labels, contact, onCancel, onConfirm }) {
  if (!contact) {
    return null;
  }

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="confirm-title">
      <div className="modal-card">
        <h3 id="confirm-title">{labels.confirmCallTitle}</h3>
        <p>
          {labels.confirmCallText} <strong>{contact.name}</strong>?
        </p>
        <div className="modal-actions">
          <button className="plain-btn" onClick={onCancel}>
            {labels.cancel}
          </button>
          <button className="danger-btn" onClick={onConfirm}>
            {labels.confirm}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmDialog;
