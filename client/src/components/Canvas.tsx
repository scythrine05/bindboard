import React, { useEffect, useRef, useState } from "react";
import { Socket } from "socket.io-client";
import { WriteData } from "../types";
import { useParams } from "react-router-dom";
import { getOrCreateUserData } from "../utils";

interface CanvasProps {
  socket: Socket;
  color: string;
  thickness: number;
  tool: string;
  isOwner: boolean;
  isWriter: boolean;
}

type ExtendedCanvasRenderingContext2D = CanvasRenderingContext2D & {
  prevX?: number;
  prevY?: number;
};

const Canvas: React.FC<CanvasProps> = ({
  socket,
  color,
  thickness,
  tool,
  isOwner,
  isWriter,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);
  const [writing, setWriting] = useState(false);
  const { roomId } = useParams();
  const userData = getOrCreateUserData();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const context = canvas.getContext("2d");
    if (!context) return;

    context.lineCap = "round";
    contextRef.current = context;
    socket.on("load-data", (writeData: WriteData[]) => {
      writeData.forEach((data) => {
        writeOnCanvas(data);
      });
    });

    socket.on("write", (writeData) => {
      writeOnCanvas(writeData);
    });

    socket.on("clear-canvas", () => {
      contextRef.current?.clearRect(0, 0, canvas.width, canvas.height);
    });

    return () => {
      socket.off("write");
      socket.off("load-data");
      socket.off("clear-canvas");
    };
  }, [socket]);

  // Write on the canvas using the write data received
  const writeOnCanvas = (data: WriteData) => {
    if (!contextRef.current) return;
    const { x, y, prevX, prevY, color, thickness, compositeOperation } = data;
    contextRef.current.strokeStyle =
      color === "erase" ? "rgba(0,0,0,1)" : color;
    contextRef.current.globalCompositeOperation = compositeOperation;
    contextRef.current.lineWidth = thickness;
    contextRef.current.beginPath();
    contextRef.current.moveTo(prevX, prevY); // Start from previous position
    contextRef.current.lineTo(x, y); // Write line to the new position
    contextRef.current.stroke();
  };

  const startWriting = (event: React.MouseEvent) => {
    const { offsetX, offsetY } = event.nativeEvent;
    contextRef.current?.beginPath();
    contextRef.current?.moveTo(offsetX, offsetY);
    setWriting(true);
  };

  const write = (event: React.MouseEvent) => {
    if (!isOwner && !isWriter) {
      // Exit early if the user is not the owner
      return;
    }

    if (!writing || !contextRef.current) return;

    const { offsetX, offsetY } = event.nativeEvent;
    const context = contextRef.current as ExtendedCanvasRenderingContext2D;

    if (context) {
      if (tool === "eraser") {
        context.globalCompositeOperation = "destination-out";
        context.strokeStyle = "rgba(0,0,0,1)";
      } else {
        context.globalCompositeOperation = "source-over";
        context.strokeStyle = color;
      }
      context.lineTo(offsetX, offsetY);
      context.stroke();
    }

    const newX = offsetX;
    const newY = offsetY;
    const prevX = context.prevX ?? newX; // If prevX doesn't exist, use newX
    const prevY = context.prevY ?? newY;
    const compositeOperation = context.globalCompositeOperation;

    const writeData = {
      x: newX,
      y: newY,
      prevX: prevX,
      prevY: prevY,
      color: tool === "eraser" ? "erase" : color,
      thickness,
      compositeOperation,
    };
    socket.emit("write", { roomId, writeData, userData }); // Emit write event to server
    writeOnCanvas(writeData); // Write locally on the canvas

    // Store previous points for smoother writing
    context.prevX = newX;
    context.prevY = newY;
  };

  const stopWriting = () => {
    if (!writing) return;
    setWriting(false);
    const context = contextRef.current as ExtendedCanvasRenderingContext2D;
    context.prevX = undefined; // Reset prevX
    context.prevY = undefined; // Reset prevY
    context.closePath();
    socket.emit("stop-write-user", { roomId });
  };

  return (
    <canvas
      ref={canvasRef}
      onMouseDown={startWriting}
      onMouseMove={write}
      onMouseUp={stopWriting}
      onMouseLeave={stopWriting}
      onMouseOut={stopWriting}
    />
  );
};

export default Canvas;
