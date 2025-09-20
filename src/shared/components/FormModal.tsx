import { useCallback, useEffect, useRef, useState } from "react";
import { Modal } from "./Modal";
import { Button } from "./Button";
import { Input, type InputProps } from "./Forms/Input";
import { Select, type SelectProps } from "./Forms/Select";

export type FormItem = (InputProps | SelectProps) & {
  key: string;
  validate?: (
    value: string
  ) => { isValid: true } | { isValid: false; errorMessage: string };
};

type FormModalProps = {
  title: string;
  forms: Array<FormItem>;
  onClose: () => void;
  onSubmit: (formValues: Record<string, string>) => void;
};

export function FormModal({ title, forms, onSubmit, onClose }: FormModalProps) {
  const [formValues, setFormValues] = useState<Record<string, string>>(
    Object.fromEntries(forms.map((form) => [form.key, ""]))
  );
  const [errors, setErrors] = useState<Record<string, string>>({});
  const errorSummaryRef = useRef<HTMLDivElement>(null);

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
      if (errorSummaryRef.current == null) {
        return;
      }

      const errorMessages = validationResults
        .filter((result) => !result.isValid)
        .map((result) => [result.key, result.errorMessage]);

      setErrors(Object.fromEntries(errorMessages));
      errorSummaryRef.current.textContent = errorMessages
        .map(
          ([key, errorMessage]) =>
            `${forms.find((form) => form.key === key)?.label}: ${errorMessage}`
        )
        .join("\n");

      errorSummaryRef.current?.focus();
      return;
    }

    onSubmit(formValues);
  }, [formValues, onSubmit]);

  const handleChange = useCallback((value: string, item: FormItem) => {
    const validateResult = forms
      .find((form) => form.key === item.key)
      ?.validate?.(value) ?? {
      isValid: true,
    };

    if (!validateResult.isValid) {
      setErrors((prev) => ({
        ...prev,
        [item.key]: String(validateResult.errorMessage),
      }));
    } else {
      setErrors((prev) => {
        const { [item.key]: _, ...rest } = prev;
        return {
          ...rest,
        };
      });
    }

    setFormValues((prev) => ({
      ...prev,
      [item.key]: value,
    }));
  }, []);

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
    <Modal
      onClose={onClose}
      title={title}
      description="이메일과 FE 경력 연차 등 간단한 정보를 입력해주세요."
    >
      {forms.map(({ key, validate, ...item }) => (
        <div key={key} className="flex flex-col gap-1">
          <label htmlFor={key} className="text-base font-semibold">
            {item.label}
          </label>

          {item.type === "select" ? (
            <Select
              {...item}
              id={key}
              errorMessage={errors[key]}
              onChange={(e) => {
                handleChange(e.target.value, { ...item, key, validate });
              }}
            />
          ) : (
            <Input
              {...item}
              id={key}
              errorMessage={errors[key]}
              onChange={(e) => {
                handleChange(e.target.value, { ...item, key, validate });
              }}
            />
          )}
        </div>
      ))}
      <div
        ref={errorSummaryRef}
        className="text-red-500 whitespace-pre-line"
        tabIndex={1}
      />
      <Button
        onClick={() => {
          handleSubmit();
        }}
      >
        제출
      </Button>
    </Modal>
  );
}
