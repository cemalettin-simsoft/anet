import { deleteAllReportsAction } from "actions"
import AppContext from "components/AppContext"
import ConfirmDelete from "components/ConfirmDelete"
import Messages from "components/Messages"
import ReportList from "components/ReportList"
import Report from "models/Report"
import React, { useContext } from "react"
import { Link, useLocation } from "react-router-dom"

const Home = () => {
  const { reports, dispatch } = useContext(AppContext)
  const routerLocation = useLocation()
  const stateSuccess = routerLocation.state && routerLocation.state.success
  const stateError = routerLocation.state && routerLocation.state.error
  return (
    <>
      <Messages success={stateSuccess} error={stateError} />

      <ReportList
        reports={reports.filter(r => Report.isDraft(r))}
        title="My Draft Reports"
      />
      <ReportList
        reports={reports.filter(r => !Report.isDraft(r))}
        title="My Submitted Reports"
      />
      <div className="submit-buttons">
        <ConfirmDelete
          onConfirmDelete={() => dispatch(deleteAllReportsAction())}
          objectType="report"
          objectDisplay="All reports"
          bsStyle="warning"
          buttonLabel="Delete All Reports"
          className="pull-right"
        />
      </div>
      <footer style={{ marginTop: "20px" }}>
        <p>
          * Additional information about <Link to="/help">ANET MINI</Link>
        </p>
      </footer>
    </>
  )
}
export default Home
