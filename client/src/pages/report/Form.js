import { addNewReportAction, updateReportAction } from "actions"
import AppContext from "components/AppContext"
import { InputField } from "components/FormFields"
import { FastField, Form, Formik } from "formik"
import Report from "models/Report"
import PropTypes from "prop-types"
import { useContext } from "react"
import { Button } from "react-bootstrap"
import { useHistory } from "react-router-dom"

const ReportForm = ({ isEdit, initialValues, title }) => {
  const history = useHistory()
  const { dispatch } = useContext(AppContext)

  const reportSchema = Report.yupSchema
  const submitText = isEdit ? "Save" : "Preview"
  return (
    <div>
      <Formik
        enableReinitialize
        validateOnChange={false}
        validationSchema={reportSchema}
        initialValues={initialValues}
      >
        {({ isSubmitting, values }) => {
          const action = (
            <span style={{ float: "right" }} className="submit-buttons">
              <Button
                variant="primary"
                type="button"
                onClick={onSubmit}
                disabled={isSubmitting}
              >
                {submitText}
              </Button>
            </span>
          )

          console.log("values---------------")
          console.log(values)
          return (
            <div className="report-form">
              <Form className="form-horizontal" method="post">
                <h2>
                  {title} {action}
                </h2>
                <fieldset>
                  <FastField
                    name="reportingTeam"
                    label={"Reporting Team"}
                    component={InputField}
                  />
                  <FastField name="location" component={InputField} />
                  <FastField name="grid" component={InputField} label="Grid" />

                  <FastField name="dtg" label="DTG" component={InputField} />

                  <FastField
                    name="eventHeadline"
                    component={InputField}
                    label="Event Headline"
                    asA="select"
                    children={Report.eventHeadlines.map(headLine => (
                      <option key={headLine} value={headLine}>
                        {headLine}
                      </option>
                    ))}
                  />
                  {values.eventHeadline === "Domain" && (
                    <FastField
                      name="domain"
                      component={InputField}
                      label="Domain"
                      asA="select"
                      multiple
                      children={domains.map(headLine => (
                        <option key={headLine} value={headLine}>
                          {headLine}
                        </option>
                      ))}
                    />
                  )}
                  {values.eventHeadline === "Factor" && (
                    <FastField
                      name="factor"
                      component={InputField}
                      label="Factor"
                      asA="select"
                      multiple
                      children={factors.map(headLine => (
                        <option key={headLine} value={headLine}>
                          {headLine}
                        </option>
                      ))}
                    />
                  )}
                  <FastField
                    name="topics"
                    label={"Topics"}
                    component={InputField}
                    asA="textarea"
                  />
                  <FastField
                    name="contacts"
                    label="Contacts/Sources"
                    component={InputField}
                    asA="textarea"
                  />
                  <FastField
                    name="description"
                    label="Description"
                    component={InputField}
                    asA="textarea"
                  />
                  <FastField
                    name="attitude"
                    label="Attitude/Behavior of the Contact"
                    component={InputField}
                    asA="textarea"
                  />
                  <FastField
                    name="comments"
                    label="LMT Comments"
                    component={InputField}
                    asA="textarea"
                  />
                  <FastField
                    name="recommendations"
                    label="RC TEC assessment and recommendations"
                    component={InputField}
                    asA="textarea"
                  />
                </fieldset>

                <div className="submit-buttons">
                  <div>
                    <Button onClick={onCancel}>Cancel</Button>
                  </div>
                  <div>
                    {/* Skip validation on save! */}
                    <Button
                      id="formBottomSubmit"
                      variant="primary"
                      type="button"
                      onClick={onSubmit}
                      disabled={isSubmitting}
                    >
                      {submitText}
                    </Button>
                  </div>
                </div>
              </Form>
            </div>
          )
          function onSubmit() {
            console.log("OnSubmit...")
            if (!isEdit) {
              dispatch(
                addNewReportAction({
                  ...values,
                  createdAt: Date.now()
                })
              )
              history.replace(Report.pathForEdit(values))
            }
            if (isEdit) {
              dispatch(updateReportAction({ ...values }))
            }
            history.push(Report.pathFor(values), {
              success: "Report saved"
            })
          }

          function onCancel() {
            history.push("/")
          }
        }}
      </Formik>
    </div>
  )
}
ReportForm.propTypes = {
  isEdit: PropTypes.bool,
  initialValues: PropTypes.object,
  title: PropTypes.string
}
export default ReportForm

const domains = [
  "Political",
  "Military/security",
  "Economy",
  "Social",
  "Infrastructure",
  "Information"
]

const factors = [
  "None",
  "Weak institutions",
  "Inter-ethnic tensions",
  "Unilateralism",
  "Corruption and Organized Crime",
  "Radicalism",
  "Migration"
]
