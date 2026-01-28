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
import { RawDataItem } from "../../types/data";
import { columns } from "./DataTableConfig";
import styles from "./DataTable.module.css";
import { TopBar } from "../TopBar/TopBar";
export interface Props {
  gridTheme?: string;
  isDarkMode?: boolean;
  gridHeight?: number | null;
  updateInterval?: number;
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
}) => {
  const [rowData, setRowData] = useState<RawDataItem[] | null>(null);
  const hasLoadedRef = useRef(false);

  useEffect(() => {
    if (hasLoadedRef.current) return;
    hasLoadedRef.current = true;

    let cancelled = false;

    const waitForFormApi = async () => {
      while (!window.parent?.formApi?.getDocumentacionData) {
        if (cancelled) return;
        await new Promise((r) => setTimeout(r, 100));
      }
    };

    const loadData = async () => {
      try {
        await waitForFormApi();
        const data = await window.parent!.formApi!.getDocumentacionData();
        setRowData(data ?? []);
      } catch (err) {
        console.error(err);
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
  const updateRevisado = async (id: string, revisado: boolean) => {
    const payload = rowData?.find((row) => row.osp_documentacionid === id);
    const newPayload = { ...payload, osp_revisado: revisado };
    console.log("newPayload:", newPayload);

    try {
      const res = await fetch("/api/updateRevisado", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newPayload),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      console.log("Revisado updated successfully");
      refreshData();
    } catch (err) {
      console.error("Failed to update Revisado:", err);
    }
  };
  const refreshData = useCallback(async () => {
    const data = await window.parent?.formApi?.getDocumentacionData();
    const newData =
      data &&
      data.map((row) => ({
        ...row,
        createdon: row.createdon ? new Date(row.createdon) : null,
        modifiedon: row.modifiedon ? new Date(row.modifiedon) : null,
      }));

    newData && setRowData(newData);
    console.log("Data refreshed");
  }, []);
  const colDefs = useMemo<ColDef[]>(
    () => columns(refreshData, updateRevisado),
    [],
  );

  const defaultColDef = useMemo<ColDef>(
    () => ({
      flex: 1,
      sortable: true,
      filter: true,
      resizable: true,
      cellStyle: { justifyContent: "center" },
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
        quickFilterText={quickFilterText}
        getRowId={getRowId}
        rowData={rowData}
        columnDefs={colDefs}
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
