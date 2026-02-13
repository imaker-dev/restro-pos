import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "../src/css/style.css";
import { BrowserRouter as Router } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./store.js";
import { Toaster } from "react-hot-toast";
import { ToastContainer } from "react-toastify";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <Router>
         <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        draggable
        theme="light"
      />
        <Toaster position="top-center" />
        <App />
      </Router>
    </Provider>
  </StrictMode>,
);
