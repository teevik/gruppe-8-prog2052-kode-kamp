import "./Button.css"

interface ButtonProps {
  label: string,
  onClick: () => void,
  variant: "primary" | "secondary" | "tertiary"
}

export function Button(props: ButtonProps) {
  const { variant } = props;
  return (
    <button className={`button ${variant}`} >
      {props.label}
    </button >
  )
}




