import {
  Fragment,
  useCallback,
  useEffect,
  useState,
  type ComponentPropsWithRef,
} from "react";
import { Modal } from "./Modal";

type FormModalProps = {
  title: string;
  forms: Array<
    Omit<ComponentPropsWithRef<"input">, "value" | "onChange"> & {
      key: string;
      label: string;
      validate?: (
        value: string
      ) => { isValid: true } | { isValid: false; errorMessage: string };
    }
  >;
  onClose: () => void;
  onSubmit: (formValues: Record<string, string>) => void;
};

export function FormModal({ title, forms, onSubmit, onClose }: FormModalProps) {
  const [formValues, setFormValues] = useState<Record<string, string>>(
    Object.fromEntries(forms.map((form) => [form.key, ""]))
  );
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = useCallback(() => {
    const validationResults = forms.map((form) => {
      const validateResult = form.validate?.(formValues[form.key]) ?? {
        isValid: true,
      };

      if (validateResult.isValid) {
        return {
          isValid: true,
        };
      }

      return {
        key: form.key,
        isValid: false,
        errorMessage: validateResult.errorMessage,
      };
    });

    if (!validationResults.every((result) => result.isValid)) {
      setErrors(
        Object.fromEntries(
          validationResults.map((result) => [result.key, result.errorMessage])
        )
      );
      alert("입력값을 확인해주세요");
      return;
    }

    onSubmit(formValues);
  }, [formValues, onSubmit]);

  useEffect(() => {
    const controller = new AbortController();

    window.addEventListener(
      "keydown",
      (e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          e.stopPropagation();
          handleSubmit();
        }
      },
      { signal: controller.signal }
    );

    return () => {
      controller.abort();
    };
  }, [handleSubmit]);

  return (
    <Modal onClose={onClose} title={title}>
      {forms.map(({ className, ...form }) => (
        <Fragment key={form.key}>
          <label htmlFor={form.key}>{form.label}</label>
          <input
            {...form}
            id={form.key}
            value={formValues[form.key] ?? ""}
            className={[className, errors[form.key] ? "border-red-500" : null]
              .filter((token) => token !== null)
              .join(" ")}
            onChange={(e) => {
              const validateResult = form.validate?.(e.target.value) ?? {
                isValid: true,
              };

              if (!validateResult.isValid) {
                setErrors((prev) => ({
                  ...prev,
                  [form.key]: validateResult.errorMessage,
                }));
              } else {
                setErrors((prev) => {
                  const { [form.key]: _, ...rest } = prev;
                  return rest;
                });
              }

              setFormValues((prev) => ({
                ...prev,
                [form.key]: e.target.value,
              }));
            }}
          />
          {errors[form.key] && (
            <p className="text-red-500" tabIndex={0}>
              {errors[form.key]}
            </p>
          )}
        </Fragment>
      ))}
      <button
        onClick={() => {
          handleSubmit();
        }}
      >
        제출
      </button>
    </Modal>
  );
}
