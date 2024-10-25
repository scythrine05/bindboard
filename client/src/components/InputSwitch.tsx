import React from "react";
import { InputSwitch } from "primereact/inputswitch";

interface InputSwitchProps {
  checked: boolean;
  onChange: () => void;
}

const InputSwitchComponent: React.FC<InputSwitchProps> = ({
  checked,
  onChange,
}) => {
  return <InputSwitch checked={checked} onChange={onChange} />;
};

export default InputSwitchComponent;
