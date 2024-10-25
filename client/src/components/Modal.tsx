import React from "react";
import { Dialog } from "primereact/dialog";

interface ModalProps {
  visible: boolean;
  onHide: () => void;
  children?: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ visible, onHide, children }) => {
  return (
    <div>
      <Dialog header="Header" visible={visible} onHide={onHide} closable={false}>
        {children}
      </Dialog>
    </div>
  );
};

export default Modal;
