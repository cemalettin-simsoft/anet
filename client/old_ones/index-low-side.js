import App from "App"
import "bootstrap/dist/css/bootstrap.css"
import { jumpToTop } from "components/Page"
import "index.css"
// import "index.css"
import "locale-compare-polyfill"
import React from "react"
import ReactDOM from "react-dom"
import { BrowserRouter, Route } from "react-router-dom"

ReactDOM.render(
  <BrowserRouter onUpdate={jumpToTop}>
    <Route path="/" component={App} />
  </BrowserRouter>,
  document.getElementById("root")
)
