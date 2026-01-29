import { useEffect, useRef } from "react";
import styles from "./DocumentationModal.module.css";

export const DocumentationModal = ({
  isOpen = true,
  onClose,
  children,
  className,
}: {
  isOpen?: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onClose]);

  // Close on ESC
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className={styles.backdrop}>
      <div
        ref={modalRef}
        className={`${styles.modal} ${className ?? ""}`}
        role="dialog"
        aria-modal="true"
      >
        {children}
      </div>
    </div>
  );
};
