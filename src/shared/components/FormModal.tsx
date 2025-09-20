import {
  useCallback,
  useEffect,
  useState,
  type ComponentPropsWithoutRef,
} from "react";
import { Modal } from "./Modal";

type FormBase = {
  key: string;
  label: string;
  validate?: (
    value: string
  ) => { isValid: true } | { isValid: false; errorMessage: string };
};

type InputForm = Omit<
  ComponentPropsWithoutRef<"input">,
  "type" | "value" | "onChange"
> & {
  type?: "input";
  inputType: ComponentPropsWithoutRef<"input">["type"];
} & FormBase;
type SelectForm = Omit<
  ComponentPropsWithoutRef<"select">,
  "type" | "value" | "onChange"
> & {
  type: "select";
  inputType?: undefined;
  options: Array<{ label: string; value: string }>;
} & FormBase;

type Form = InputForm | SelectForm;

type FormModalProps = {
  title: string;
  forms: Array<Form>;
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
      {forms.map(({ key, label, validate, className, inputType, ...form }) => (
        <div key={key} className="flex flex-col gap-1">
          <label htmlFor={key} className="text-base font-semibold">
            {label}
          </label>

          {form.type === "select" ? (
            <select
              {...form}
              id={key}
              value={formValues[key] ?? ""}
              className={[
                className,
                "p-2 border border-gray-300 rounded-md",
                errors[key] ? "border-red-500" : null,
              ]
                .filter((token) => token !== null)
                .join(" ")}
              onChange={(e) => {
                const validateResult = validate?.(e.target.value) ?? {
                  isValid: true,
                };

                if (!validateResult.isValid) {
                  setErrors((prev) => ({
                    ...prev,
                    [key]: validateResult.errorMessage,
                  }));
                } else {
                  setErrors((prev) => {
                    const { [key]: _, ...rest } = prev;
                    return rest;
                  });
                }

                setFormValues((prev) => ({
                  ...prev,
                  [key]: e.target.value,
                }));
              }}
            >
              {form.options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          ) : (
            <input
              {...form}
              id={key}
              type={inputType}
              value={formValues[key] ?? ""}
              className={[
                className,
                "p-2 border border-gray-300 rounded-md",
                errors[key] ? "border-red-500" : null,
              ]
                .filter((token) => token !== null)
                .join(" ")}
              onChange={(e) => {
                const validateResult = validate?.(e.target.value) ?? {
                  isValid: true,
                };

                if (!validateResult.isValid) {
                  setErrors((prev) => ({
                    ...prev,
                    [key]: validateResult.errorMessage,
                  }));
                } else {
                  setErrors((prev) => {
                    const { [key]: _, ...rest } = prev;
                    return rest;
                  });
                }

                setFormValues((prev) => ({
                  ...prev,
                  [key]: e.target.value,
                }));
              }}
            />
          )}
          {errors[key] && (
            <p className="text-red-500" tabIndex={0}>
              {errors[key]}
            </p>
          )}
        </div>
      ))}
      <button
        onClick={() => {
          handleSubmit();
        }}
        className="bg-blue-500 text-white p-2 rounded-md"
      >
        제출
      </button>
    </Modal>
  );
}
