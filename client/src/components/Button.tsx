import React from "react";
import { Button } from "primereact/button";

interface ButtonProps {
  content: React.ReactNode; // Can be a string, JSX element, etc.
  type?: "submit" | "reset" | "button";
  onClick?: () => void;
  className?: string;
}

interface ColorButtonProps extends Omit<ButtonProps, "content"> {
  color: string;
}

interface OptionButtonProps extends ButtonProps {
  style?: React.CSSProperties;
}

export const PrimaryBtn: React.FC<ButtonProps> = ({
  content,
  type,
  onClick,
  ...props
}) => {
  return (
    <Button
      severity="success"
      onClick={onClick}
      type={type}
      {...props}
    >
      {content}
    </Button>
  );
};

export const SecondaryBtn: React.FC<ButtonProps> = ({
  content,
  type,
  onClick,
  ...props
}) => {
  return (
    <Button
      severity="secondary"
      onClick={onClick}
      type={type}
      {...props}
    >
      {content}
    </Button>
  );
};

export const ToolbarBtn: React.FC<ButtonProps> = ({
  content,
  type,
  onClick,
  className,
  ...props
}) => {
  return (
    <Button
      onClick={onClick}
      type={type}
      {...props}
      className={`toolbar-btn ${className}`.trim()} // Ensure toolbar-btn is always present
      text
    >
      {content}
    </Button>
  );
};

export const ToolbarColorBtn: React.FC<ColorButtonProps> = ({
  color,
  type,
  onClick,
  className,
  ...props
}) => {
  return (
    <Button
      onClick={onClick}
      type={type}
      {...props}
      className={`toolbar-color-btn ${className}`.trim()} // Ensure toolbar-color-btn is always present
    >
      <div style={{ backgroundColor: color }} />
    </Button>
  );
};

export const OptionsBtn: React.FC<OptionButtonProps> = ({
  content,
  type,
  onClick,
  style,
  ...props
}) => {
  return (
    <Button
      onClick={onClick}
      type={type}
      {...props}
      className="options-btn"
      style={style}
    >
      {content}
    </Button>
  );
};
