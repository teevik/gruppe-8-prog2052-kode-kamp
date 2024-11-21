import "./Button.css";

import { ReactNode } from "react";

interface ButtonProps {
  children: ReactNode;
  onClick: () => void;
  variant?: "primary" | "secondary" | "tertiary" | "danger";
  //TODO: implement disabled behavior
  disabled?: boolean;
}

export function Button(props: ButtonProps) {
  const { variant = "primary", onClick, children } = props;

  return (
    <button
      className={`button ${variant}`}
      onClick={
        variant === "danger"
          ? () => {
              if (
                window.confirm("Er du sikker på at du vil slette brukeren?")
              ) {
                onClick();
              }
            }
          : onClick
      }
    >
      {children}
    </button>
  );
}
