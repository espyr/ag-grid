import { useState } from "react";
import { FileUploader } from "../../components/FileUploader/FileUploader";
import styles from "./ReeplaceFileModal.module.css";
import { RawDataItem } from "../../../../types/data";
import { toast } from "react-hot-toast";
import { UploadFilePayload } from "../UploadModal/UploadModal";
import { DocumentationModal } from "../../../DocumentationModal/DocumentationModal";

interface ErrorState {
  [key: string]: string;
}

export const ReeplaceFileModal = ({
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

  const uploadFile = async (payload: UploadFilePayload) => {
    const toastId = toast.loading("Subiendo fichero...");
    try {
      const res = await window.parent!.formApi!.uploadFile(payload);
      if (!res.ok) throw new Error("HTTP error");
      toast.success("Archivo subido con éxito", { id: toastId });
      refreshData?.();
      onClose();
    } catch (err) {
      console.error("Upload failed:", err);
      toast.error("Error al subir el archivo", { id: toastId });
      onClose();
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

    const payload: UploadFilePayload = {
      documentacionId: rowData?.osp_documentacionid,
      fileName: file.name,
      fileBase64: base64.split(",")[1],
      descripcion: rowData?.osp_descripcion,
      tipificacion: rowData?.osp_tipificacion,
      categoria: rowData?.osp_categoria,
      subcategoria: rowData?.osp_subcategoria,
    };

    await uploadFile(payload);
  };

  return (
    <DocumentationModal onClose={onClose} className={styles.modalContent}>
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
        <button type="button" className={styles.secondaryBtn} onClick={onClose}>
          Cancelar
        </button>
      </div>
    </DocumentationModal>
  );
};
