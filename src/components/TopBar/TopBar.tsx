import { Icon } from "@fluentui/react";
import styles from "./TopBar.module.css";
import { useEffect, useState } from "react";
import { UploadModal } from "../DataTable/Modals/UploadModal/UploadModal";
import { RawDataItem } from "../../types/dataTypes";
import { toast } from "react-hot-toast";
import { useDataTable } from "../DataTable/components/DataTable/DataTableContext";
import { waitForFormApi } from "../../utils/functions";

export const TopBar: React.FC<{
  selectedRows?: RawDataItem[];
  quickFilterText: string;
  setQuickFilterText: (text: string) => void;
}> = ({ selectedRows, quickFilterText, setQuickFilterText }) => {
  const { refreshData } = useDataTable();
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
      toast.error("No se pudieron abrir los archivos.");
    }
  };

  useEffect(() => {
    let mounted = true;
    const checkAdmin = async () => {
      try {
        waitForFormApi().then(async () => {
          const result = await window.parent!.formApi!.isAdmin();
          if (mounted) setIsAdmin(Boolean(result));
        });
      } catch (err) {
        setIsAdmin(false);
        toast.error("Failed to check admin status");
      }
    };
    checkAdmin();
    return () => {
      mounted = false;
    };
  }, []);

  const deleteFiles = async () => {
    const selectedRowsIds =
      selectedRows?.map((row) => row.osp_documentacionid) || [];
    try {
      const res = await window.parent!.formApi!.deleteRecord(selectedRowsIds);
      if (res && res === "OK") {
        toast.success("Ficheros eliminados correctamente");
      } else {
        toast.error("Error al eliminar los ficheros");
      }
    } catch (err) {
      toast.error("Error al eliminar los ficheros");
    }
    await refreshData?.();
  };
  const downloadFiles = () => {
    handleBulkDownload();
  };
  const openSharePoint = async (e: React.MouseEvent) => {
    e.preventDefault();
    const newWindow = window.open("", "_blank");
    if (!newWindow) {
      toast.error("Popup blocked");
      return;
    }
    try {
      const sharePointLink = await window.parent!.formApi!.getUrlSharepoint();
      newWindow.location.href = sharePointLink;
    } catch (err) {
      newWindow.close();
      toast.error("Failed to get SharePoint link");
    }
  };

  return (
    <div className={styles.topBar}>
      <div className={styles.leftActions}>
        {!isButtonVisible && (
          <button
            className={styles.secondaryButton}
            onClick={() => setIsOpenModal(true)}
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
      {isOpenModal && <UploadModal setIsOpenModal={setIsOpenModal} />}
    </div>
  );
};
