import { ColDef } from "ag-grid-community";

import { NombreCellRenderer } from "../../../../renders/NombreCellRenderer";
import { formatDate, getTextByKey } from "../../../../utils/functions";
import {
  categoriaOptions,
  subcategoriaOptions,
  tipificacionOptions,
} from "../../../../utils/dataOptions";

export const documentationColumns = (
  refreshData: () => void,
  updateRevisado: (id: string, value: boolean) => void,
): ColDef[] => [
  {
    field: "osp_nombre",
    headerName: "Nombre",
    minWidth: 250,
    resizable: true,
    cellRenderer: NombreCellRenderer,
    cellRendererParams: {
      refreshData,
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
      getTextByKey(categoriaOptions, data?.osp_categoria) ?? "",
    getQuickFilterText: () => "",
  },
  {
    field: "osp_subcategoria",
    headerName: "Subcategoría",
    minWidth: 150,
    resizable: true,
    valueGetter: ({ data }) =>
      getTextByKey(subcategoriaOptions, data?.osp_subcategoria) ?? "",
    getQuickFilterText: () => "",
  },
  {
    field: "osp_descripcion",
    headerName: "Descripción",
    minWidth: 150,
    resizable: true,
    getQuickFilterText: () => "",
  },
  {
    field: "osp_validadocontratacion",
    headerName: "Revisado",
    minWidth: 80,
    resizable: true,
    editable: true,
    cellStyle: { justifyContent: "center", display: "flex" },
    getQuickFilterText: () => "",
    onCellValueChanged: (params) => {
      updateRevisado(params.data.osp_documentacionid, params.newValue);
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
    minWidth: 150,
    headerName: "Fecha Creación",
    filter: "agDateColumnFilter",
    valueGetter: ({ data }) =>
      data?.createdon ? new Date(data.createdon) : null,
    valueFormatter: ({ value }) => (value ? formatDate(value) : ""),
    filterParams: {
      comparator: (filterDate: Date, cellValue: Date) => {
        if (!cellValue) return -1;
        const cell = new Date(cellValue);
        if (cell < filterDate) return -1;
        if (cell > filterDate) return 1;
        return 0;
      },
    },
  },
  {
    field: "modifiedon",
    headerName: "Fecha Modificación",
    minWidth: 180,
    valueGetter: ({ data }) =>
      data?.modifiedon ? new Date(data.modifiedon) : null,
    valueFormatter: ({ value }) => (value ? formatDate(value) : ""),
    filter: "agDateColumnFilter",
    getQuickFilterText: () => "",
    filterParams: {
      filterOptions: ["lessThan", "greaterThan", "inRange"],
      suppressAndOrCondition: true,
      comparator: (filterDate: Date, cellValue: Date) => {
        if (!cellValue) return -1;
        const cell = new Date(cellValue);
        if (cell < filterDate) return -1;
        if (cell > filterDate) return 1;
        return 0;
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
export const cuentaColumns = (refreshData: () => void): ColDef[] => [
  {
    field: "osp_nombre",
    headerName: "Nombre",
    minWidth: 250,
    resizable: true,
    cellRenderer: NombreCellRenderer,
    cellRendererParams: {
      refreshData,
      tipificacionOptions,
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
    field: "osp_descripcion",
    headerName: "Descripción",
    minWidth: 200,
    resizable: true,
    getQuickFilterText: () => "",
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
    filter: "agDateColumnFilter",

    valueGetter: ({ data }) =>
      data?.createdon ? new Date(data.createdon) : null,
    valueFormatter: ({ value }) => (value ? formatDate(value) : ""),
    filterParams: {
      comparator: (filterDate: Date, cellValue: Date) => {
        if (!cellValue) return -1;
        const cell = new Date(cellValue);
        if (cell < filterDate) return -1;
        if (cell > filterDate) return 1;
        return 0;
      },
    },
  },
  {
    field: "modifiedon",
    headerName: "Fecha Modificación",
    minWidth: 180,
    valueGetter: ({ data }) =>
      data?.modifiedon ? new Date(data.modifiedon) : null,
    valueFormatter: ({ value }) => (value ? formatDate(value) : ""),
    filter: "agDateColumnFilter",
    getQuickFilterText: () => "",
    filterParams: {
      filterOptions: ["lessThan", "greaterThan", "inRange"],
      suppressAndOrCondition: true,
      comparator: (filterDate: Date, cellValue: Date) => {
        if (!cellValue) return -1;
        const cell = new Date(cellValue);
        if (cell < filterDate) return -1;
        if (cell > filterDate) return 1;
        return 0;
      },
    },
  },
];
