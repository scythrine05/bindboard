import React from "react";
import Thick1 from "./custom_icons/1.svg";
import Thick2 from "./custom_icons/2.svg";
import Thick3 from "./custom_icons/3.svg";

//React Icons
import { HiPencil } from "react-icons/hi2";
import { BsEraserFill } from "react-icons/bs";
import { FaPlus } from "react-icons/fa6";

interface IconProps {
  style?: React.CSSProperties;
}
export const NoteIcon: React.FC<IconProps> = ({ style }) => {
  return <i className="pi pi-exclamation-circle" style={{ ...style }}></i>;
};

export const ErrorIcon: React.FC<IconProps> = ({ style }) => {
  return <i className="pi pi-exclamation-triangle" style={{ ...style }}></i>;
};

export const CreateIcon: React.FC<IconProps> = ({ style }) => {
  return <FaPlus style={style} />;
};

export const GithubIcon: React.FC<IconProps> = ({ style }) => {
  return <i className="pi pi-github" style={{ ...style }}></i>;
};

export const LineIcon: React.FC<IconProps> = ({ style }) => {
  return <i className="pi pi-minus" style={{ ...style }}></i>;
};

export const PencilIcon: React.FC<IconProps> = ({ style }) => {
  return <HiPencil style={style} />;
};

export const EraserIcon: React.FC<IconProps> = ({ style }) => {
  return <BsEraserFill style={style} />;
};

export const ThickIcon1: React.FC<IconProps> = ({ style }) => {
  return <img src={Thick1} style={style} />;
};

export const ThickIcon2: React.FC<IconProps> = ({ style }) => {
  return <img src={Thick2} style={style} />;
};

export const ThickIcon3: React.FC<IconProps> = ({ style }) => {
  return <img src={Thick3} style={style} />;
};
