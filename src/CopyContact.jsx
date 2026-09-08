import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

export function CopyContact({ value, messages }) {
  const [status, setStatus] = useState("idle");
  const pending = useRef(false);
  const attempt = useRef(0);
  const resetTimer = useRef(null);
  const buttonRef = useRef(null);

  useEffect(() => () => {
    attempt.current += 1;
    window.clearTimeout(resetTimer.current);
  }, []);

  const dismiss = () => {
    window.clearTimeout(resetTimer.current);
    setStatus("idle");
    buttonRef.current?.focus({ preventScroll: true });
  };

  const copy = async () => {
    if (pending.current) return;
    pending.current = true;
    const currentAttempt = ++attempt.current;
    window.clearTimeout(resetTimer.current);
    setStatus("copying");
    try {
      if (typeof navigator.clipboard?.writeText !== "function") throw new Error("Clipboard unavailable");
      await navigator.clipboard.writeText(value);
      if (currentAttempt !== attempt.current) return;
      setStatus("success");
      resetTimer.current = window.setTimeout(() => setStatus("idle"), 3500);
    } catch {
      if (currentAttempt === attempt.current) setStatus("error");
    } finally {
      if (currentAttempt === attempt.current) pending.current = false;
    }
  };

  const action = { idle: messages.copyAction, copying: messages.copyPending, success: messages.copyDone, error: messages.copyRetry }[status];
  const feedback = { idle: "", copying: messages.copyPendingMessage, success: messages.copySuccess, error: messages.copyError }[status];

  return (
    <>
      <button ref={buttonRef} type="button" className="contact-item copy-contact" data-copy-state={status} onClick={copy} disabled={status === "copying"} aria-busy={status === "copying"}>
        <span className="contact-label">{messages.wechatLabel}</span>
        <strong className="copy-contact-value">{value}</strong>
        <span className="contact-action copy-contact-action">{status === "success" && <span aria-hidden="true">✓ </span>}{action}</span>
      </button>
      {createPortal(
        <div className="copy-toast" data-copy-state={status}>
          <span className="copy-toast-icon" aria-hidden="true">{status === "success" ? "✓" : status === "error" ? "!" : "…"}</span>
          <span role="status" aria-label={messages.copyStatus} aria-live="polite" aria-atomic="true">{feedback}</span>
          {(status === "success" || status === "error") && <button type="button" className="copy-toast-close" aria-label={messages.copyDismiss} onClick={dismiss}>×</button>}
        </div>,
        document.body,
      )}
    </>
  );
}
