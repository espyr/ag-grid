import { useEffect, useState } from "react";
import { categoriaOptions, subcategoriaOptions } from "./dataOptions";

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
  setCategoria,
  setSubcategoria,
}: Params) => {
  const [categoriasDisponibles, setCategoriasDisponibles] = useState<Option[]>(
    [],
  );
  const [subcategoriasDisponibles, setSubcategoriasDisponibles] = useState<
    Option[]
  >([]);

  // Load categories when tipificacion changes
  useEffect(() => {
    if (tipificacion == null) {
      setCategoriasDisponibles([]);
      setSubcategoriasDisponibles([]);
      setCategoria(null);
      setSubcategoria(null);
      return;
    }

    const cats = categoriaOptions[tipificacion] ?? [];
    setCategoriasDisponibles(cats);
  }, [tipificacion]);

  // Load subcategories when categoria changes
  useEffect(() => {
    if (categoria == null) {
      setSubcategoriasDisponibles([]);
      setSubcategoria(null);
      return;
    }

    const subs = subcategoriaOptions[categoria] ?? [];
    setSubcategoriasDisponibles(subs);
  }, [categoria]);

  return {
    categoriasDisponibles,
    subcategoriasDisponibles,
  };
};
