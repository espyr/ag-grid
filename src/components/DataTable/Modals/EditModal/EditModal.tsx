import { useState } from "react";
import { RawDataItem } from "../../../../types/data";
import styles from "./EditModal.module.css";
import { tipificacionOptions } from "../../../../utils/dataOptions";
import { toast } from "react-hot-toast";
import { UploadFilePayload } from "../UploadModal/UploadModal";
import { useDocumentationCategories } from "../../../../utils/useDocumentationCategories";
import { DocumentationModal } from "../../../DocumentationModal/DocumentationModal";

export const EditModal = ({
  rowData,
  onClose,
  refreshData,
}: {
  rowData: RawDataItem;
  onClose: () => void;
  refreshData?: () => void;
}) => {
  const [descripcion, setDescripcion] = useState(rowData.osp_descripcion ?? "");
  const [nombre, setNombre] = useState(rowData.osp_nombre ?? "");
  const [tipificacion, setTipificacion] = useState(
    rowData.osp_tipificacion ?? 0,
  );
  const [categoria, setCategoria] = useState<number | null>(
    rowData.osp_categoria ?? null,
  );
  const [subcategoria, setSubcategoria] = useState<number | null>(
    rowData.osp_subcategoria ?? null,
  );
  const [errors, setErrors] = useState<Record<string, string> | null>(null);

  const { categoriasDisponibles, subcategoriasDisponibles } =
    useDocumentationCategories({
      tipificacion,
      categoria,
      setCategoria,
      setSubcategoria,
    });

  const editRow = async (payload: UploadFilePayload) => {
    const toastId = toast.loading("Enviando cambios...");
    try {
      const res = await fetch("/api/edit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      toast.success("Archivo editado con éxito", { id: toastId });
      refreshData?.();
      onClose();
    } catch (err) {
      console.error("Edit failed:", err);
      toast.error("Error al editar el archivo", { id: toastId });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    await editRow({
      documentacionId: rowData.osp_documentacionid,
      descripcion,
      tipificacion,
      categoria,
      subcategoria,
    });
  };

  return (
    <DocumentationModal onClose={onClose} className={styles.modal}>
      <form onSubmit={handleSubmit}>
        <label>Nombre</label>
        <input value={nombre} onChange={(e) => setNombre(e.target.value)} />

        <label>
          Tipificación <span className={styles.required}>*</span>
        </label>
        <select
          value={tipificacion}
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

        <label>Descripción</label>
        <textarea
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
        />

        <div className={styles.footer}>
          <button type="submit" className={styles.primaryBtn}>
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
      </form>
    </DocumentationModal>
  );
};
