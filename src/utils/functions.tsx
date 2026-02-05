import moment from "moment";

export const sleep = (ms: number) => new Promise((res) => setTimeout(res, ms));

export const getTextByKey = (
  listOfOptions: { [key: number]: { key: number; text: string }[] },
  keyToFind: number,
): string | undefined => {
  for (const opciones of Object.values(listOfOptions)) {
    console.log(`Searching for key ${keyToFind} in options:`, opciones);
    const found = opciones.find((opt) => opt.key === keyToFind);
    if (found) {
      console.log(`Found text for key ${keyToFind}: ${found.text}`);
      return found.text;
    }
  }
  return undefined;
};
export const formatDate = (fechaCadena: string | null | undefined): string => {
  if (!fechaCadena) return "";
  const m = moment(fechaCadena);
  return m.isValid() ? m.format("DD/MM/YYYY HH:mm") : String(fechaCadena);
};
