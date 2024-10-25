import React from "react";

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
  return (
    <div className="toolbar">
      <label>
        Brush Thickness:
        <input
          type="range"
          min="1"
          max="20"
          defaultValue="5"
          onChange={(e) => setThickness(Number(e.target.value))}
        />
      </label>
      <label>
        Brush Color:
        <input
          type="color"
          defaultValue="#000000"
          onChange={(e) => setColor(e.target.value)}
        />
      </label>
      <label>
        <button onClick={() => setTool("pencil")}>Pencil</button>
      </label>
      <label>
        <button onClick={() => setTool("eraser")}>Eraser</button>
      </label>
    </div>
  );
};

export default Toolbar;
