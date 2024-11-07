import "./InputField.css"

interface InputFieldProps {
  placeholder?: string,
  value: string,
  label: string,
  onChange: (value: string) => void,
}

export function InputField(props: InputFieldProps) {
  const {
    placeholder = undefined,
    value,
    label,
    onChange,
  } = props;

  return (
    <div className="inputFieldWrapperWrapper">
      <label className="inputFieldLabel">{label}</label>
      <div className="inputFieldWrapper">
        <input
          className="inputField"
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={(event) => {
            onChange(event.target.value)
          }}
        />
        <div className="inputFieldUnderscore" />
      </div>
    </div>
  )
}
