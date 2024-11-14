import "./Button.css";

import { ReactNode } from "react";

interface ButtonProps {
  children: ReactNode;
  onClick: () => void;
  variant?: "primary" | "secondary" | "tertiary";
  //TODO: implement disabled behavior
  disabled?: boolean;
}

export function Button(props: ButtonProps) {
  const { variant = "primary", children } = props;

  return <button className={`button ${variant}`}>{children}</button>;
}
