import { useEffect, useRef, useId, type ReactNode } from "react";
import { useScrollLock } from "../hooks/useScrollLock";

type ModalProps = {
  onClose: () => void;
  title: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  description?: string;
};

export const Modal = ({
  onClose,
  title,
  children,
  footer,
  description,
}: ModalProps) => {
  const initialRef = useRef<boolean>(true);
  const titleId = useId();
  const descriptionId = useId();

  useScrollLock();

  useEffect(() => {
    const controller = new AbortController();

    window.addEventListener(
      "keydown",
      (e) => {
        if (e.key === "Escape") {
          onClose();
        }
      },
      {
        signal: controller.signal,
      }
    );

    return () => {
      controller.abort();
    };
  }, []);

  return (
    <div
      className="modal-overlay"
      onClickCapture={(e) => {
        if (e.target !== e.currentTarget) {
          return;
        }

        onClose();
      }}
    >
      <div
        className="modal-content"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={description ? descriptionId : undefined}
      >
        <h1
          id={titleId}
          ref={(el) => {
            if (!initialRef.current) {
              return;
            }

            initialRef.current = false;
            el?.focus();
          }}
          tabIndex={-1}
          className="modal-title"
        >
          {title}
        </h1>
        {description && (
          <p id={descriptionId} className="modal-description">
            {description}
          </p>
        )}
        <div className="modal-body">{children}</div>
        {footer && <div className="modal-footer">{footer}</div>}
      </div>
    </div>
  );
};
