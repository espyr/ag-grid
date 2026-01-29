import { useState } from "react";
import styles from "./UploadModal.module.css";
import { tipificacionOptions } from "../../../../utils/dataOptions";
import { FileUploader } from "../../components/FileUploader/FileUploader";
import toast from "react-hot-toast";
import { ReplaceConfirmationModal } from "../ReplaceConfirmationModal/ReplaceConfirmationModal";
import { DocumentationModal } from "../../../DocumentationModal/DocumentationModal";
import { useDocumentationCategories } from "../../../../utils/useDocumentationCategories";

interface UploadModalProps {
  setIsOpenModal: (isOpen: boolean) => void;
  refreshData?: () => void;
}

interface ErrorState {
  [key: string]: string;
}

export interface UploadFilePayload {
  documentacionId?: string;
  descripcion?: string;
  tipificacion?: number | null;
  categoria?: number | null;
  subcategoria?: number | null;
  fileName?: string;
  fileBase64?: string;
}

export const UploadModal = ({
  setIsOpenModal,
  refreshData,
}: UploadModalProps) => {
  const [descripcion, setDescripcion] = useState("");
  const [tipificacion, setTipificacion] = useState<number | null>(null);
  const [categoria, setCategoria] = useState<number | null>(null);
  const [subcategoria, setSubcategoria] = useState<number | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [base64, setBase64] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<ErrorState | null>(null);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [pendingBase64, setPendingBase64] = useState<string | null>(null);
  const [showReplaceConfirmationModal, setShowReplaceConfirmationModal] =
    useState(false);

  const { categoriasDisponibles, subcategoriasDisponibles } =
    useDocumentationCategories({
      tipificacion,
      categoria,
      setCategoria,
      setSubcategoria,
    });

  const uploadFile = async (payload: UploadFilePayload) => {
    const toastId = toast.loading("Subiendo fichero...");
    try {
      const res = await window.parent!.formApi!.uploadFile(payload);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      toast.success("Archivo subido con éxito", { id: toastId });
      refreshData?.();
      setIsOpenModal(false);
    } catch (err) {
      console.error("Upload failed:", err);
      toast.error("Error al subir el archivo", { id: toastId });
      setIsOpenModal(false);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors(null);

    if (!tipificacion) {
      setErrors({ tipificacion: "La tipificación es obligatoria" });
      return;
    }

    if (!file || !base64) {
      setErrors({ file: "Selecciona un archivo" });
      return;
    }

    setLoading(true);

    const payload: UploadFilePayload = {
      descripcion,
      tipificacion,
      categoria,
      subcategoria,
      fileName: file.name,
      fileBase64: base64.split(",")[1],
    };

    await uploadFile(payload);
  };

  const handleFileExists = (newFile: File, newBase64: string) => {
    setPendingFile(newFile);
    setPendingBase64(newBase64);
    setShowReplaceConfirmationModal(true);
  };

  const confirmReplace = async () => {
    if (!pendingFile || !pendingBase64) return;

    const payload = {
      descripcion,
      tipificacion,
      categoria,
      subcategoria,
      fileName: pendingFile.name,
      contentType: pendingFile.type,
      base64: pendingBase64.split(",")[1],
    };

    setIsOpenModal(false);
    setLoading(true);
    await uploadFile(payload);

    setPendingFile(null);
    setPendingBase64(null);
    setShowReplaceConfirmationModal(false);
  };

  return (
    <DocumentationModal
      onClose={() => setIsOpenModal(false)}
      className={styles.modal}
    >
      <form onSubmit={handleSubmit}>
        <label>Descripción</label>
        <textarea
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
        />

        <label>
          Tipificación <span className={styles.required}>*</span>
        </label>
        <select
          value={tipificacion ?? ""}
          onChange={(e) => {
            setTipificacion(Number(e.target.value));
            setErrors({ ...errors, tipificacion: "" });
          }}
        >
          <option value="">Selecciona...</option>
          {tipificacionOptions.map((opt) => (
            <option key={opt.key} value={opt.key}>
              {opt.text}
            </option>
          ))}
        </select>

        {errors?.tipificacion && (
          <span className={styles.error}>{errors.tipificacion}</span>
        )}

        <label>Categoría</label>
        <select
          value={categoria ?? ""}
          onChange={(e) => setCategoria(Number(e.target.value))}
          disabled={!tipificacion || categoriasDisponibles.length === 0}
        >
          <option value="">Selecciona...</option>
          {categoriasDisponibles.map((opt) => (
            <option key={opt.key} value={opt.key}>
              {opt.text}
            </option>
          ))}
        </select>

        <label>Subcategoría</label>
        <select
          value={subcategoria ?? ""}
          onChange={(e) => setSubcategoria(Number(e.target.value))}
          disabled={!categoria || subcategoriasDisponibles.length === 0}
        >
          <option value="">Selecciona...</option>
          {subcategoriasDisponibles.map((opt) => (
            <option key={opt.key} value={opt.key}>
              {opt.text}
            </option>
          ))}
        </select>

        <FileUploader
          file={file}
          setFile={setFile}
          setBase64={setBase64}
          errors={errors}
          setErrors={setErrors}
          setLoading={setLoading}
          onFileExists={handleFileExists}
        />

        <div className={styles.footer}>
          <button type="submit" className={styles.primaryBtn}>
            Guardar
          </button>
          <button
            type="button"
            className={styles.secondaryBtn}
            onClick={() => setIsOpenModal(false)}
          >
            Cancelar
          </button>
        </div>
      </form>

      {showReplaceConfirmationModal && (
        <ReplaceConfirmationModal
          setIsOpenModal={setIsOpenModal}
          confirmReplace={confirmReplace}
          setShowReplaceConfirmationModal={setShowReplaceConfirmationModal}
          setPendingFile={setPendingFile}
          setPendingBase64={setPendingBase64}
        />
      )}
    </DocumentationModal>
  );
};
