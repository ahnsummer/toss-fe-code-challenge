import type { ComponentPropsWithoutRef } from "react";

type ButtonProps = ComponentPropsWithoutRef<"button">;

export function Button({ children, ...props }: ButtonProps) {
  return (
    <button className="bg-blue-500 text-white p-2 rounded-md" {...props}>
      {children}
    </button>
  );
}
