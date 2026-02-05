import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { formatInTimeZone } from "date-fns-tz";
import { parseISO } from "date-fns";
import type { SelectionChangedEvent } from "ag-grid-community";

import {
  AllCommunityModule,
  ClientSideRowModelModule,
  TextFilterModule,
  DateFilterModule,
  type ColDef,
  type GetRowIdFunc,
  ModuleRegistry,
} from "ag-grid-community";

import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";

import { AgGridReact } from "ag-grid-react";
import { RawDataItem } from "../../../../types/data";
import styles from "./DataTable.module.css";
import { TopBar } from "../../../TopBar/TopBar";
import { documentationColumns, cuentaColumns } from "./DataTableConfig";
import { toast } from "react-hot-toast";
import { sleep } from "../../../../utils/functions";
export interface Props {
  gridTheme?: string;
  isDarkMode?: boolean;
  gridHeight?: number | null;
  updateInterval?: number;
  mode: "cuenta" | "documentacion";
}

ModuleRegistry.registerModules([
  AllCommunityModule,
  ClientSideRowModelModule,
  TextFilterModule,
  DateFilterModule,
]);
export const formatearFecha = (fecha: string) => {
  const parsedDate = parseISO(fecha);
  return formatInTimeZone(parsedDate, "Europe/Madrid", "dd-MM-yyyy HH:mm:ss");
};

export const DataTable: React.FC<Props> = ({
  gridTheme = "ag-theme-quartz",
  isDarkMode = false,
  gridHeight = null,
  mode,
}) => {
  const [rowData, setRowData] = useState<RawDataItem[]>([]);
  const hasLoadedRef = useRef(false);

  useEffect(() => {
    if (hasLoadedRef.current) return;
    hasLoadedRef.current = true;

    let cancelled = false;

    const waitForFormApi = async () => {
      console.log("Waiting for formApi...");
      while (!window.parent?.formApi?.getDocumentacionData) {
        console.log("formApi not ready yet, waiting...");
        if (cancelled) return;
        await new Promise((r) => setTimeout(r, 100));
      }
    };

    const loadData = async () => {
      try {
        await waitForFormApi();
        console.log("formApi is ready, loading data...");
        const data = await window.parent!.formApi!.getDocumentacionData();
        console.log("Data loaded:", data);
        setRowData(data ?? []);
      } catch (err) {
        console.error("Data loading failed:");
        setRowData([]);
      } finally {
        if (cancelled) return;
      }
    };

    loadData();

    return () => {
      cancelled = true;
    };
  }, []);

  const [quickFilterText, setQuickFilterText] = useState("");
  const [selectedRows, setSelectedRows] = useState<RawDataItem[]>([]);

  const gridRef = useRef<AgGridReact>(null);

  const refreshData = useCallback(async () => {
    try {
      await sleep(1500);
      const data = await window.parent.formApi.getDocumentacionData();

      const normalizedData = data.map((row) => ({
        ...row,
        createdon: row.createdon ? new Date(row.createdon) : null,
        modifiedon: row.modifiedon ? new Date(row.modifiedon) : null,
      }));
      console.log("Data refreshed:", normalizedData);
      setRowData(normalizedData);
    } catch (err) {
      console.error("refreshData error:", err);
    }
  }, []);

  const updateRevisado = async (id: string, revisado: boolean) => {
    const payload = rowData?.find((row) => row.osp_documentacionid === id);
    if (!payload) {
      toast.error("No se encontró el registro");
      return;
    }
    const newPayload = {
      documentacionId: payload.osp_documentacionid,
      descripcion: payload.osp_descripcion,
      tipificacionValue: payload.osp_tipificacion,
      categoriaValue: payload.osp_categoria,
      subcategoriaValue: payload.osp_subcategoria,
      fileName: payload.osp_nombre,
      revisado: revisado,
    };
    console.log("Updating revisado with payload:", newPayload);
    try {
      const res = await window.parent!.formApi!.updateRecord(newPayload);
      if (res && res !== "OK") throw new Error("HTTP error");
      toast.success("Revisado editado con éxito");
      await refreshData();
    } catch (err) {
      console.error("Edit failed:", err);
      toast.error("Error al editar el revisado");
    }
  };
  const colCuentaDefs = useMemo(
    () => cuentaColumns(refreshData),
    [refreshData],
  );
  const colDocumentationDefs =
    mode === "documentacion"
      ? useMemo(
          () => documentationColumns(refreshData, updateRevisado),
          [refreshData, updateRevisado],
        )
      : [];

  const defaultColDef = useMemo<ColDef>(
    () => ({
      flex: 1,
      sortable: true,
      filter: true,
      resizable: true,
      cellStyle: { justifyContent: "center" },
      enableCellChangeFlash: true,
    }),
    [],
  );
  const getRowId = useCallback<GetRowIdFunc>(
    ({ data }) => data.osp_documentacionid,
    [],
  );
  const themeClass = `${gridTheme}${isDarkMode ? "-dark" : ""}`;
  const onSelectionChanged = useCallback((event: SelectionChangedEvent) => {
    const selectedRows = event.api.getSelectedRows();
    setSelectedRows(selectedRows);
    console.log(selectedRows);
  }, []);
  const detailCellRendererParams = useMemo(() => {
    return {
      refreshStrategy: "everything",
      detailGridOptions: {},
    };
  }, []);
  return (
    <div
      style={gridHeight ? { height: gridHeight } : {}}
      className={`${themeClass} ${styles.grid} ${
        gridHeight ? "" : styles.gridHeight
      }`}
    >
      <TopBar
        quickFilterText={quickFilterText}
        setQuickFilterText={setQuickFilterText}
        selectedRows={selectedRows}
        refreshData={refreshData}
      />

      <AgGridReact
        theme="legacy"
        ref={gridRef}
        onGridReady={() => {
          gridRef.current?.api.refreshCells({ force: true });
        }}
        quickFilterText={quickFilterText}
        getRowId={getRowId}
        onStoreRefreshed={() => {
          refreshData();
        }}
        rowData={rowData}
        columnDefs={mode === "cuenta" ? colCuentaDefs : colDocumentationDefs}
        detailCellRendererParams={detailCellRendererParams}
        defaultColDef={defaultColDef}
        pagination={true}
        paginationPageSize={10}
        noRowsOverlayComponent={() => (
          <div style={{ padding: 20 }}>No data available</div>
        )}
        loadingOverlayComponent={() => (
          <div style={{ padding: 20 }}>
            <i className="fas fa-spinner fa-pulse" /> Cargando datos...
          </div>
        )}
        paginationPageSizeSelector={false}
        onSelectionChanged={onSelectionChanged}
        rowSelection={{
          mode: "multiRow",
          headerCheckbox: true,
          enableClickSelection: false,
        }}
        domLayout="autoHeight"
      />
    </div>
  );
};
