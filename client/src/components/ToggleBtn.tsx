import React from "react";
import { ToggleButton } from 'primereact/togglebutton';
        
interface ToggleButtonProps {
  checked: boolean;
  onChange: (e: { value: boolean }) => void;
}

const InputSwitchComponent: React.FC<ToggleButtonProps> = ({
  checked,
  onChange,
}) => {
  return <ToggleButton onLabel="disallow write" offLabel="allow write" checked={checked} onChange={onChange} />;
};

export default InputSwitchComponent;
