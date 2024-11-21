import React from "react";
import Thick1 from "./custom_icons/1.svg";
import Thick2 from "./custom_icons/2.svg";
import Thick3 from "./custom_icons/3.svg";

//React Icons
import { HiPencil } from "react-icons/hi2";
import { BsEraserFill } from "react-icons/bs";
import { FaUser, FaPlus } from "react-icons/fa6";
import { MdErrorOutline, MdOutlineExitToApp } from "react-icons/md";
import { VscError } from "react-icons/vsc";
import { FaGithub, FaStar  } from "react-icons/fa";
import { GrClear } from "react-icons/gr";
import { RiPencilFill } from "react-icons/ri";
import { LuShare } from "react-icons/lu";

interface IconProps {
  style?: React.CSSProperties;
}

export const NoteIcon: React.FC<IconProps> = ({ style }) => {
  return <MdErrorOutline style={style} />;
};

export const ErrorIcon: React.FC<IconProps> = ({ style }) => {
  return <VscError style={style} />;
};

export const CreateIcon: React.FC<IconProps> = ({ style }) => {
  return <FaPlus style={style} />;
};

export const GithubIcon: React.FC<IconProps> = ({ style }) => {
  return <FaGithub style={style} />;
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

export const ExitIcon: React.FC<IconProps> = ({ style }) => {
  return <MdOutlineExitToApp style={style} />;
};

export const UserIcon: React.FC<IconProps> = ({ style }) => {
  return <FaUser style={style} />;
};

export const ClearIcon: React.FC<IconProps> = ({ style }) => {
  return <GrClear style={style} />;
};

export const OwnerIcon: React.FC<IconProps> = ({ style }) => {
  return <FaStar style={style} />;
};


export const WriterIcon: React.FC<IconProps> = ({ style }) => {
  return <RiPencilFill style={style} />;
};

export const ShareIcon: React.FC<IconProps> = ({ style }) => {
  return <LuShare style={style} />;
};
