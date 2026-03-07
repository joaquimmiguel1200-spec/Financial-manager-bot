import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { securityService } from "./services/securityService";

// Apply Content Security Policy
securityService.applyCSPHeaders();

// Security: Freeze critical prototypes to prevent pollution attacks
if (typeof Object.freeze === 'function') {
  Object.freeze(Object.prototype);
}

createRoot(document.getElementById("root")!).render(<App />);
