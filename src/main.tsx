import React from "react";
import ReactDOM from "react-dom/client";

import { DataTable } from "./components/DataTable/components/DataTable/DataTable";
import { initializeIcons } from "@fluentui/react";
import { Toaster } from "react-hot-toast";

initializeIcons();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Toaster position="top-right" />
    <DataTable mode="documentacion" />
  </React.StrictMode>,
);
