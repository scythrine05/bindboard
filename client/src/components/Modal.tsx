import React from "react";
import { Dialog } from "primereact/dialog";

interface ModalProps {
  visible: boolean;
  onHide: () => void;
  children?: React.ReactNode;
  header: string;
  dismissableMask?: boolean;
}

const Modal: React.FC<ModalProps> = ({
  header,
  visible,
  onHide,
  dismissableMask,
  children,
}) => {
  return (
    <div>
      <Dialog
        draggable={false}
        header={header}
        visible={visible}
        onHide={onHide}
        closable={false}
        dismissableMask={dismissableMask}
      >
        {children}
      </Dialog>
    </div>
  );
};

export default Modal;
