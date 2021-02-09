import { deleteAllReportsAction } from "actions/actionCreators"
import AppContext from "components/AppContext"
import Messages from "components/Messages"
import ReportList from "components/ReportList"
import Report from "models/Report"
import { useContext } from "react"
import { Link, useLocation } from "react-router-dom"
import ButtonWithModalTrigger from "../components/ButtonWithModalTrigger"
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
        <ButtonWithModalTrigger
          buttonLabel="Delete all reports"
          onConfirm={() => dispatch(deleteAllReportsAction())}
          modalTitle="Delete All Reports"
          modalBody="Are you sure you want to delete all reports?"
          confirmButtonLabel="Yes"
          otherButtonProps={{
            variant: "danger"
          }}
          confirmButtonProps={{
            variant: "danger"
          }}
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
