import { Route, Switch } from "react-router-dom"
import Help from "./Help"
import Home from "./Home"
import EditReport from "./report/Edit"
import NewReport from "./report/New"
import ShowReport from "./report/Show"
import { PAGE_URLS } from "./utils"

const Routing = () => {
  return (
    <Switch>
      <Route exact path={PAGE_URLS.HOME} component={Home} />
      <Route
        path={PAGE_URLS.REPORTS}
        render={({ match: { url } }) => (
          <Switch>
            <Route path={`${url}/new`} component={NewReport} />
            <Route path={`${url}/:uuid/edit`} component={EditReport} />
            <Route path={`${url}/:uuid`} component={ShowReport} />
          </Switch>
        )}
      />
      <Route path={PAGE_URLS.MISSING} component={Help} />
    </Switch>
  )
}

export default Routing
