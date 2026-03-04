import React, { useCallback, useMemo, useRef, useState } from "react";
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
  CustomFilterModule,
} from "ag-grid-community";

import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import { AG_GRID_LOCALE_ES } from "@ag-grid-community/locale";

import { AgGridReact } from "ag-grid-react";
import { RawDataItem } from "../../../../types/dataTypes";
import styles from "./DataTable.module.css";
import { TopBar } from "../../../TopBar/TopBar";
import { useDataTable } from "./DataTableContext";
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
  const { columns, rowData, refreshData } = useDataTable();
  const [quickFilterText, setQuickFilterText] = useState("");
  const [selectedRows, setSelectedRows] = useState<RawDataItem[]>([]);

  const gridRef = useRef<AgGridReact>(null);
  const defaultColDef = useMemo<ColDef>(
    () => ({
      flex: 1,
      sortable: true,
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
      />

      <AgGridReact
        modules={[CustomFilterModule]}
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
        columnDefs={columns}
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
        localeText={AG_GRID_LOCALE_ES}
        rowSelection={{
          mode: "multiRow",
          headerCheckbox: true,
          enableClickSelection: false,
        }}
        domLayout="autoHeight"
        enableFilterHandlers={true}
      />
    </div>
  );
};
