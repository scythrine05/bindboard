import { InputText } from "primereact/inputtext";
import React, { ChangeEvent } from "react";

interface InputTextProps {
  value: string;
  placeholder: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

const InputTextComponent: React.FC<InputTextProps> = ({
  placeholder,
  value,
  onChange,
}) => {
  return (
    <InputText placeholder={placeholder} value={value} onChange={onChange} className="input-field" />
  );
};

export default InputTextComponent;