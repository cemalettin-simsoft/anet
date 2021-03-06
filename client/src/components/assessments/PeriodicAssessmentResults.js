import { Icon } from "@blueprintjs/core"
import { IconNames } from "@blueprintjs/icons"
import API from "api"
import { gql } from "apollo-boost"
import AssessmentModal from "components/assessments/AssessmentModal"
import ConfirmDelete from "components/ConfirmDelete"
import { ReadonlyCustomFields } from "components/CustomFields"
import LinkTo from "components/LinkTo"
import Model, { NOTE_TYPE } from "components/Model"
import { Formik } from "formik"
import _isEmpty from "lodash/isEmpty"
import moment from "moment"
import {
  AssessmentPeriodPropType,
  AssessmentPeriodsConfigPropType,
  periodToString
} from "periodUtils"
import PropTypes from "prop-types"
import React, { useState } from "react"
import { Button, Panel } from "react-bootstrap"
import { toast } from "react-toastify"
import REMOVE_ICON from "resources/delete.png"

const GQL_DELETE_NOTE = gql`
  mutation($uuid: String!) {
    deleteNote(uuid: $uuid)
  }
`

const PeriodicAssessment = ({
  assessment,
  assessmentYupSchema,
  assessmentConfig,
  note,
  entity,
  period,
  recurrence,
  canEditAssessment,
  onUpdateAssessment
}) => {
  const [showAssessmentModalKey, setShowAssessmentModalKey] = useState(null)
  const parentFieldName = `assessment-${note.uuid}`
  const periodDisplay = periodToString(period)

  return (
    <Panel bsStyle="primary" style={{ borderRadius: "15px" }}>
      <Panel.Heading
        style={{
          padding: "1px 1px",
          borderTopLeftRadius: "15px",
          borderTopRightRadius: "15px",
          paddingRight: "10px",
          paddingLeft: "10px",
          // whiteSpace: "nowrap", TODO: disabled for now as not working well in IE11
          display: "flex",
          flexDirection: "row",
          alignItems: "flex-end"
        }}
      >
        <>
          <i>{moment(note.updatedAt).fromNow()}</i>{" "}
          <LinkTo
            modelType="Person"
            model={note.author}
            style={{ color: "white" }}
          />
          {canEditAssessment && (
            <>
              <Button
                title="Edit assessment"
                onClick={() => setShowAssessmentModalKey(note.uuid)}
                bsSize="xsmall"
                bsStyle="primary"
              >
                <Icon icon={IconNames.EDIT} />
              </Button>
              <ConfirmDelete
                onConfirmDelete={() => deleteNote(note.uuid)}
                objectType="note"
                objectDisplay={"#" + note.uuid}
                title="Delete assessment"
                bsSize="xsmall"
                bsStyle="primary"
              >
                <img src={REMOVE_ICON} height={14} alt="Delete" />
              </ConfirmDelete>
              <AssessmentModal
                showModal={showAssessmentModalKey === note.uuid}
                note={note}
                assessment={assessment}
                assessmentYupSchema={assessmentYupSchema}
                assessmentConfig={assessmentConfig}
                assessmentPeriod={period}
                recurrence={recurrence}
                title={`Assessment for ${entity.toString()} for ${periodDisplay}`}
                onSuccess={() => {
                  setShowAssessmentModalKey(null)
                  onUpdateAssessment()
                }}
                onCancel={() => setShowAssessmentModalKey(null)}
              />
            </>
          )}
        </>
      </Panel.Heading>
      <Panel.Body>
        <div
          style={{
            overflowWrap: "break-word",
            /* IE: */ wordWrap: "break-word"
          }}
        >
          <Formik
            enableReinitialize
            initialValues={{
              [parentFieldName]: assessment
            }}
          >
            {({ values }) => {
              return (
                <ReadonlyCustomFields
                  parentFieldName={parentFieldName}
                  fieldsConfig={assessmentConfig}
                  values={values}
                  vertical
                />
              )
            }}
          </Formik>
        </div>
      </Panel.Body>
    </Panel>
  )

  function deleteNote(uuid) {
    API.mutation(GQL_DELETE_NOTE, { uuid })
      .then(() => {
        onUpdateAssessment()
        toast("Successfully deleted")
      })
      .catch(error => {
        toast.error(error.message.split(":").pop())
      })
  }
}
PeriodicAssessment.propTypes = {
  assessment: PropTypes.object.isRequired,
  assessmentConfig: PropTypes.object.isRequired,
  assessmentYupSchema: PropTypes.object.isRequired,
  note: Model.notePropType.isRequired,
  entity: PropTypes.object.isRequired,
  period: AssessmentPeriodPropType.isRequired,
  recurrence: PropTypes.string.isRequired,
  canEditAssessment: PropTypes.bool,
  onUpdateAssessment: PropTypes.func.isRequired
}

