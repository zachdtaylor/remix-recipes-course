import React from "react";
import { classNames } from "~/utils/misc";

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
      className={classNames(
        "text-white bg-primary hover:bg-primary-light",
        className
      )}
    />
  );
}
