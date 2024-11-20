import React from "react";
import { Dialog } from "primereact/dialog";

interface ModalProps {
  visible: boolean;
  onHide: () => void;
  children?: React.ReactNode;
  header: string;
}

const Modal: React.FC<ModalProps> = ({ header, visible, onHide, children }) => {
  return (
    <div>
      <Dialog
        draggable={false}
        header={header}
        visible={visible}
        onHide={onHide}
        closable={false}
      >
        {children}
      </Dialog>
    </div>
  );
};

export default Modal;
