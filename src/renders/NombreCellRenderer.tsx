import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import styles from "./NombreCellRenderer.module.css";
import { Icon } from "@fluentui/react";
import { EditModal } from "../components/DataTable/Modals/EditModal/EditModal";
import { RefreshModal } from "../components/DataTable/Modals/RefreshModal/RefreshModal";
import { RawDataItem } from "../data";

interface Props {
  value: string;
  data: RawDataItem;
  refreshData?: () => void;
  openMenuRowId: string | null;
  setOpenMenuRowId: Dispatch<SetStateAction<string | null>>;
}

export const NombreCellRenderer: React.FC<Props> = ({
  value,
  data,
  refreshData,
  openMenuRowId,
  setOpenMenuRowId,
}) => {
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
    window.open("https://www.google.com", "_blank");
  };
  const isOpen = openMenuRowId === data.osp_documentacionid;

  const handleEdit = () => {
    console.log("Editar clicked", data.osp_documentacionid);
    setOpenMenuRowId(null);
    setEditOpen(true);
  };
  const handleRefresh = () => {
    console.log("Actualizar fichero clicked", data.osp_documentacionid);
    setOpenMenuRowId(null);
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
    setOpenMenuRowId((prev) =>
      prev === data.osp_documentacionid ? null : data.osp_documentacionid,
    );
  };

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (buttonRef.current && !buttonRef.current.contains(e.target as Node)) {
        setOpenMenuRowId(null);
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
          <RefreshModal
            rowData={rowData}
            onClose={() => setRefreshOpen(false)}
            refreshData={refreshData}
          />,
          document.body,
        )}
      {/* Floating menu */}
      {isOpen &&
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
            <div
              className={styles.menuItem}
              onClick={(e) => {
                setOpenMenuRowId(null);
                e.stopPropagation();
                handleEdit();
              }}
            >
              {" "}
              <Icon iconName="ViewList" />
              Editar
            </div>
            {isFilePT && (
              <div
                className={styles.menuItem}
                onClick={(e) => {
                  e.stopPropagation();
                  handleRefresh();
                }}
              >
                <Icon iconName="Refresh" />
                Reemplazar fichero
              </div>
            )}
          </div>,
          document.body,
        )}
    </div>
  );
};
