import { RawDataItem } from "../data";

declare global {
  interface Window {
    formApi: {
      getDocumentacionData: () => RawDataItem[];
    };
  }
}
export {};
