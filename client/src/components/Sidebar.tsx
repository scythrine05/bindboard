import { Sidebar } from "primereact/sidebar";
import React from "react";

interface SidebarProps {
  visible: boolean;
  onHide: () => void;
  children?: React.ReactNode;
}

const SidebarComponent: React.FC<SidebarProps> = ({
  visible,
  onHide,
  children,
}) => {
  return (
    <Sidebar
      visible={visible}
      position="right"
      onHide={onHide}
      showCloseIcon={false}
    >
      {children}
    </Sidebar>
  );
};

export default SidebarComponent;
