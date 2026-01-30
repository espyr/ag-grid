import { RawDataItem } from "../types/data";

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
    isFileExist(fileName: string): Promise<boolean>;
    updateRecord(payload: {
      documentacionId: string;
      descripcion?: string;
      tipificacionValue?: number | null;
      categoriaValue?: number | null;
      subcategoriaValue?: number | null;
      fileName?: string;
    }): Promise<res>;
    isAdmin(): Promise<boolean>;
  }

  interface Window {
    formApi: FormApi;
  }
}
