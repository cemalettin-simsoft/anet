import "bootstrap/dist/css/bootstrap.min.css"
import React from "react"
import { render } from "react-dom"
import { BrowserRouter, Route } from "react-router-dom"
import "./index.css"
import App from "./pages/App"

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
