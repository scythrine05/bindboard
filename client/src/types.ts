// src/types/types.ts
export interface WriteData {
  x: number;
  y: number;
  prevX: number;
  prevY: number;
  color: string; // Add color to the drawing data
  thickness: number; // Add thickness to the drawing data
  compositeOperation: GlobalCompositeOperation;
}

export interface UserDataTypes {
  userId: string;
  displayName: string | null;
}
