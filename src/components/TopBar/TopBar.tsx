import { Icon } from "@fluentui/react";
import styles from "./TopBar.module.css";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { useState } from "react";
import { UploadModal } from "../DataTable/Modals/UploadModal/UploadModal";
import { RawDataItem } from "../../data";

export const TopBar: React.FC<{
  selectedRows?: RawDataItem[];
  quickFilterText: string;
  setQuickFilterText: (text: string) => void;
  refreshData?: () => void;
}> = ({ selectedRows, quickFilterText, setQuickFilterText, refreshData }) => {
  const isButtonVisible = selectedRows && selectedRows.length > 0;
  const [isOpenModal, setIsOpenModal] = useState(false);
  const handleBulkDownload = async () => {
    if (!selectedRows?.length) return;

    const zip = new JSZip();
    const folder = zip.folder("archivos");

    try {
      for (const item of selectedRows) {
        const url = item.osp_link;
        const baseName =
          item.osp_nombre?.replace(/[^\w\d]+/g, "_") || "archivo";

        const res = await fetch(url);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const blob = await res.blob();

        // Try to infer extension
        const type = res.headers.get("content-type") || "";
        let ext = "";
        if (type.includes("pdf")) ext = ".pdf";
        else if (type.includes("png")) ext = ".png";
        else if (type.includes("jpeg")) ext = ".jpg";

        folder?.file(baseName + ext, blob);
      }

      const zipBlob = await zip.generateAsync({ type: "blob" });
      saveAs(zipBlob, "descarga.zip");
    } catch (e) {
      console.error("ZIP download failed:", e);
      alert("No se pudieron descargar los archivos. Posible problema de CORS.");
    }
  };

  const uploadFile = () => {
    setIsOpenModal(true);
  };
  const deleteFiles = () => {
    console.log("Eliminar ficheros seleccionados");
    console.log(selectedRows);
    console.log("refreshData called");
    refreshData?.();
  };
  const downloadFiles = () => {
    // Lógica para descargar la documentación
    console.log("Descargar documentación de ficheros seleccionados");
    handleBulkDownload();
    console.log(selectedRows);
  };
  const openSharePoint = (e: React.MouseEvent) => {
    // Lógica para abrir en SharePoint
    e.preventDefault();
    window.open("https://www.google.com", "_blank");
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
        {isButtonVisible && (
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
