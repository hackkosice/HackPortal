import React, { PropsWithChildren, useEffect, useRef } from "react";

export type ModalProps = PropsWithChildren<{
  isOpened: boolean;
  onClose?: () => void;
  closeOnOutsideClick?: boolean;
}>;

const MODAL_BASE_CLASSES =
  "bg-hkGray rounded-lg shadow-lg p-4 w-fit absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2";

export const Modal = ({
  children,
  isOpened,
  onClose,
  closeOnOutsideClick = false,
}: ModalProps) => {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!closeOnOutsideClick) {
      return;
    }
    function handleClickOutside(event: MouseEvent) {
      if (
        ref.current &&
        !ref.current.contains(event.target as Node) &&
        onClose
      ) {
        onClose();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [closeOnOutsideClick, onClose, ref]);

  if (!isOpened) {
    return null;
  }

  return (
    <div className={MODAL_BASE_CLASSES} ref={ref}>
      {children}
    </div>
  );
};
