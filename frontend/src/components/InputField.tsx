/**
 * InputField is a React component that renders an input field with a label.
 * The component accepts three properties: value, label and onChange.
 * The value property is the current value of the input field.
 * The label property is the text displayed above the input field.
 * The onChange property is a function that is called whenever the user
 * changes the value of the input field.
 */
import "./InputField.css";

/**
 * Properties for the InputField component.
 */
interface InputFieldProps {
  placeholder?: string;
  value: string;
  label: string;
  onChange: (value: string) => void;
}

/**
 * Renders an input field with a label.
 * @param props - The properties of the InputField component.
 * @returns A JSX element representing the rendered input field.
 */
export function InputField(props: InputFieldProps) {
  const { placeholder = undefined, value, label, onChange } = props;

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
            onChange(event.target.value);
          }}
        />
        <div className="inputFieldUnderscore" />
      </div>
    </div>
  );
}

