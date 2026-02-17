import React from "react";
import ReactDOM from "react-dom/client";

import { initializeIcons } from "@fluentui/react";
import { Toaster } from "react-hot-toast";
import { DataTableProvider } from "./components/DataTable/components/DataTable/DataTableContext";
import { DataTable } from "./components/DataTable/components/DataTable/DataTable";

initializeIcons();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <DataTableProvider>
      <Toaster position="top-right" />
      <DataTable />
    </DataTableProvider>
  </React.StrictMode>,
);
