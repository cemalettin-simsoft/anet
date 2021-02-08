import Help from "pages/Help"
import Home from "pages/Home"
import EditReport from "pages/report/Edit"
import NewReport from "pages/report/New"
import ShowReport from "pages/report/Show"
import { PAGE_URLS } from "pages/utils"
import { Route, Switch } from "react-router-dom"

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
