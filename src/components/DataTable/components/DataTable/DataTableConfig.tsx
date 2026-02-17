import { ColDef } from "ag-grid-enterprise";
import { ColumnConfig } from "../../../../types/dataTypes";
import { doesFilterPass, formatDate } from "../../../../utils/functions";
import { OptionsCellRenderer } from "../../../../renders/OptionsCellRenderer";
import SetFilter from "./SetFilter";

const buildTextColumn = (c: ColumnConfig): ColDef => ({
  field: c.field,
  headerName: c.headerName,
  minWidth: 150,
  filter: c.isSet
    ? { component: SetFilter, doesFilterPass: doesFilterPass }
    : "agTextColumnFilter",
  filterParams: {
    useForm: true,
  },
  resizable: true,
  getQuickFilterText: () => "",
});

const buildBooleanColumn = (
  c: ColumnConfig,
  onChange?: (value: boolean, row: any) => void,
): ColDef => ({
  field: c.field,
  headerName: c.headerName,
  minWidth: 100,
  filter: "agSetColumnFilter",
  editable: true,
  cellRenderer: "agCheckboxCellRenderer",
  cellEditor: "agCheckboxCellEditor",
  valueGetter: ({ data }) => !!data?.[c.field],
  cellStyle: { justifyContent: "center", display: "flex" },
  onCellValueChanged: (params) => {
    if (onChange) {
      onChange(params.newValue, params.data as any);
    }
  },
});

const buildDateColumn = (c: ColumnConfig): ColDef => ({
  field: c.field,
  headerName: c.headerName,
  minWidth: 180,
  filter: "agDateColumnFilter",
  valueGetter: ({ data }) => data?.[c.field] ?? null,
  valueFormatter: ({ value }) => (value ? formatDate(value) : ""),
  filterParams: {
    filterOptions: ["lessThan", "greaterThan", "inRange", "equals"],
    suppressAndOrCondition: true,
    comparator: (filterDate: Date, cellValue: Date) => {
      if (!(cellValue instanceof Date)) return -1;
      const cell = new Date(
        cellValue.getFullYear(),
        cellValue.getMonth(),
        cellValue.getDate(),
      );
      if (cell < filterDate) return -1;
      if (cell > filterDate) return 1;
      return 0;
    },
  },
});

export function buildColumnsFromConfig(
  configs: ColumnConfig[],
  opts?: {
    onBooleanChange?: (value: boolean, row: any) => void;
    refreshData?: () => Promise<void>;
  },
): ColDef[] {
  return configs.map((c) => {
    let base: ColDef;

    switch (c.type) {
      case "text":
        base = buildTextColumn(c);
        break;

      case "date":
        base = buildDateColumn(c);
        break;

      case "boolean":
        base = buildBooleanColumn(c, opts?.onBooleanChange);
        break;

      default:
        base = buildTextColumn(c);
    }

    // ✅ special behavior for first column only
    if (c.hasOptions && opts?.refreshData) {
      base = {
        ...base,
        minWidth: 200,
        cellRenderer: OptionsCellRenderer,
        cellRendererParams: {
          refreshData: opts.refreshData,
        },
        getQuickFilterText: (params: any) => params.value ?? "",
      };
    }

    // merge explicit overrides LAST so they always win
    return {
      ...base,
      ...c.override,
    };
  });
}
