interface AlertModalProps {
  open: boolean;
  title?: string;
  message: string;
  variant?: 'success' | 'error' | 'info';
  onClose: () => void;
}

export default function AlertModal({
  open,
  title = '알림',
  message,
  variant = 'info',
  onClose,
}: AlertModalProps) {
  if (!open) return null;

  const colorMap = {
    success: 'text-emerald-400',
    error: 'text-red-400',
    info: 'text-accent-light',
  };
  const iconMap = {
    success: 'check_circle',
    error: 'error',
    info: 'info',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative bg-bg-secondary border border-border-color rounded-2xl shadow-2xl w-full max-w-sm mx-4 overflow-hidden">
        <div className="px-6 pt-6 pb-5 text-center">
          <span className={`material-symbols-outlined text-4xl mb-3 block ${colorMap[variant]}`}>
            {iconMap[variant]}
          </span>
          <h3 className="text-lg font-semibold mb-2">{title}</h3>
          <p className="text-sm text-[#9ca3b8] leading-relaxed">{message}</p>
        </div>
        <div className="flex justify-center px-6 pb-5">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-accent text-white rounded-lg text-sm font-semibold hover:bg-[#7c6ff7] transition-all"
          >
            확인
          </button>
        </div>
      </div>
    </div>
  );
}
