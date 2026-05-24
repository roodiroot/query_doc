import React from "react";
import { createRoot } from "react-dom/client";
import ChatWidget from "./ChatWidget";
import styles from "./index.css?inline";

const rootElement = document.createElement("div");
const styleElement = document.createElement("style");

styleElement.textContent = styles;

rootElement.id = "assistant-widget-root";

document.body.appendChild(rootElement);
document.head.appendChild(styleElement);

createRoot(rootElement).render(
  <React.StrictMode>
    <ChatWidget />
  </React.StrictMode>
);