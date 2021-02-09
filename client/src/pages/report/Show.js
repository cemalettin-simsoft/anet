import { deleteReportAction, updateReportAction } from "actions"
import AppContext from "components/AppContext"
import ButtonWithModalTrigger from "components/ButtonWithModalTrigger"
import Fieldset from "components/Fieldset"
import { ReadonlyField } from "components/FormFields"
import Messages from "components/Messages"
import { Field, Form, Formik } from "formik"
import _isEmpty from "lodash/isEmpty"
import Report from "models/Report"
import { useContext } from "react"
import { Alert, Button } from "react-bootstrap"
import { useHistory, useLocation, useParams } from "react-router-dom"

const ShowReport = () => {
  const routerLocation = useLocation()
  const history = useHistory()
  const { dispatch } = useContext(AppContext)
  const { uuid } = useParams()
  const reportData = useContext(AppContext).reports.find(r => r.uuid === uuid)
  if (!reportData) {
    history.push("/")
    return null
  }

  const report = new Report(reportData)
  const stateSuccess = routerLocation.state && routerLocation.state.success
  const stateError = routerLocation.state && routerLocation.state.error

  const reportHeader = report.isDraft() ? (
    <DraftReportHeader />
  ) : (
    <SubmittedReportHeader />
  )
  let validationErrors

  try {
    Report.yupSchema.validateSync(report, { abortEarly: false })
  } catch (e) {
    validationErrors = e.errors
  }

  return (
    <Formik
      enableReinitialize
      validationSchema={Report.yupSchema}
      validateOnMount
      initialValues={report}
    >
      {({ isSubmitting, isValid, values }) => {
        const action = report.isDraft() ? (
          <Button
            variant="primary"
            onClick={onEditClick}
            style={{ float: "right" }}
          >
            Edit
          </Button>
        ) : null

        return (
          <div className="report-show">
            <Messages success={stateSuccess} error={stateError} />
            {!_isEmpty(validationErrors) && (
              <Fieldset style={{ textAlign: "center" }}>
                <div style={{ textAlign: "left" }}>
                  {renderValidationErrors(validationErrors)}
                </div>
              </Fieldset>
            )}
            {reportHeader}
            <Form className="form-horizontal" method="post">
              <Fieldset
                title={`Report #${uuid.slice(0, 8)}...`}
                action={action}
              />
              <Field
                name="reportingTeam"
                label="Reporting Team"
                component={ReadonlyField}
              />
              <Field
                name="location"
                label="Location"
                component={ReadonlyField}
              />
              <Field name="grid" label="Grid" component={ReadonlyField} />

              <Field name="dtg" label="DTG" component={ReadonlyField} />

              <Field
                name="eventHeadline"
                label="Event Headline"
                component={ReadonlyField}
              />
              {values.eventHeadline === "Domain" && (
                <Field
                  name="domain"
                  label="Domain"
                  component={ReadonlyField}
                  widget={renderMultipleItemsWithCommas(values.domain)}
                />
              )}
              {values.eventHeadline === "Factor" && (
                <Field
                  name="factor"
                  label="Factor"
                  component={ReadonlyField}
                  widget={renderMultipleItemsWithCommas(values.factor)}
                />
              )}
              <Field name="topics" label={"Topics"} component={ReadonlyField} />
              <Field
                name="contacts"
                label="Contacts/Sources"
                component={ReadonlyField}
              />
              <Field
                name="description"
                label="Description"
                component={ReadonlyField}
              />
              <Field
                name="attitude"
                label="Attitude/Behavior of the Contact"
                component={ReadonlyField}
              />
              <Field
                name="comments"
                label="LMT Comments"
                component={ReadonlyField}
              />
              <Field
                name="recommendations"
                label="RC TEC assessment and recommendations"
                component={ReadonlyField}
              />
            </Form>

            <div className="submit-buttons">
              <div>
                <ButtonWithModalTrigger
                  buttonLabel="Delete report"
                  onConfirm={onConfirm}
                  modalTitle="Delete Report"
                  modalBody="Are you sure you want to delete this report?"
                  confirmButtonLabel="Yes"
                  otherButtonProps={{
                    variant: "warning"
                  }}
                  confirmButtonProps={{
                    variant: "warning"
                  }}
                />
              </div>
              {values.isDraft() && (
                <div>
                  <Button
                    id="formBottomSubmit"
                    variant="primary"
                    type="button"
                    onClick={() => onSubmit()}
                    disabled={isSubmitting || !isValid}
                  >
                    Submit
                  </Button>
                </div>
              )}
            </div>
          </div>
        )

        function onSubmit() {
          // TODO: submit logic, api call and set state of the report SUBMITTED
          // if api returns without error, dispatch
          dispatch(
            updateReportAction({ ...values, state: Report.STATES.SUBMITTED })
          )
        }

        function onConfirm() {
          dispatch(deleteReportAction(values.uuid))
          history.push("/", {
            success: "Successfuly deleted"
          })
        }

        function onEditClick() {
          history.push(Report.pathForEdit(values))
        }
      }}
    </Formik>
  )
}

export default ShowReport

const DraftReportHeader = () => (
  <Fieldset style={{ textAlign: "center" }}>
    <h4 className="text-danger">
      This is a DRAFT report and hasn't been submitted.
    </h4>
    <p>
      You can review the draft below to make sure all the details are correct.
    </p>
  </Fieldset>
)

const SubmittedReportHeader = () => (
  <Fieldset style={{ textAlign: "center" }}>
    <h4 className="text-danger">This is a SUBMITTED report.</h4>
    <p>You can review the report below</p>
  </Fieldset>
)

const renderMultipleItemsWithCommas = items => {
  // put commas until last item
  return (
    <div className="form-control-static">
      {items.map((item, idx) =>
        idx === items.length - 1 ? (
          <span key={item}>{item}</span>
        ) : (
          <span key={item}>{item}, </span>
        )
      )}
    </div>
  )
}

function renderValidationErrors(validationErrors) {
  const warning =
    "You'll need to fill out these required fields before you can submit your final Report:"
  return (
    <Alert variant="danger">
      {warning}
      <ul>
        {validationErrors.map((error, idx) => (
          <li key={idx}>{error}</li>
        ))}
      </ul>
    </Alert>
  )
}
