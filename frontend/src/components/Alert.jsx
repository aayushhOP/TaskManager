export default function Alert({ type = 'error', message, onDismiss }) {
  if (!message) return null;

  return (
    <div className={`alert alert-${type} animate-alert-in`} role="alert">
      <span className="alert-icon" aria-hidden="true">!</span>
      <span className="alert-message">{message}</span>
      {onDismiss && (
        <button type="button" className="alert-dismiss" onClick={onDismiss} aria-label="Dismiss">
          ×
        </button>
      )}
    </div>
  );
}
