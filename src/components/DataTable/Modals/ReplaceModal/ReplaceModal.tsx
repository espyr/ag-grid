import styles from "./ReplaceModal.module.css";
interface ReplaceModalProps {
  confirmReplace: () => Promise<void>;
  setShowReplaceModal: (show: boolean) => void;
  setPendingFile: (file: File | null) => void;
  setPendingBase64: (base64: string | null) => void;
  setIsOpenModal: (isOpen: boolean) => void;
}
export const ReplaceModal = ({
  confirmReplace,
  setShowReplaceModal,
  setPendingFile,
  setPendingBase64,
  setIsOpenModal,
}: ReplaceModalProps) => {
  const onCancel = () => {
    setShowReplaceModal(false);
    setPendingFile(null);
    setPendingBase64(null);
    setIsOpenModal(true);
  };
  return (
    <div className={styles.replaceModal}>
      <p>
        El archivo ya existe. <br />
        ¿Deseas reemplazarlo?
      </p>

      <div className={styles.buttonGroup}>
        <button className={styles.primaryBtn} onClick={confirmReplace}>
          Sí, reemplazar
        </button>
        <button className={styles.secondaryBtn} onClick={onCancel}>
          Cancelar
        </button>
      </div>
    </div>
  );
};
