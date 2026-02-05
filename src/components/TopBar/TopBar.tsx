import { Icon } from "@fluentui/react";
import styles from "./TopBar.module.css";
import { useEffect, useState } from "react";
import { UploadModal } from "../DataTable/Modals/UploadModal/UploadModal";
import { RawDataItem } from "../../types/data";

export const TopBar: React.FC<{
  selectedRows?: RawDataItem[];
  quickFilterText: string;
  setQuickFilterText: (text: string) => void;
  refreshData?: () => Promise<void>;
}> = ({ selectedRows, quickFilterText, setQuickFilterText, refreshData }) => {
  const isButtonVisible = selectedRows && selectedRows.length > 0;
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  const handleBulkDownload = async () => {
    if (!selectedRows?.length) return;

    try {
      for (const item of selectedRows) {
        window.open(item.osp_link, "_blank", "noreferrer");

        // wait 500 ms before next
        await new Promise((resolve) => setTimeout(resolve, 300));
      }
    } catch (error) {
      console.error("Open links failed:", error);
      alert("No se pudieron abrir los archivos.");
    }
  };

  useEffect(() => {
    let mounted = true;
    const checkAdmin = async () => {
      console.log("Checking admin status");
      try {
        const result = await window.parent!.formApi!.isAdmin();
        console.log("Admin status:", result);
        if (mounted) setIsAdmin(Boolean(result));
      } catch (err) {
        setIsAdmin(false);
        console.error("Failed to check admin status", err);
      }
    };
    checkAdmin();
    return () => {
      mounted = false;
    };
  }, []);
  const uploadFile = () => {
    setIsOpenModal(true);
  };
  const deleteFiles = async () => {
    console.log("Eliminar ficheros seleccionados");
    console.log(selectedRows);
    console.log("refreshData called");
    await refreshData?.();
  };
  const downloadFiles = () => {
    // Lógica para descargar la documentación
    console.log("Descargar documentación de ficheros seleccionados");
    handleBulkDownload();
    console.log(selectedRows);
  };
  const openSharePoint = async (e: React.MouseEvent) => {
    e.preventDefault();

    // MUST be sync
    const newWindow = window.open("", "_blank");

    if (!newWindow) {
      console.error("Popup blocked");
      return;
    }

    try {
      const sharePointLink = await window.parent!.formApi!.getUrlSharepoint();

      newWindow.location.href = sharePointLink;
    } catch (err) {
      newWindow.close();
      console.error("Failed to get SharePoint link", err);
    }
  };

  return (
    <div className={styles.topBar}>
      <div className={styles.leftActions}>
        {!isButtonVisible && (
          <button
            className={styles.secondaryButton}
            onClick={() => uploadFile()}
          >
            <Icon iconName="CloudUpload" />
            Subir Fichero
          </button>
        )}
        {isButtonVisible && isAdmin && (
          <button
            className={styles.secondaryButton}
            onClick={() => deleteFiles()}
          >
            <Icon iconName="Delete" />
            Eliminar fichero
          </button>
        )}
        {isButtonVisible && (
          <button
            className={styles.secondaryButton}
            onClick={() => downloadFiles()}
          >
            <Icon iconName="Download" />
            Descargar Documentación
          </button>
        )}
        <button
          className={styles.secondaryButton}
          onClick={(e) => {
            openSharePoint(e);
          }}
        >
          <Icon iconName="OpenInNewWindow" />
          Abrir en SharePoint
        </button>
      </div>

      <div className={styles.searchBox}>
        <Icon iconName="Search" className={styles.searchIcon} />
        <input
          type="text"
          placeholder="Buscar..."
          value={quickFilterText}
          onChange={(e) => {
            setQuickFilterText(e.target.value);
          }}
        />
      </div>
      {isOpenModal && (
        <UploadModal
          setIsOpenModal={setIsOpenModal}
          refreshData={refreshData}
        />
      )}
    </div>
  );
};
