import { useContext } from "react"
import { useParams } from "react-router-dom"
import AppContext from "../../components/AppContext"
import Report from "../../models/Report"
import ReportForm from "./Form"

const EditReport = () => {
  const { uuid } = useParams()
  const reportData = useContext(AppContext).reports.find(r => r.uuid === uuid)
  // TODO: do something better if no reportData
  if (!reportData) {
    return null
  }

  const report = new Report(reportData)
  return (
    <div>
      <ReportForm title="Edit report" initialValues={report} isEdit />
    </div>
  )
}

export default EditReport
