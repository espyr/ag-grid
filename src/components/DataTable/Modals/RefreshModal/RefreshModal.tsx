import { useRef, useState, useEffect } from "react";
import { FileUploader } from "../../components/FileUploader";
import styles from "./RefreshModal.module.css";
import { RawDataItem } from "../../../../data";
import { toast } from "react-hot-toast";
import { UploadFilePayload } from "../UploadModal/UploadModal";
interface ErrorState {
  [key: string]: string;
}

export const RefreshModal = ({
  rowData,
  onClose,
  refreshData,
}: {
  rowData: RawDataItem | null;
  onClose: () => void;
  refreshData?: () => void;
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [base64, setBase64] = useState<string | null>(null);
  const [errors, setErrors] = useState<ErrorState | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  const uploadFile = async (payload: UploadFilePayload) => {
    const toastId = toast.loading("Subiendo fichero...");
    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      toast.success("Archivo subido con éxito", { id: toastId });
      onClose();
    } catch (err) {
      console.error("Upload failed:", err);
      toast.error("Error al subir el archivo", { id: toastId });
    } finally {
      //setLoading(false);
    }
  };
  const handleEdit = async () => {
    if (!file || !base64) {
      setErrors({ file: "Selecciona un archivo" });
      return;
    }
    if (file.name !== rowData?.osp_nombre) {
      setErrors({ file: "El nombre del archivo debe coincidir" });
      return;
    }
    console.log(base64, rowData, file);
    console.log("refreshData called");
    const payload = {
      id: rowData?.osp_documentacionid,
      fileName: file.name,
      contentType: file.type,
      base64: base64.split(",")[1],
    };
    await uploadFile(payload);
    refreshData?.();
    onClose();
  };
  // Close modal on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);
  return (
    <div className={styles.modalBackdrop}>
      <div className={styles.modalContent} ref={modalRef}>
        <h3 style={{ margin: 0 }}>Actualizar Archivo:</h3>
        <span>{rowData?.osp_nombre}</span>

        <FileUploader
          file={file}
          setFile={setFile}
          setBase64={setBase64}
          errors={errors}
          setErrors={setErrors}
          setLoading={() => {}}
        />
        <div className={styles.footer}>
          <button onClick={handleEdit} className={styles.primaryBtn}>
            Guardar
          </button>
          <button
            type="button"
            className={styles.secondaryBtn}
            onClick={onClose}
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};
