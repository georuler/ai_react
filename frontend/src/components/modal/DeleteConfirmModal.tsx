interface DeleteConfirmModalProps {
  open: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'info';
  onConfirm: () => void;
  onClose: () => void;
}

export default function DeleteConfirmModal({
  open,
  title,
  message,
  confirmText = '확인',
  cancelText = '취소',
  variant = 'info',
  onConfirm,
  onClose,
}: DeleteConfirmModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative bg-bg-secondary border border-border-color rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
        <div className="px-6 pt-6 pb-4">
          <div className="flex items-center gap-3">
            <span className={`material-symbols-outlined text-2xl ${variant === 'danger' ? 'text-red-400' : 'text-accent-light'}`}>
              {variant === 'danger' ? 'warning' : 'info'}
            </span>
            <h3 className="text-lg font-semibold">{title}</h3>
          </div>
          <p className="mt-3 text-sm text-[#9ca3b8] leading-relaxed">{message}</p>
        </div>
        <div className="flex justify-end gap-2 px-6 pb-5">
          {cancelText && (
            <button onClick={onClose} className="px-4 py-2 bg-bg-tertiary border border-border-color text-[#9ca3b8] rounded-lg text-sm font-medium hover:bg-bg-hover hover:text-[#e8eaf0] transition-all">
              {cancelText}
            </button>
          )}
          <button onClick={onConfirm} className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${variant === 'danger' ? 'bg-red-500 text-white hover:bg-red-600' : 'bg-accent text-white hover:bg-[#7c6ff7]'}`}>
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
