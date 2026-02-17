# Enterprise Generic DataTable (AG Grid + React + Dynamic Config)

## Overview

This is a fully generic, enterprise‑grade DataTable component built
with:

- React
- AG Grid
- Context API
- Dynamic backend‑driven column configuration
- Fully reusable architecture

Supports any entity like:

- account
- opportunity
- custom entities

Without changing frontend code.

---

# Architecture Diagram

    Backend (formApi)
       │
       ├── getEntidad()
       ├── getColumns()
       ├── getDocumentacionData()
       └── updateRecord()
       │
       ▼
    DataTableProvider (Context)
       │
       ├── loads mode
       ├── loads columns config
       ├── loads options
       ├── loads row data
       │
       ▼
    buildColumnsFromConfig()
       │
       ▼
    DataTable (AG Grid)
       │
       ├── render columns
       ├── render rows
       ├── editing
       ├── filtering
       └── pagination

---

# Installation

```bash
npm install ag-grid-community ag-grid-react ag-grid-enterprise
npm install react-hot-toast
npm install date-fns date-fns-tz
```

---

# Basic Usage

## Wrap your component

```tsx
<DataTableProvider>
  <DataTable />
</DataTableProvider>
```

---

# Backend Requirements (formApi)

Must expose:

```ts
window.parent.formApi = {

  async getEntidad() {
     return "account"
  },

  async getColumns(entidad) {
     return ColumnConfig[]
  },

  async getDocumentacionData() {
     return []
  },

  async updateRecord(payload) {
     return "OK"
  },

  async getOptionSet(field, entity) {
     return {}
  }
}
```

---

# ColumnConfig Definition

CONFIG
↓
buildTextColumn / buildDateColumn / buildBooleanColumn
↓
AG-Grid ColDef
↓
render en tabla

field: Es la propiedad del objeto rowData.
headerName: Es el texto visible en la cabecera.
type: Define cómo se construye la columna. (buildTextColumn/buildDateColumn/buildBooleanColumn)
isSet: Activa filtro tipo SetFilter, filtro por opciones sino sera por texto libre
hasOptions: Activa menu con opciones

```ts
interface ColumnConfig {
  field: string;

  headerName: string;

  type: "text" | "date" | "boolean";

  isSet?: boolean;

  hasOptions: boolean;

  override?: Partial<ColDef>;
}
```

---

# Example Backend ColumnConfig

```ts
return [
 {
   field: "osp_nombre",
   headerName: "Nombre",
   type: "text",
   hasOptions: true
 },
 {
   field: "createdon",
   headerName: "Fecha creación",
   type: "date"
 },
 {
   field: "osp_revisado",
   headerName: "Revisado",
   type: "boolean"
 ,
 {
    field: "osp_tipificacion",
    headerName: "Tipificacion",
    type: "text",
    isSet:true
  },
}
]
```

---

# Features

## Automatic

- column generation
- filters
- sorting
- pagination
- editing
- refresh

## Smart rendering

Automatically uses:

- checkbox for boolean
- date formatter
- custom renderer support

---

# Using Context

```ts
const { columns, rowData, refreshData, options, mode } = useDataTable();
```

---

# Custom Cell Renderer Example

```ts
{
 field: "name",
 cellRenderer: MyRenderer
}
```

---

# Refresh Data

```ts
await refreshData();
```

---

# Storybook Example

```tsx
export const Default = () => (
  <DataTableProvider>
    <DataTable gridHeight={500} />
  </DataTableProvider>
);
```

---

# Mock formApi Example

```ts
window.parent.formApi = {
  getEntidad: async () => "account",

  getColumns: async () => [
    {
      field: "name",
      headerName: "Name",
      type: "text",
    },
  ],

  getDocumentacionData: async () => [
    {
      id: "1",
      name: "Test",
    },
  ],

  updateRecord: async () => "OK",
};
```

---

# Extend Example

You can reuse this table for any entity:

    users
    documents
    contracts
    products
    customers

No frontend changes required.

---

# Enterprise Benefits

- Fully reusable
- Backend driven
- Type safe
- Scalable
- Clean architecture
- Separation of concerns

---

# Recommended Folder Structure

    components/
      DataTable/
         DataTable.tsx
         DataTableContext.tsx
         DataTableConfig.ts

    hooks/

    renders/

    types/

    utils/

---

# Production Ready

This architecture is safe for:

- enterprise apps
- CRM systems
- dashboards
- admin panels

---

# Author

Enterprise reusable DataTable architecture
