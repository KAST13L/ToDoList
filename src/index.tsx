import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import "./i18n";
import { App } from "./app/App";
import { Provider } from "react-redux";
import { store } from "./app/store";
import { HashRouter } from "react-router-dom";

ReactDOM.render(
  <HashRouter>
    <Provider store={store}>
      <App />
    </Provider>
  </HashRouter>,
  document.getElementById("root")
);
