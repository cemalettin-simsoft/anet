import { useReducer } from "react"
import { Button } from "react-bootstrap"
import { Link, useHistory } from "react-router-dom"
import { getSavedReports } from "../clientStorage"
import AppContext from "../components/AppContext"
import { reducer } from "../reducer"
import logo from "../resources/logo.png"
import { usePeriodicReportDelete } from "./customHooks/usePeriodReportDelete"
import { useScrollTop } from "./customHooks/useScrollTop"
// import Loading from "../components/Loading"
import Routing from "./Routing"

export const INITIAL_REPORTS = getSavedReports()

const App = () => {
  const [state, dispatch] = useReducer(reducer, INITIAL_REPORTS)
  const history = useHistory()
  useScrollTop()
  usePeriodicReportDelete(dispatch)

  return (
    <AppContext.Provider value={{ reports: state, dispatch }}>
      <div id="mini-anet-container">
        <div className="header-low-side">
          <Link to="/" className="logo">
            <img src={logo} alt="ANET logo" />
          </Link>
          <Button
            variant="primary"
            onClick={onCreateClick}
            className="create-report-button"
          >
            Create Report
          </Button>
        </div>
        <Routing />
        {/* <Loading /> */}
      </div>
    </AppContext.Provider>
  )

  function onCreateClick() {
    history.push("/reports/new")
  }
}

export default App
