// frontend/src/components/admin/ConfirmModal.tsx

interface ConfirmModalProps {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

function ConfirmModal({ message, onConfirm, onCancel }: ConfirmModalProps) {
  return (
    <div className="modal-overlay">
      <div className="modal-content modal-confirm">
        <p>{message}</p>
        <div className="modal-actions">
          <button onClick={onCancel}>Annuler</button>
          <button onClick={onConfirm} className="btn-danger">
            Confirmer
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmModal;