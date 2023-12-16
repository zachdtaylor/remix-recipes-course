import classNames from "classnames";
import React from "react";

type ButtonProps = {
  children: React.ReactNode;
  className?: string;
};
export function Button({ children, className }: ButtonProps) {
  return (
    <button
      className={classNames(
        "flex px-3 py-2 rounded-md justify-center",
        className
      )}
    >
      {children}
    </button>
  );
}

export function PrimaryButton({ className, ...props }: ButtonProps) {
  return (
    <Button
      {...props}
      className={classNames("bg-primary text-white", className)}
    />
  );
}
