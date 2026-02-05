import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import styles from "./NombreCellRenderer.module.css";
import { Icon } from "@fluentui/react";
import { EditModal } from "../components/DataTable/Modals/EditModal/EditModal";
import { ReeplaceFileModal } from "../components/DataTable/Modals/ReeplaceFileModal/ReeplaceFileModal";
import { RawDataItem } from "../types/data";

interface Props {
  value: string;
  data: RawDataItem;
  refreshData?: () => Promise<void>;
}

export const NombreCellRenderer: React.FC<Props> = ({
  value,
  data,
  refreshData,
}) => {
  const [optionsOpen, setOptionsOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [rowData, setRowData] = useState<RawDataItem | null>(null);
  const [refreshOpen, setRefreshOpen] = useState(false);
  const [menuPos, setMenuPos] = useState<{ top: number; left: number } | null>(
    null,
  );

  const isFilePT = data.osp_tipificacion === 863920001;
  const buttonRef = useRef<HTMLButtonElement>(null);
  const onLinkClick = (e: React.MouseEvent) => {
    e.preventDefault();
    window.open(data.osp_link, "_blank");
  };
  const handleEdit = () => {
    console.log("Editar clicked", data.osp_documentacionid);
    setOptionsOpen(false);
    setEditOpen(true);
  };
  const handleRefresh = () => {
    console.log("Actualizar fichero clicked", data.osp_documentacionid);
    setOptionsOpen(false);
    setRefreshOpen(true);
  };
  const toggleMenu = (e: React.MouseEvent) => {
    setRowData(data);
    e.stopPropagation();
    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    // 🔥 Calculate position JUST AFTER the button
    setMenuPos({
      top: rect.bottom + 6,
      left: rect.left,
    });
    setOptionsOpen((prev) => !prev);
  };
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // closes the menu if clicked outside or other menu opened
    const handler = (e: MouseEvent) => {
      if (
        buttonRef.current &&
        !buttonRef.current.contains(e.target as Node) &&
        menuRef.current &&
        !menuRef.current.contains(e.target as Node)
      ) {
        setOptionsOpen(false);
      }
    };

    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (buttonRef.current && !buttonRef.current.contains(e.target as Node)) {
        setOptionsOpen(false);
      }
    };

    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
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
      {editOpen &&
        createPortal(
          <EditModal
            rowData={data}
            onClose={() => setEditOpen(false)}
            refreshData={refreshData}
          />,
          document.body,
        )}

      {refreshOpen &&
        createPortal(
          <ReeplaceFileModal
            rowData={rowData}
            onClose={() => setRefreshOpen(false)}
            refreshData={refreshData}
          />,
          document.body,
        )}
      {/* Floating menu */}
      {optionsOpen &&
        menuPos &&
        createPortal(
          <div
            ref={menuRef}
            className={styles.menu}
            style={{
              position: "fixed",
              top: menuPos.top,
              left: menuPos.left,
            }}
          >
            <div
              className={styles.menuItem}
              onClick={(e) => {
                e.stopPropagation();
                handleEdit();
              }}
            >
              {" "}
              <Icon iconName="ViewList" />
              Editar
            </div>
            {!isFilePT && (
              <div
                className={styles.menuItem}
                onClick={(e) => {
                  e.stopPropagation();
                  handleRefresh();
                }}
              >
                <Icon iconName="Refresh" />
                Actualizar fichero
              </div>
            )}
          </div>,
          document.body,
        )}
    </div>
  );
};
