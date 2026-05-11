import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import EtherframeShell from "./app/EtherframeShell";
import "./styles/globals.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <EtherframeShell />
  </BrowserRouter>
);
