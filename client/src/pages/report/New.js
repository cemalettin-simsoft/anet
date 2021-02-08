import Report from "models/Report"
import ReportForm from "pages/report/Form"
import { v4 as uuidv4 } from "uuid"

const NewReport = () => {
  const report = new Report({ uuid: uuidv4() })
  return (
    <div>
      <ReportForm title="Create a new report" initialValues={report} />
    </div>
  )
}

export default NewReport
