import classNames from "classnames";
import { type ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
}

export function Button({ children, className, ...props }: ButtonProps) {
  return (
    <button
      {...props}
      className={classNames(
        "flex px-3 py-2 rounded-md justify-center",
        className
      )}
    >
      {children}
    </button>
  );
}

export function PrimaryButton({ className, isLoading, ...props }: ButtonProps) {
  return (
    <Button
      {...props}
      className={classNames(
        "bg-primary text-white",
        { "bg-primary-light": isLoading },
        className
      )}
    />
  );
}

export function DeleteButton({ className, isLoading, ...props }: ButtonProps) {
  return (
    <Button
      {...props}
      className={classNames(
        "border-2 border-red-600 text-red-600",
        "hover:bg-red-600 hover:text-white",
        { "border-red-400 text-red-400": isLoading },
        className
      )}
    />
  );
}
