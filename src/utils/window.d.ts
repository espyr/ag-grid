import { Mode, RawDataItem } from "../types/dataTypes";

export {};

declare global {
  interface FormApi {
    getDocumentacionData(): Promise<RawDataItem[]>;
    getUrlSharepoint(): Promise<string>;
    uploadFile(payload: {
      documentacionId?: string;
      descripcion?: string;
      tipificacion?: number | null;
      categoria?: number | null;
      subcategoria?: number | null;
      fileName?: string;
      fileBase64?: string;
    }): Promise<res>;
    isFileExist(fileName: string): Promise<string>;
    updateRecord(payload: {
      documentacionId: string;
      descripcion?: string;
      tipificacionValue?: number | null;
      categoriaValue?: number | null;
      subcategoriaValue?: number | null;
      fileName?: string;
      revisado?: boolean;
    }): Promise<res>;
    isAdmin(): Promise<boolean>;
    deleteRecord(documentacionIds: string[]): Promise<res>;
    getEntidad(): Promise<Mode>;
    getOptionSet(nombreCampo: string, entidad: string): Promise<any>;
    getValidado(): Promise<boolean>;
    getColumns(entidad: string): Promise<ColumnConfig[]>;
  }

  interface Window {
    formApi: FormApi;
  }
}
