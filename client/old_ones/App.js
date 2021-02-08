import { deleteTimedOutReportsAction } from "actions"
import AppContext from "components/AppContext"
import Routing from "pages/Routing"
import React, { useEffect, useReducer } from "react"
import { Button } from "react-bootstrap"
import { Link, useHistory } from "react-router-dom"
import { INITIAL_REPORTS, reducer } from "reducer"
import logo from "resources/logo.png"
import { REPORT_CONTROL_PERIOD_IN_MS } from "utils"

const App = () => {
  const [state, dispatch] = useReducer(reducer, INITIAL_REPORTS)
  const history = useHistory()

  useEffect(() => {
    // on mount deletion of old reports
    dispatch(deleteTimedOutReportsAction())
    const timeoutId = setInterval(() => {
      // Periodically checking and deleting
      dispatch(deleteTimedOutReportsAction())
    }, REPORT_CONTROL_PERIOD_IN_MS)

    return () => clearInterval(timeoutId)
  }, [])

  return (
    <AppContext.Provider
      value={{
        reports: state,
        dispatch
      }}
    >
      <div id="mini-anet-container">
        <div className="header-low-side">
          <Link to="/" className="logo">
            <img src={logo} alt="ANET logo" />
          </Link>
          <Button
            bsStyle="primary"
            onClick={onCreateClick}
            className="create-report-button"
          >
            Create Report
          </Button>
        </div>
        <Routing />
      </div>
    </AppContext.Provider>
  )

  function onCreateClick() {
    history.push("/reports/new")
  }
}

export default App
