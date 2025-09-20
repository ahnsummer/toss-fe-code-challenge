import type { ComponentPropsWithoutRef } from "react";
import type { FormBase } from "./Forms.type";

export type SelectProps = Omit<ComponentPropsWithoutRef<"select">, "type"> & {
  type: "select";
  inputType?: undefined;
  options: Array<{ label: string; value: string }>;
} & FormBase;

export function Select({
  options,
  value,
  errorMessage,
  className,
  ...form
}: SelectProps) {
  

  return (
    <select
      {...form}
      value={String(value) ?? ""}
      className={[
        className,
        "p-2 border border-gray-300 rounded-md",
        errorMessage != null ? "border-red-500" : null,
      ]
        .filter((token) => token !== null)
        .join(" ")}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}
