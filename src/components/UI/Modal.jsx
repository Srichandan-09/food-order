import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

export default function Modal({ children, open, onClose, className = '' }) {

  const dialogRef = useRef();
  
  useEffect(() => {

    const modal = dialogRef.current;

    if(open) {
      modal.showModal();

      return () => modal.close();
    }
  }, [open]);

  return createPortal(
    <dialog className={`modal ${className}`} ref={dialogRef} onClose={onClose}>{children}</dialog>,
    document.getElementById("modal")
  );
}