export const PeriodicAssessmentsRows = ({
  entity,
  entityType,
  periodsConfig,
  canAddAssessment,
  onUpdateAssessment
}) => {
  const [showAssessmentModalKey, setShowAssessmentModalKey] = useState(null)
  const { recurrence, periods } = periodsConfig
  if (_isEmpty(periods)) {
    return null
  }

  const {
    assessmentConfig,
    assessmentYupSchema
  } = entity.getPeriodicAssessmentDetails(recurrence)
  const filteredAssessmentConfig = Model.filterAssessmentConfig(
    assessmentConfig,
    entity
  )
  if (_isEmpty(filteredAssessmentConfig)) {
    return null
  }

  const periodsAssessments = []
  const periodsAllowNewAssessment = []
  periods.forEach(period => {
    const periodAssessments = entity.getPeriodAssessments(recurrence, period)

    periodsAssessments.push(periodAssessments)
    // Only allow adding new assessments for a period if the user has the rights
    // for it, if the period is configured to allow adding new assessments
    // If there is already an assessment, don't allow to create a new one
    periodsAllowNewAssessment.push(
      canAddAssessment &&
        period.allowNewAssessments &&
        _isEmpty(periodAssessments)
    )
  })
  const hasAddAssessmentRow = !_isEmpty(
    periodsAllowNewAssessment.filter(x => x)
  )
  return (
    <>
      <tr>
        {periodsAssessments.map((periodAssessments, index) => {
          return (
            <td key={index}>
              {!_isEmpty(periodAssessments) ? (
                periodAssessments.map(({ note, assessment }, i) => (
                  <div key={note.uuid}>
                    <PeriodicAssessment
                      note={note}
                      assessment={assessment}
                      assessmentYupSchema={assessmentYupSchema}
                      assessmentConfig={filteredAssessmentConfig}
                      entity={entity}
                      period={periods[index]}
                      recurrence={recurrence}
                      canEditAssessment={canAddAssessment}
                      onUpdateAssessment={onUpdateAssessment}
                    />
                  </div>
                ))
              ) : (
                <em>No periodic assessments</em>
              )}
            </td>
          )
        })}
      </tr>
      {hasAddAssessmentRow && (
        <tr>
          {periods.map((period, index) => {
            const periodDisplay = periodToString(period)
            const addAssessmentLabel = `Make a new ${entity?.toString()} assessment for ${periodDisplay}`
            const modalKey = `${entity.uuid}-${periodDisplay}`
            return (
              <td key={index}>
                {periodsAllowNewAssessment[index] && (
                  <>
                    <Button
                      bsStyle="primary"
                      onClick={() => setShowAssessmentModalKey(modalKey)}
                    >
                      {addAssessmentLabel}
                    </Button>
                    <AssessmentModal
                      showModal={showAssessmentModalKey === modalKey}
                      note={{
                        type: NOTE_TYPE.ASSESSMENT,
                        noteRelatedObjects: [
                          {
                            relatedObjectType: entityType.relatedObjectType,
                            relatedObjectUuid: entity.uuid
                          }
                        ]
                      }}
                      title={`Assessment for ${entity.toString()} for ${periodDisplay}`}
                      addAssessmentLabel={addAssessmentLabel}
                      assessmentYupSchema={assessmentYupSchema}
                      recurrence={recurrence}
                      assessmentPeriod={period}
                      assessmentConfig={filteredAssessmentConfig}
                      onSuccess={() => {
                        setShowAssessmentModalKey(null)
                        onUpdateAssessment()
                      }}
                      onCancel={() => setShowAssessmentModalKey(null)}
                    />
                  </>
                )}
              </td>
            )
          })}
        </tr>
      )}
    </>
  )
}
PeriodicAssessmentsRows.propTypes = {
  entity: PropTypes.object.isRequired,
  entityType: PropTypes.func.isRequired,
  periodsConfig: AssessmentPeriodsConfigPropType.isRequired,
  canAddAssessment: PropTypes.bool,
  onUpdateAssessment: PropTypes.func.isRequired
}
