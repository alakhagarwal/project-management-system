import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

// 1. Import Mantine's core CSS (Must be at the top)
import "@mantine/core/styles.css";

// 2. Import the Provider
import { MantineProvider } from "@mantine/core";

import "./index.css";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    {/* 3. Wrap your App component with MantineProvider */}
    <MantineProvider>
      <App />
    </MantineProvider>
  </StrictMode>,
);
