import { useState } from "react";
import styles from "./UploadModal.module.css";
import { FileUploader } from "../../components/FileUploader/FileUploader";
import toast from "react-hot-toast";
import { ReplaceConfirmationModal } from "../ReplaceConfirmationModal/ReplaceConfirmationModal";
import { DocumentationModal } from "../../../DocumentationModal/DocumentationModal";
import { useDocumentationCategories } from "../../../../utils/useDocumentationCategories";
import { useDataTable } from "../../components/DataTable/DataTableContext";

interface UploadModalProps {
  setIsOpenModal: (isOpen: boolean) => void;
}

interface ErrorState {
  [key: string]: string;
}

export interface UploadFilePayload {
  documentacionId?: string;
  descripcion?: string;
  tipificacionValue?: number | null;
  categoriaValue?: number | null;
  subcategoriaValue?: number | null;
  fileName?: string;
  fileBase64?: string;
}

export const UploadModal = ({ setIsOpenModal }: UploadModalProps) => {
  const { options, refreshData, mode } = useDataTable();
  const [descripcion, setDescripcion] = useState("");
  const [tipificacion, setTipificacion] = useState<number | null>(null);
  const [categoria, setCategoria] = useState<number | null>(null);
  const [subcategoria, setSubcategoria] = useState<number | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [base64, setBase64] = useState<string | null>(null);
  const [errors, setErrors] = useState<ErrorState | null>(null);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [pendingBase64, setPendingBase64] = useState<string | null>(null);
  const [existingFileId, setExistingFileId] = useState<string | null>(null);
  const [showReplaceConfirmationModal, setShowReplaceConfirmationModal] =
    useState(false);
  const [preparedPayload, setPreparedPayload] =
    useState<UploadFilePayload | null>(null);

  const { categoriasDisponibles, subcategoriasDisponibles } =
    useDocumentationCategories({
      tipificacion,
      categoria,
      setCategoria,
      setSubcategoria,
    });

  const uploadFile = async (payload: UploadFilePayload) => {
    setIsOpenModal(false);
    const toastId = toast.loading("Subiendo fichero...");
    try {
      const res = await window.parent!.formApi!.uploadFile(payload);
      if (res && res !== "OK") throw new Error("HTTP error");
      toast.success("El fichero se ha subido correctamente", { id: toastId });
      await refreshData();
    } catch (err) {
      toast.error("Error al subir el archivo", { id: toastId });
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
    const payloadToUse = preparedPayload ?? {
      descripcion,
      tipificacionValue: tipificacion,
      categoriaValue: categoria,
      subcategoriaValue: subcategoria,
      fileName: file.name,
      fileBase64: base64.split(",")[1],
      documentacionId: existingFileId!,
    };
    await uploadFile(payloadToUse);
  };

  const handleFileExists = (newFile: File, newBase64: string) => {
    setPendingFile(newFile);
    setPendingBase64(newBase64);
    setShowReplaceConfirmationModal(true);
  };

  const confirmReplace = () => {
    if (!pendingFile || !pendingBase64) return;

    const payload: UploadFilePayload = {
      descripcion,
      tipificacionValue: tipificacion,
      categoriaValue: categoria,
      subcategoriaValue: subcategoria,
      fileName: pendingFile.name,
      fileBase64: pendingBase64.split(",")[1],
      documentacionId: existingFileId!,
    };
    setPreparedPayload(payload);
    setPendingFile(null);
    setPendingBase64(null);
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
          {options.tipificaciones.map((opt) => (
            <option key={opt.key} value={opt.key}>
              {opt.text}
            </option>
          ))}
        </select>

        {errors?.tipificacion && (
          <span className={styles.error}>{errors.tipificacion}</span>
        )}

        {mode === "opportunity" && <label>Categoría</label>}
        {mode === "opportunity" && (
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
        )}

        {mode === "opportunity" && <label>Subcategoría</label>}
        {mode === "opportunity" && (
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
        )}

        <FileUploader
          setExistingFileId={setExistingFileId}
          file={file}
          setFile={setFile}
          setBase64={setBase64}
          errors={errors}
          setErrors={setErrors}
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
