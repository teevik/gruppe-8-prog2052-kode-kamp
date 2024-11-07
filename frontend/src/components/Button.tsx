import "./Button.css"

interface ButtonProps {
  children: string,
  onClick: () => void,
  variant: "primary" | "secondary" | "tertiary"
}

export function Button(props: ButtonProps) {
  const { variant, children } = props;

  return (
    <button className={`button ${variant}`} >
      {children}
    </button >
  )
}




