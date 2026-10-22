// frontend/src/components/admin/ConfirmModal.tsx

interface ConfirmModalProps {
  title?: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

function ConfirmModal({ title, message, onConfirm, onCancel }: ConfirmModalProps) {
return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-primary/50 p-4"
      onClick={onCancel}
    >
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-modal-title"
        aria-describedby="confirm-modal-message"
        className="w-full max-w-md rounded-2xl border border-primary/10 bg-surface p-6 text-primary shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-5">
          <h2
            id="confirm-modal-title"
            className="text-xl font-bold"
          >
            {title}
          </h2>

          <p
            id="confirm-modal-message"
            className="mt-2 text-sm leading-relaxed opacity-80"
          >
            {message}
          </p>
        </div>

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg border border-primary/20 px-4 py-2.5 font-medium transition hover:bg-primary/5 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          >
            Annuler
          </button>

          <button
            type="button"
            onClick={onConfirm}
            className="rounded-lg bg-secondary px-4 py-2.5 font-semibold text-primary shadow-sm transition hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2"
          >
            Confirmer
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmModal;