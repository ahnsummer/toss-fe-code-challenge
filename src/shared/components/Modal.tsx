import { useEffect, useRef, type ReactNode } from "react";
type ModalProps = {
  onClose: () => void;
  title: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
};

export const Modal = ({ onClose, title, children, footer }: ModalProps) => {
  const initialRef = useRef<boolean>(true);

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
      className="flex justify-center items-center w-full h-full p-4 fixed inset-0 bg-black/50"
      onClickCapture={(e) => {
        if (e.target !== e.currentTarget) {
          return;
        }

        onClose();
      }}
    >
      <div className="w-full p-4 max-w-md max-h-md bg-white rounded-lg flex flex-col gap-4">
        <h1
          ref={(el) => {
            if (!initialRef.current) {
              return;
            }

            initialRef.current = false;
            el?.focus();
          }}
          tabIndex={1}
          className="text-xl font-bold"
        >
          {title}
        </h1>
        {children}
        {footer}
      </div>
    </div>
  );
};
