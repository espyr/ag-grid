import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { toast } from "react-hot-toast";
import { ColumnConfig, Mode, RawDataItem } from "../../../../types/dataTypes";
import { buildColumnsFromConfig } from "./DataTableConfig";
import { sleep, waitForFormApi } from "../../../../utils/functions";

interface OptionsState {
  tipificaciones: any[];
  categorias: any;
  subcategorias: any;
}

interface Ctx {
  mode: Mode | undefined;
  options: OptionsState;
  columns: any[];
  rowData: RawDataItem[];
  refreshData: () => Promise<void>;
}

const DataTableContext = createContext<Ctx | null>(null);

export const useDataTable = () => {
  const ctx = useContext(DataTableContext);
  if (!ctx) throw new Error("useDataTable must be used inside provider");
  return ctx;
};

export const DataTableProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [mode, setMode] = useState<Mode>();

  const [options, setOptions] = useState<OptionsState>({
    tipificaciones: [],
    categorias: {},
    subcategorias: {},
  });

  const [rowData, setRowData] = useState<any[]>([]);
  const [columnsConfig, setColumnsConfig] = useState<ColumnConfig[]>([]);
  // -------------------------[]
  // LOAD DATA
  // -------------------------

  const refreshData = useCallback(async () => {
    console.log("Refreshing data...");
    try {
      sleep(500); // Simula un retraso para esperar a que formApi esté listo
      await waitForFormApi();
      const data = await window.parent!.formApi!.getDocumentacionData();
      const normalized = data.map((r: any) => ({
        ...r,
        createdon: r.createdon ? new Date(r.createdon) : null,
        modifiedon: r.modifiedon ? new Date(r.modifiedon) : null,
      }));
      console.log("Data loaded:", normalized);
      setRowData(normalized);
    } catch (err) {
      toast.error("Data loading failed");
      setRowData([]);
    }
  }, []);

  // -------------------------
  // LOAD OPTIONS AND MODE
  // -------------------------
  useEffect(() => {
    const loadMode = async () => {
      waitForFormApi().then(async () => {
        const entidad = await window.parent.formApi.getEntidad();
        setMode(entidad);
        const columns = await window.parent.formApi.getColumns(entidad);
        setColumnsConfig(columns);
        if (entidad && entidad === "opportunity") {
          const tipificacionOptions = await window.parent.formApi.getOptionSet(
            "osp_tipificacion",
            "osp_documentacion",
          );
          const categoriaOptions = await window.parent.formApi.getOptionSet(
            "osp_categoria",
            "osp_documentacion",
          );
          const subcategoriaOptions = await window.parent.formApi.getOptionSet(
            "osp_subcategoria",
            "osp_documentacion",
          );

          const res = {
            tipificaciones: tipificacionOptions,
            categorias: categoriaOptions,
            subcategorias: subcategoriaOptions,
          };
          setOptions(res);
        }
        if (entidad === "account") {
          const tipificacionCuentaOptions =
            await window.parent.formApi.getOptionSet(
              "osp_tipificacioncuenta",
              "osp_documentacion",
            );
          const res = {
            tipificaciones: tipificacionCuentaOptions,
            categorias: {},
            subcategorias: {},
          };
          setOptions(res);
        }
      });
    };
    loadMode();
    refreshData();
  }, [mode]);

  // -------------------------
  // BUILD COLUMNS
  // -------------------------
  const updateRevisado = async (revisado: boolean, row: any) => {
    const newPayload = {
      documentacionId: row.osp_documentacionid,
      descripcion: row.osp_descripcion,
      tipificacionValue: row.osp_tipificacionValue,
      categoriaValue: row.osp_categoriaValue,
      subcategoriaValue: row.osp_subcategoriaValue,
      fileName: row.osp_nombre,
      revisado,
    };

    const res = await window.parent!.formApi!.updateRecord(newPayload);

    if (res && res !== "OK") throw new Error("HTTP error");

    toast.success("Revisado editado con éxito");
    await refreshData();
  };

  const columns = useMemo(() => {
    return buildColumnsFromConfig(columnsConfig, {
      onBooleanChange: updateRevisado,
      refreshData,
    });
  }, [mode, options, updateRevisado, refreshData]);

  return (
    <DataTableContext.Provider
      value={{
        mode,
        options,
        columns,
        rowData,
        refreshData,
      }}
    >
      {children}
    </DataTableContext.Provider>
  );
};
