import { createRoot } from "react-dom/client";
import "@fontsource/playfair-display/latin-400.css";
import "@fontsource/playfair-display/latin-700.css";
import "@fontsource/playfair-display/latin-400-italic.css";
import "@fontsource/playfair-display/latin-ext-400.css";
import "@fontsource/playfair-display/latin-ext-700.css";
import "@fontsource/playfair-display/latin-ext-400-italic.css";
import "@fontsource/raleway/latin-400.css";
import "@fontsource/raleway/latin-500.css";
import "@fontsource/raleway/latin-700.css";
import "@fontsource/raleway/latin-ext-400.css";
import "@fontsource/raleway/latin-ext-500.css";
import "@fontsource/raleway/latin-ext-700.css";
import App from "./App.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(<App />);
