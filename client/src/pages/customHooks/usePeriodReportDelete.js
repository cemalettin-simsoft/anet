import { useEffect } from "react"
import { deleteTimedOutReportsAction } from "../../actions/actionCreators"

const REPORT_CONTROL_PERIOD_IN_MS = 30_000

export function usePeriodicReportDelete(dispatch) {
  useEffect(() => {
    // on mount deletion of old reports
    dispatch(deleteTimedOutReportsAction())
    const timeoutId = setInterval(() => {
      // Periodically checking and deleting
      dispatch(deleteTimedOutReportsAction())
    }, REPORT_CONTROL_PERIOD_IN_MS)

    return () => clearInterval(timeoutId)
  }, [dispatch])
}
