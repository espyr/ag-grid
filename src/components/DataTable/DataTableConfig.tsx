import { ColDef } from "ag-grid-community";
import moment from "moment";
import {
  categoriaOptions,
  subcategoriaOptions,
  tipificacionOptions,
} from "../../dataOptions";
import { NombreCellRenderer } from "../../renders/NombreCellRenderer";
import { Dispatch, SetStateAction } from "react";

const formatDate = (fechaCadena: string | null | undefined): string => {
  if (!fechaCadena) return "";
  const m = moment(fechaCadena);
  return m.isValid() ? m.format("DD/MM/YYYY HH:mm") : String(fechaCadena);
};
export const getByTextByKey = (
  listOfOptions: { [key: number]: { key: number; text: string }[] },
  keyToFind: number,
): string | undefined => {
  for (const opciones of Object.values(listOfOptions)) {
    const found = opciones.find((opt) => opt.key === keyToFind);
    if (found) {
      return found.text;
    }
  }
  return undefined;
};
export const columns = (
  refreshData: () => void,
  updateRevisado: (id: string, value: boolean) => void,
  openMenuRowId: string | null,
  setOpenMenuRowId: Dispatch<SetStateAction<string | null>>,
): ColDef[] => [
  {
    field: "osp_nombre",
    headerName: "Nombre",
    minWidth: 150,
    resizable: true,
    cellRenderer: NombreCellRenderer,
    cellRendererParams: {
      refreshData,
      openMenuRowId,
      setOpenMenuRowId,
    },
    getQuickFilterText: (params) => {
      return params.value ?? "";
    },
  },
  {
    field: "osp_registro",
    headerName: "Registro",
    minWidth: 120,
    resizable: true,
    getQuickFilterText: () => "",
  },
  {
    field: "osp_tipificacion",
    headerName: "Tipificación",
    minWidth: 150,
    resizable: true,
    valueGetter: ({ data }) =>
      tipificacionOptions.find((o) => o.key === data?.osp_tipificacion)?.text ??
      "",
    getQuickFilterText: () => "",
  },
  {
    field: "osp_categoria",
    headerName: "Categoría",
    minWidth: 150,
    resizable: true,
    valueGetter: ({ data }) =>
      getByTextByKey(categoriaOptions, data?.osp_categoria) ?? "",
    getQuickFilterText: () => "",
  },
  {
    field: "osp_subcategoria",
    headerName: "Subcategoría",
    minWidth: 150,
    resizable: true,
    valueGetter: ({ data }) =>
      getByTextByKey(subcategoriaOptions, data?.osp_subcategoria) ?? "",
    getQuickFilterText: () => "",
  },
  {
    field: "osp_descripcion",
    headerName: "Descripción",
    minWidth: 200,
    resizable: true,
    getQuickFilterText: () => "",
  },
  {
    field: "osp_validadocontratacion",
    headerName: "Revisado",
    minWidth: 100,
    resizable: true,
    editable: true,
    cellStyle: { justifyContent: "center", display: "flex" },
    getQuickFilterText: () => "",
    onCellValueChanged: (params) => {
      const newValue = params.newValue;
      const oldValue = params.oldValue;
      const row = params.data;

      if (newValue !== oldValue) {
        console.log("Revisado changed:", newValue, row);
        updateRevisado(row.osp_documentacionid, newValue);
      }
    },
  },

  {
    field: "_ownerid",
    headerName: "Creado por",
    minWidth: 150,
    resizable: true,
    getQuickFilterText: () => "",
  },
  {
    field: "createdon",
    headerName: "Fecha Creación",
    minWidth: 160,
    valueFormatter: ({ value }) => formatDate(value),
    filter: "agDateColumnFilter",
    filterParams: {
      filterOptions: ["lessThan", "greaterThan", "inRange"],
      suppressAndOrCondition: true,

      comparator: (filterDate: Date, cellValue: Date) => {
        if (!cellValue) return -1;

        const cellTime = cellValue.getTime();
        const filterTime = filterDate.getTime();

        if (cellTime === filterTime) return 0;
        return cellTime < filterTime ? -1 : 1;
      },
    },

    getQuickFilterText: () => "",
  },
  {
    field: "modifiedon",
    headerName: "Fecha Modificación",
    minWidth: 180,
    valueGetter: ({ data }) =>
      data?.osp_fecha_modificacion_meta ?? data?.modifiedon,
    valueFormatter: ({ value }) => formatDate(value),
    filter: "agDateColumnFilter",
    getQuickFilterText: () => "",
    filterParams: {
      filterOptions: ["lessThan", "greaterThan", "inRange"],
      suppressAndOrCondition: true,

      comparator: (filterDate: Date, cellValue: Date) => {
        if (!cellValue) return -1;

        const cellTime = cellValue.getTime();
        const filterTime = filterDate.getTime();

        if (cellTime === filterTime) return 0;
        return cellTime < filterTime ? -1 : 1;
      },
    },
  },
  {
    field: "_modifiedby",
    headerName: "Modificado por",
    minWidth: 180,
    resizable: true,
    getQuickFilterText: () => "",
  },
];
