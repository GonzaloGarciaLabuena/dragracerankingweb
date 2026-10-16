"use client";

import styles from "./AdminErrorModal.module.css";

function serializeError(error, depth = 0) {
  if (error == null) {
    return error;
  }

  if (depth > 5) {
    return "[Maximum error depth reached]";
  }

  if (error instanceof Error) {
    return {
      name: error.name,
      message: error.message,
      stack: error.stack,
      cause:
        error.cause !== undefined
          ? serializeError(error.cause, depth + 1)
          : undefined,
    };
  }

  if (Array.isArray(error)) {
    return error.map((item) =>
      serializeError(item, depth + 1),
    );
  }

  if (typeof error === "object") {
    return Object.fromEntries(
      Object.entries(error).map(([key, value]) => [
        key,
        serializeError(value, depth + 1),
      ]),
    );
  }

  return error;
}

export default function AdminErrorModal({ error, onClose }) {
  if (!error) return null;

  const errorText = JSON.stringify(
    serializeError(error),
    null,
    2,
  );

  return (
    <div className={styles.overlay}>
      <div
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        aria-labelledby="admin-error-title"
      >
        <div className={styles.header}>
          <h2 id="admin-error-title">
            Error en operación administrativa
          </h2>

          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar"
          >
            ×
          </button>
        </div>

        <p>
          La operación ha fallado. A continuación se muestran
          los detalles técnicos del error.
        </p>

        <pre className={styles.errorDetails}>
          {errorText}
        </pre>

        <div className={styles.actions}>
          <button
            type="button"
            onClick={() => {
              navigator.clipboard.writeText(errorText);
            }}
          >
            Copiar error completo
          </button>

          <button type="button" onClick={onClose}>
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}