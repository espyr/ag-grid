import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import styles from "./NombreCellRenderer.module.css";
import { Icon } from "@fluentui/react";

interface Props {
  value: string;
  data: any;
}

export const NombreCellRenderer: React.FC<Props> = ({ value, data }) => {
  const [open, setOpen] = useState(false);
  const [menuPos, setMenuPos] = useState<{ top: number; left: number } | null>(
    null
  );

  const buttonRef = useRef<HTMLButtonElement>(null);

  const onLinkClick = (e: React.MouseEvent) => {
    e.preventDefault();
    window.open("https://www.google.com", "_blank");
  };

  const toggleMenu = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (!buttonRef.current) return;

    const rect = buttonRef.current.getBoundingClientRect();

    // 🔥 Calculate position JUST AFTER the button
    setMenuPos({
      top: rect.bottom + 6,
      left: rect.left,
    });
    setOpen((prev) => !prev);
  };

  // Close when clicking outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (buttonRef.current && !buttonRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className={styles.container}>
      <a href="#" onClick={onLinkClick} className={styles.link} title={value}>
        {value}
      </a>
      <button
        ref={buttonRef}
        onClick={toggleMenu}
        className={styles.menuButton}
        aria-label="Más acciones"
      >
        <Icon iconName="MoreVertical" />
      </button>

      {/* Floating menu */}
      {open &&
        menuPos &&
        createPortal(
          <div
            className={styles.menu}
            style={{
              position: "fixed",
              top: menuPos.top,
              left: menuPos.left,
            }}
          >
            <div className={styles.menuItem}>
              <Icon iconName="ViewList" />
              Editar
            </div>
            <div className={styles.menuItem}>
              <Icon iconName="Rename" /> Cambiar nombre
            </div>
            <div className={styles.menuItem}>
              <Icon iconName="Refresh" />
              Actualizar fichero
            </div>
          </div>,
          document.body
        )}
    </div>
  );
};
