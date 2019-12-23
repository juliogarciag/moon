import React from "react";
import "core-js/stable";
import "regenerator-runtime/runtime";
import ReactDom from "react-dom";
import Modal from "react-modal";
import { configure } from "react-hotkeys";
import App from "components/App";

function renderApp(AppComponent) {
  const root = document.getElementById("root");
  Modal.setAppElement(root);
  ReactDom.render(<AppComponent />, root);
}

configure({ ignoreRepeatedEventsWhenKeyHeldDown: false });

if (module.hot) {
  module.hot.accept("components/App/index.js", () => {
    const HotLoadedApp = require("components/App/index.js").default;
    renderApp(HotLoadedApp);
  });
}

window.addEventListener("DOMContentLoaded", () => {
  renderApp(App);
});
