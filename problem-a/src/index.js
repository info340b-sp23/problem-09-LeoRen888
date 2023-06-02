import React from "react";
import ReactDOM from "react-dom/client";
import "bootstrap/dist/css/bootstrap.css";
import "./style.css";
import "whatwg-fetch";
import App from "./components/App";
import { BrowserRouter } from "react-router-dom";

const root = ReactDOM.createRoot(document.getElementById("root"));
const { render } = root;
render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);

