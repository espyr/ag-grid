import { useEffect, useState } from "react";
import { useDataTable } from "../components/DataTable/components/DataTable/DataTableContext";

export interface Option {
  key: number;
  text: string;
}

interface Params {
  tipificacion: number | null;
  categoria: number | null;
  setCategoria: (v: number | null) => void;
  setSubcategoria: (v: number | null) => void;
}

export const useDocumentationCategories = ({
  tipificacion,
  categoria,
}: Params) => {
  const [categoriasDisponibles, setCategoriasDisponibles] = useState<Option[]>(
    [],
  );
  const [subcategoriasDisponibles, setSubcategoriasDisponibles] = useState<
    Option[]
  >([]);
  const { options } = useDataTable();

  // Load categories when tipificacion changes
  useEffect(() => {
    if (tipificacion == null || !options.categorias) {
      setCategoriasDisponibles([]);
      setSubcategoriasDisponibles([]);
      return;
    }

    const cats = options.categorias[tipificacion] ?? [];
    setCategoriasDisponibles(cats);
  }, [tipificacion, options.categorias]);

  // Load subcategories when categoria changes
  useEffect(() => {
    if (categoria == null || !options.subcategorias) {
      setSubcategoriasDisponibles([]);
      return;
    }

    const subs = options.subcategorias[categoria] ?? [];
    setSubcategoriasDisponibles(subs);
  }, [categoria, options.subcategorias]);

  return {
    categoriasDisponibles,
    subcategoriasDisponibles,
  };
};
