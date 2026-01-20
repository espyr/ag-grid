import { Icon } from "@fluentui/react";
import styles from "./TopBar.module.css";

export const TopBar: React.FC<{
  selectedRows?: any[];
  quickFilterText: string;
  setQuickFilterText: (text: string) => void;
}> = ({ selectedRows, quickFilterText, setQuickFilterText }) => {
  const isButtonVisible = selectedRows && selectedRows.length > 0;
  const uploadFile = () => {
    // Lógica para subir el fichero
  };
  const deleteFile = () => {
    // Lógica para eliminar el fichero
  };
  const downloadFile = () => {
    // Lógica para descargar la documentación
  };
  const openSharePoint = () => {
    // Lógica para abrir en SharePoint
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
            onClick={() => deleteFile()}
          >
            <Icon iconName="Delete" />
            Eliminar fichero
          </button>
        )}
        {isButtonVisible && (
          <button
            className={styles.secondaryButton}
            onClick={() => downloadFile()}
          >
            <Icon iconName="Download" />
            Descargar Documentación
          </button>
        )}
        <button
          className={styles.secondaryButton}
          onClick={() => {
            openSharePoint();
          }}
        >
          <Icon iconName="OpenInNewWindow" />
          Abrir en SharePoint
        </button>
      </div>

      {/* Right search */}
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
    </div>
  );
};
