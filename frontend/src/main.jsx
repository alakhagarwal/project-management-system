import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

// 1. Import Mantine's core CSS (Must be at the top)
import "@mantine/core/styles.css";

// 2. Import Mantine Notifications CSS
import "@mantine/notifications/styles.css";

// 3. Import the Providers
import { MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";

import "./index.css";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    {/* Wrap with MantineProvider and Notifications */}
    <MantineProvider>
      <Notifications />
      <App />
    </MantineProvider>
  </StrictMode>,
);
