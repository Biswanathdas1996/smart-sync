import React from "react";
import App from "./App";
import "./App.css";
// import { BrowserRouter as Router} from "react-router-dom";
import * as ReactDOM from "react-dom/client";
import { store } from "./redux/store";
import { Provider } from "react-redux";
import { HashRouter as Router } from "react-router-dom";

const rootElement = document.getElementById("app");
ReactDOM.createRoot(rootElement).render(
  <Router>
    <Provider store={store}>
      <App />
    </Provider>
  </Router>
);
