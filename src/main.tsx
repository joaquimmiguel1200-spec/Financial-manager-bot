import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { securityService } from "./services/securityService";

// Apply Content Security Policy
securityService.applyCSPHeaders();

createRoot(document.getElementById("root")!).render(<App />);
