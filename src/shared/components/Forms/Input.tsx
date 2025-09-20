import { type ComponentPropsWithoutRef } from "react";
import type { FormBase } from "./Forms.type";

export type InputProps = Omit<ComponentPropsWithoutRef<"input">, "type"> & {
  type?: "input";
  inputType: ComponentPropsWithoutRef<"input">["type"];
} & FormBase;

export function Input({
  type,
  inputType,
  value,
  errorMessage,
  className,
  ...form
}: InputProps) {
  return (
    <>
      <input
        {...form}
        type={inputType}
        className={[
          className,
          "p-2 border border-gray-300 rounded-md",
          errorMessage != null ? "border-red-500" : null,
        ]
          .filter((token) => token !== null)
          .join(" ")}
      />
      {errorMessage != null && (
        <p className="text-red-500 text-xs">{errorMessage}</p>
      )}
    </>
  );
}
