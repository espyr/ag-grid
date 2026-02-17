import moment from "moment";

export const sleep = (ms: number) => new Promise((res) => setTimeout(res, ms));

export const getTextByKey = (
  listOfOptions: { [key: number]: { key: number; text: string }[] },
  keyToFind: number,
): string | undefined => {
  for (const opciones of Object.values(listOfOptions)) {
    const found = opciones.find((opt) => opt.key === keyToFind);
    if (found) {
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
export const waitForFormApi = async () => {
  while (!window.parent?.formApi) {
    await new Promise((r) => setTimeout(r, 100));
  }
};
export function groupByParent(list: any[], parentField: string) {
  return list.reduce(
    (acc, item) => {
      const parent = item[parentField];
      if (!acc[parent]) acc[parent] = [];
      acc[parent].push({ key: item.key, text: item.text });
      return acc;
    },
    {} as Record<number, any[]>,
  );
}
