import { InputText } from "primereact/inputtext";
import React, { ChangeEvent } from "react";

interface InputTextProps {
  value: string;
  placeholder?: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  max?: number;
  disabled?: boolean;
}

const InputTextComponent: React.FC<InputTextProps> = ({
  placeholder,
  value,
  onChange,
  max,
  disabled,
}) => {
  return (
    <InputText
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="input-field"
      maxLength={max}
      disabled={disabled}
    />
  );
};

export default InputTextComponent;
