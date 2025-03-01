import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { ChakraProvider } from "@chakra-ui/react";
import { BrowserRouter } from "react-router";
import MyProvider from "./context/provider.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <MyProvider>
        <ChakraProvider>
          <App />
        </ChakraProvider>
      </MyProvider>
    </BrowserRouter>
  </StrictMode>
);
