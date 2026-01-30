import styles from "./ReplaceConfirmationModal.module.css";
interface ReplaceConfirmationModalProps {
  confirmReplace: () => Promise<void>;
  setShowReplaceConfirmationModal: (show: boolean) => void;
  setPendingFile: (file: File | null) => void;
  setPendingBase64: (base64: string | null) => void;
  setIsOpenModal: (isOpen: boolean) => void;
}
export const ReplaceConfirmationModal = ({
  confirmReplace,
  setShowReplaceConfirmationModal,
  setPendingFile,
  setPendingBase64,
  setIsOpenModal,
}: ReplaceConfirmationModalProps) => {
  const onCancel = () => {
    setShowReplaceConfirmationModal(false);
    setPendingFile(null);
    setPendingBase64(null);
    setIsOpenModal(true);
  };
  return (
    <div className={styles.replaceConfirmationModal}>
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
