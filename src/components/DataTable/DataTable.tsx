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
  type GetRowIdParams,
  ModuleRegistry,
} from "ag-grid-community";

import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";

import { AgGridReact } from "ag-grid-react";
import { getData } from "../../data";
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
  const [rowData, setRowData] = useState(
    getData().map((row) => ({
      ...row,
      createdon: row.createdon ? new Date(row.createdon) : null,
      modifiedon: row.modifiedon ? new Date(row.modifiedon) : null,
    }))
  );
  const [quickFilterText, setQuickFilterText] = useState("");
  const [selectedRows, setSelectedRows] = useState<any[]>([]);

  const gridRef = useRef<AgGridReact>(null);

  const colDefs = useMemo<ColDef[]>(() => columns, []);

  const defaultColDef = useMemo<ColDef>(
    () => ({
      flex: 1,
      sortable: true,
      filter: true,
      resizable: true,
      cellStyle: { justifyContent: "center" },
    }),
    []
  );

  const getRowId = useCallback<GetRowIdFunc>(
    ({ data: { id } }: GetRowIdParams) => id,
    []
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
        paginationPageSizeSelector={false}
        onSelectionChanged={onSelectionChanged}
        rowSelection={{
          mode: "multiRow",
          headerCheckbox: true,
          enableClickSelection: false,
        }}
      />
    </div>
  );
};
