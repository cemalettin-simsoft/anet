import "bootstrap/dist/css/bootstrap.min.css"
import "index.css"
import "locale-compare-polyfill"
import App from "pages/App"
import React from "react"
import { render } from "react-dom"
import { BrowserRouter, Route } from "react-router-dom"

const RootApp = () => {
  return (
    <React.StrictMode>
      <BrowserRouter>
        <Route path="/" component={App} />
      </BrowserRouter>
    </React.StrictMode>
  )
}

render(<RootApp />, document.getElementById("root"))
