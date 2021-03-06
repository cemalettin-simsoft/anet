import API from "api"
import {
  CustomFieldsContainer,
  customFieldsJSONString
} from "components/CustomFields"
import Messages from "components/Messages"
import Model, {
  ENTITY_ASSESSMENT_PARENT_FIELD,
  GQL_CREATE_NOTE,
  GQL_UPDATE_NOTE
} from "components/Model"
import { Form, Formik } from "formik"
import _cloneDeep from "lodash/cloneDeep"
import _isEmpty from "lodash/isEmpty"
import { formatPeriodBoundary } from "periodUtils"
import PropTypes from "prop-types"
import React, { useMemo, useState } from "react"
import { Button, Modal } from "react-bootstrap"

const AssessmentModal = ({
  showModal,
  note,
  assessment,
  assessmentYupSchema,
  assessmentConfig,
  assessmentPeriod,
  recurrence,
  title,
  onSuccess,
  onCancel
}) => {
  const [assessmentError, setAssessmentError] = useState(null)
  const edit = !!note.uuid
  const initialValues = useMemo(
    () =>
      _isEmpty(assessment)
        ? Model.fillObject({}, assessmentYupSchema)
        : { [ENTITY_ASSESSMENT_PARENT_FIELD]: assessment },
    [assessment, assessmentYupSchema]
  )
  return (
    <>
      <Modal show={showModal} onHide={closeModal}>
        <Formik
          enableReinitialize
          onSubmit={onAssessmentSubmit}
          validationSchema={assessmentYupSchema}
          initialValues={initialValues}
        >
          {({
            isSubmitting,
            isValid,
            setFieldValue,
            setFieldTouched,
            validateForm,
            values,
            submitForm
          }) => {
            return (
              <Form>
                <Modal.Header closeButton>
                  <Modal.Title>{title}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      padding: 5,
                      height: "100%"
                    }}
                  >
                    <Messages error={assessmentError} />
                    <CustomFieldsContainer
                      fieldsConfig={assessmentConfig}
                      parentFieldName={ENTITY_ASSESSMENT_PARENT_FIELD}
                      formikProps={{
                        setFieldTouched,
                        setFieldValue,
                        values,
                        validateForm
                      }}
                      vertical
                    />
                  </div>
                </Modal.Body>
                <Modal.Footer>
                  <Button className="pull-left" onClick={closeModal}>
                    Cancel
                  </Button>
                  <Button
                    onClick={submitForm}
                    bsStyle="primary"
                    disabled={isSubmitting}
                  >
                    Save
                  </Button>
                </Modal.Footer>
              </Form>
            )
          }}
        </Formik>
      </Modal>
    </>
  )

  function closeModal() {
    setAssessmentError(null)
    onCancel()
  }

  function onAssessmentSubmit(values, form) {
    return saveAssessment(values, form)
      .then(response => onSubmitSuccess(response, values, form))
      .catch(error => {
        setAssessmentError(error)
        form.setSubmitting(false)
      })
  }

  function onSubmitSuccess(response, values, form) {
    const operation = edit ? "updateNote" : "createNote"
    onSuccess(response[operation])
  }

  function saveAssessment(values, form) {
    const noteRelatedObjects = note.noteRelatedObjects.map(o => ({
      relatedObjectType: o.relatedObjectType,
      relatedObjectUuid: o.relatedObjectUuid
    }))
    const updatedNote = {
      uuid: note.uuid,
      author: note.author,
      type: note.type,
      noteRelatedObjects
    }
    // values contains the assessment fields
    const clonedValues = _cloneDeep(values)
    clonedValues[ENTITY_ASSESSMENT_PARENT_FIELD].__recurrence = recurrence
    clonedValues[
      ENTITY_ASSESSMENT_PARENT_FIELD
    ].__periodStart = formatPeriodBoundary(assessmentPeriod.start)
    updatedNote.text = customFieldsJSONString(
      clonedValues,
      true,
      ENTITY_ASSESSMENT_PARENT_FIELD
    )
    return API.mutation(edit ? GQL_UPDATE_NOTE : GQL_CREATE_NOTE, {
      note: updatedNote
    })
  }
}
AssessmentModal.propTypes = {
  showModal: PropTypes.bool,
  note: Model.notePropType,
  assessment: PropTypes.object,
  assessmentYupSchema: PropTypes.object.isRequired,
  assessmentConfig: PropTypes.object.isRequired,
  assessmentPeriod: PropTypes.object.isRequired,
  recurrence: PropTypes.string.isRequired,
  title: PropTypes.string,
  onSuccess: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired
}
AssessmentModal.defaultProps = {
  showModal: false,
  title: "Assessment"
}

export default AssessmentModal
