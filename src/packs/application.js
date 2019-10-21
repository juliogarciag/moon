import React from "react";
import "core-js/stable";
import "regenerator-runtime/runtime";
import ReactDom from "react-dom";
import App from "components/App";

function renderApp(AppComponent) {
  ReactDom.render(<AppComponent />, document.getElementById("root"));
}

if (module.hot) {
  module.hot.accept("components/App.js", () => {
    const HotLoadedApp = require("components/App.js").default;
    renderApp(HotLoadedApp);
  });
}

window.addEventListener("DOMContentLoaded", () => {
  renderApp(App);
});
