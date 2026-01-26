import { useEffect, useRef, useState } from "react";
import { RawDataItem } from "../../../../data";
import styles from "./EditModal.module.css";
import {
  categoriaOptions,
  subcategoriaOptions,
  tipificacionOptions,
} from "../../../../dataOptions";
import { toast } from "react-hot-toast";
import { UploadFile } from "../UploadModal/UploadModal";
export const EditModal = ({
  rowData,
  onClose,
  refreshData,
}: {
  rowData: RawDataItem;
  onClose: () => void;
  refreshData?: () => void;
}) => {
  const [descripcion, setDescripcion] = useState<string>(
    rowData ? rowData.osp_descripcion : "",
  );
  const [tipificacion, setTipificacion] = useState<number>(
    rowData.osp_tipificacion,
  );
  const [categoria, setCategoria] = useState<number>(rowData.osp_categoria);
  const [subcategoria, setSubcategoria] = useState<number | null>(
    rowData ? rowData.osp_subcategoria : null,
  );
  const modalRef = useRef<HTMLDivElement>(null);
  const [errors, setErrors] = useState<{ [key: string]: string } | null>(null);
  const [nombre, setNombre] = useState<string>(
    rowData ? rowData.osp_nombre : "",
  );
  const [categoriasDisponibles, setCategoriasDisponibles] = useState<
    { key: number; text: string }[]
  >([]);
  const [subcategoriasDisponibles, setSubcategoriasDisponibles] = useState<
    { key: number; text: string }[]
  >([]);
  const editRow = async (payload: UploadFile) => {
    const toastId = toast.loading("Enviando cambios...");
    try {
      const res = await fetch("/api/edit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      toast.success("Archivo editado con éxito", { id: toastId });
      onClose();
    } catch (err) {
      console.error("Edit failed:", err);
      toast.error("Error al editar el archivo", { id: toastId });
    }
  };
  const handleSubmit = () => {
    console.log("refreshData called");
    editRow({
      id: rowData.osp_documentacionid,
      nombre,
      descripcion,
      tipificacion,
      categoria,
      subcategoria,
    });
    refreshData?.();
    onClose();
  };
  useEffect(() => {
    const cats = categoriaOptions[tipificacion] ?? [];
    setCategoriasDisponibles(cats);
    setSubcategoriasDisponibles([]);
  }, [tipificacion]);
  useEffect(() => {
    const subs = subcategoriaOptions[categoria] ?? [];
    setSubcategoriasDisponibles(subs);
    setSubcategoria(null);
  }, [categoria]);
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
      <div className={styles.modal}>
        <form onSubmit={handleSubmit}>
          <label>Nombre</label>
          <input value={nombre} onChange={(e) => setNombre(e.target.value)} />
          <label>Descripción</label>
          <textarea
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
          />

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
            value={categoria}
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
            value={subcategoria?.toString() || ""}
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
      </div>
    </div>
  );
};
