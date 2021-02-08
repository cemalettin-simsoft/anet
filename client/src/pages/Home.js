import { deleteAllReportsAction } from "actions"
import AppContext from "components/AppContext"
import Messages from "components/Messages"
import ReportList from "components/ReportList"
import Report from "models/Report"
import { useContext } from "react"
import { Button } from "react-bootstrap"
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
        {/* TODO: Add confirmation modal */}
        <Button
          variant="danger"
          onClick={() => dispatch(deleteAllReportsAction())}
        >
          Delete All Reports
        </Button>
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
