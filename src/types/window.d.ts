import { RawDataItem } from "./data";

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
  }

  interface Window {
    formApi: FormApi;
  }
}
