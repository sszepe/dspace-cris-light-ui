import React from "react";

export type ButtonVariant = "default" | "back" | "primary";

export function Button({
  className,
  variant = "default",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
}) {
  const variantClass =
    variant === "back"
      ? "btn-back"
      : variant === "primary"
        ? "btn-primary"
        : "";

  return (
    <button
      {...props}
      className={["btn", variantClass, className].filter(Boolean).join(" ")}
    />
  );
}
