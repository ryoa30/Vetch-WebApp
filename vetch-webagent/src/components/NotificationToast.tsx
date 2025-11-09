export function ToastPopup({
  open,
  onClose,
  onConfirm,
  title = "Enable notifications?",
  description = "Get important updates.",
  confirmText = "Enable",
  cancelText = "Dismiss",
  className = "",
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  className?: string;
}) {
  if (!open) return null;

  return (
    <div className="pointer-events-none fixed left-3 top-3 z-[70] flex max-w-sm flex-col gap-2">
      <div
        className={`pointer-events-auto w-full overflow-hidden rounded-xl border border-black/10 bg-white p-3 shadow-xl dark:border-white/10 dark:bg-neutral-900 ${className}`}
        role="alertdialog"
        aria-labelledby="toast-title"
        aria-describedby="toast-desc"
      >
        <div className="flex items-start gap-2">
          <div className="mt-0.5 shrink-0 rounded-lg border border-black/10 p-1.5 text-neutral-700 dark:border-white/10 dark:text-neutral-200">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="h-4 w-4"
            >
              <path d="M12 2a6 6 0 00-6 6v2.586l-.707.707A1 1 0 006 14h12a1 1 0 00.707-1.707L18 10.586V8a6 6 0 00-6-6zm0 20a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
            </svg>
          </div>
          <div className="min-w-0 flex-1">
            <p
              id="toast-title"
              className="truncate text-sm font-semibold text-neutral-900 dark:text-white"
            >
              {title}
            </p>
            <p
              id="toast-desc"
              className="mt-0.5 line-clamp-3 text-xs text-neutral-600 dark:text-neutral-300"
            >
              {description}
            </p>
            <div className="mt-2 flex gap-2">
              <button
                onClick={onConfirm}
                className="rounded-lg px-2.5 py-1.5 text-xs font-medium text-black dark:text-white hover:bg-black hover:text-white duration-200 dark:hover:bg-white dark:hover:text-black"
              >
                {confirmText}
              </button>
              <button
                onClick={onClose}
                className="rounded-lg px-2.5 py-1.5 text-xs font-medium text-neutral-700 hover:bg-red-500 hover:text-white duration-200 dark:text-neutral-300 dark:hover:bg-red-600"
              >
                {cancelText}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
