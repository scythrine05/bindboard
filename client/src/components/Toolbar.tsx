import React, { useState } from "react";
import { Divider } from "primereact/divider";

import {
  EraserIcon,
  PencilIcon,
  ThickIcon1,
  ThickIcon2,
  ThickIcon3,
} from "../assets/icons";
import { ToolbarBtn, ToolbarColorBtn } from "./Button";
import { COLORS } from "../utils/contants";

import "../styles/toolbar.style.css";

interface ToolbarProps {
  setThickness: (value: number) => void;
  setColor: (value: string) => void;
  setTool: (value: string) => void;
}

const Toolbar: React.FC<ToolbarProps> = ({
  setThickness,
  setColor,
  setTool,
}) => {
  const [activeThickness, setActiveThickness] = useState<number | null>(4);
  const [activeTool, setActiveTool] = useState<string | null>("pencil");
  const [activeColor, setActiveColor] = useState<string | null>(COLORS.BLACK);

  return (
    <div className="toolbar">
      <label>
        <ToolbarBtn
          onClick={() => {
            setThickness(4);
            setActiveThickness(4);
          }}
          content={<ThickIcon1 style={{ width: "25px", height: "25px" }} />}
          className={activeThickness === 4 ? "toolbar-active-btn" : ""}
        />
      </label>
      <label>
        <ToolbarBtn
          onClick={() => {
            setThickness(8);
            setActiveThickness(8);
          }}
          content={<ThickIcon2 style={{ width: "25px", height: "25px" }} />}
          className={activeThickness === 8 ? "toolbar-active-btn" : ""}
        />
      </label>
      <label>
        <ToolbarBtn
          onClick={() => {
            setThickness(12);
            setActiveThickness(12);
          }}
          content={<ThickIcon3 style={{ width: "25px", height: "25px" }} />}
          className={activeThickness === 12 ? "toolbar-active-btn" : ""}
        />
      </label>
      <Divider className="toolbar-divider" layout="vertical" />
      <Divider className="toolbar-divider-horizontal" layout="horizontal" />
      <label>
        <ToolbarBtn
          onClick={() => {
            setTool("pencil");
            setActiveTool("pencil");
          }}
          content={
            <PencilIcon
              style={{ width: "25px", height: "25px", color: "#000" }}
            />
          }
          className={activeTool === "pencil" ? "toolbar-active-btn" : ""}
        />
      </label>
      <label>
        <ToolbarBtn
          onClick={() => {
            setTool("eraser");
            setActiveTool("eraser");
          }}
          content={
            <EraserIcon
              style={{ width: "25px", height: "25px", color: "#000" }}
            />
          }
          className={activeTool === "eraser" ? "toolbar-active-btn" : ""}
        />
      </label>
      <Divider className="toolbar-divider" layout="vertical" />
      <Divider className="toolbar-divider-horizontal" layout="horizontal" />
      <label>
        {Object.values(COLORS).map((color) => (
          <ToolbarColorBtn
            key={color}
            color={color}
            onClick={() => {
              setColor(color);
              setActiveColor(color);
            }}
            className={activeColor === color ? "toolbar-active-color-btn" : ""}
          />
        ))}
      </label>
    </div>
  );
};

export default Toolbar;
