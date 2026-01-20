import React from "react";
import ReactDOM from "react-dom/client";

import { DataTable } from "./components/DataTable/DataTable";
import { initializeIcons } from "@fluentui/react";

initializeIcons();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <DataTable />
  </React.StrictMode>
);
