import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import ChatWidget from "./ChatWidget";

import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    TEST SITE
    <ChatWidget />
  </StrictMode>,
);