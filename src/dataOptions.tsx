export interface tipificacionOption {
  key: number;
  text: string;
}
export interface categoriaOption {
  [key: number]: { key: number; text: string }[];
}
export interface subcategoriaOption {
  [key: number]: { key: number; text: string }[];
}
export const tipificacionOptions: tipificacionOption[] = [
  { key: 0, text: "" },
  { key: 863920000, text: "Requisitos Clientes" },
  { key: 863920001, text: "PdN" },
  { key: 863920002, text: "Oferta de Clientes" },
  { key: 863920003, text: "Contratos" },
  { key: 863920004, text: "Anexos y envios de cliente" },
  { key: 863920005, text: "Bid Reviews" },
  { key: 863920006, text: "EVs" },
  { key: 863920007, text: "Ofertas de terceros" },
  { key: 863920008, text: "Autorizaciones Internas" },
  { key: 863920009, text: "Preciario sin WAOC" },
  { key: 863920010, text: "Handover Preventa" },
  { key: 863920011, text: "Traspaso Operaciones" },
  { key: 863920012, text: "Documentacion de proyecto y provisión" },
  { key: 863920013, text: "Informacion Adicional" },
];
export const categoriaOptions: categoriaOption = {
  863920000: [
    { key: 25, text: "Pliegos (RFP, RFQ)" },
    { key: 18, text: "Inventario de requisitos" },
    { key: 24, text: "Otros" },
  ],
  863920001: [
    { key: 32, text: "PT Cloud" },
    { key: 33, text: "PT Fijo" },
    { key: 34, text: "PT Movil" },
    { key: 42, text: "PT DISPATCHING" },
    { key: 3, text: "ARO" },
    { key: 24, text: "Otros" },
  ],
  863920002: [
    { key: 21, text: "Oferta económica" },
    { key: 22, text: "Oferta técnica" },
    { key: 30, text: "Presentaciones" },
    { key: 24, text: "Otros" },
  ],
  863920003: [],
  863920004: [
    { key: 27, text: "Portabilidad Fijo" },
    { key: 28, text: "Portabilidad Móvil" },
    { key: 4, text: "Autorizaciones cliente" },
    { key: 12, text: "Envios por mail" },
    { key: 24, text: "Otros" },
  ],
  863920005: [
    { key: 15, text: "Facturacion" },
    { key: 23, text: "Operativas" },
    { key: 40, text: "Tecnicas" },
    { key: 26, text: "PMO" },
    { key: 24, text: "Otros" },
  ],
  863920006: [
    { key: 17, text: "Iniciales" },
    { key: 9, text: "Concreción" },
    { key: 14, text: "Estudios de cobertura en autoservicio" },
    { key: 36, text: "Red" },
    { key: 24, text: "Otros" },
  ],
  863920007: [
    { key: 11, text: "Documentos tras procedimientos IVALUA" },
    { key: 20, text: "Oferta de proveedores" },
    { key: 10, text: "Documentación del proveedor" },
    { key: 24, text: "Otros" },
  ],
  863920008: [
    { key: 5, text: "Autorizaciones internas Contratación" },
    { key: 6, text: "Autorizaciones internas KAM" },
  ],
  863920009: [],
  863920010: [
    { key: 0, text: "Actas" },
    { key: 37, text: "Resumen de proyecto" },
    { key: 13, text: "Esquemas" },
    { key: 24, text: "Otros" },
  ],
  863920011: [
    { key: 29, text: "Presentacion Kick Off" },
    { key: 1, text: "Actas de reunión" },
    { key: 16, text: "HLD" },
    { key: 24, text: "Otros" },
  ],
  863920012: [
    { key: 19, text: "Plantilla Datos administrativos" },
    { key: 8, text: "Centrex" },
    { key: 39, text: "SIP Trunk" },
    { key: 7, text: "CBT" },
    { key: 35, text: "QoS" },
    { key: 31, text: "Primarios móviles" },
    { key: 38, text: "RPV /Oficina Plus" },
    { key: 2, text: "Anexo de cualificacion LAM" },
    { key: 43, text: "Configuración RPV" },
    { key: 24, text: "Otros" },
  ],
  863920013: [],
};
export const subcategoriaOptions: subcategoriaOption = {
  17: [
    { key: 0, text: "Accesos Fijos" },
    { key: 1, text: "Cobertura Movil" },
    { key: 2, text: "Otros" },
  ],
  9: [
    { key: 0, text: "Accesos Fijos" },
    { key: 1, text: "Cobertura Movil" },
    { key: 2, text: "Otros" },
  ],
};
