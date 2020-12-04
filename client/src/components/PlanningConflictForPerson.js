import {
  Button,
  Callout,
  Icon,
  Intent,
  Popover,
  PopoverInteractionKind,
  Spinner,
  Tooltip
} from "@blueprintjs/core"
import { IconNames } from "@blueprintjs/icons"
import API from "api"
import { gql } from "apollo-boost"
import Person from "models/Person"
import Report from "models/Report"
import moment from "moment"
import pluralize from "pluralize"
import PropTypes from "prop-types"
import React from "react"

const GET_PERSON_WITH_REPORTS = gql`
  query($uuid: String!, $attendedReportsQuery: ReportSearchQueryInput!) {
    person(uuid: $uuid) {
      uuid
      name
      attendedReports(query: $attendedReportsQuery) {
        list {
          uuid
          engagementDate
          duration
          state
        }
      }
    }
  }
`

const BasePlanningConflictForPerson = ({
  person,
  report,
  iconOnly,
  linkToComp: LinkToComp
}) => {
  const { loading, error, data } = API.useApiQuery(GET_PERSON_WITH_REPORTS, {
    uuid: person.uuid,
    attendedReportsQuery: {
      engagementDateStart: moment(report.engagementDate)
        .startOf("day")
        .valueOf(),
      engagementDateEnd: moment(report.engagementDate).endOf("day").valueOf()
    }
  })

  if (loading) {
    return (
      <Tooltip content="Checking for planning conflicts...">
        <Spinner intent={Intent.WARNING} size={20} />
      </Tooltip>
    )
  }

  if (error) {
    return (
      <Tooltip
        content="Error occured while checking for planning conflicts!"
        intent={Intent.DANGER}
      >
        <Icon icon={IconNames.ERROR} intent={Intent.DANGER} />
      </Tooltip>
    )
  }

  const conflictingReports = (data?.person?.attendedReports?.list || [])
    .filter(ar => Report.hasConflict(report, ar))
    .sort((a, b) =>
      a.engagementDate === b.engagementDate
        ? (a.duration || 0) - (b.duration || 0)
        : a.engagementDate - b.engagementDate
    )

  if (!conflictingReports.length) {
    return null
  }

  return (
    <Popover
      content={
        <Callout
          title={`${person.toString()} has ${
            conflictingReports.length
          } conflicting ${pluralize("report", conflictingReports.length)}`}
          intent={Intent.WARNING}
        >
          {conflictingReports.map(report => (
            <LinkToComp
              key={report.uuid}
              modelType="Report"
              model={report}
              style={{ display: "block" }}
              previewId="conf-person-rep"
            >
              {Report.getFormattedEngagementDate(report)}&nbsp;({report.state})
            </LinkToComp>
          ))}
        </Callout>
      }
      target={
        <Button icon={IconNames.WARNING_SIGN} intent={Intent.WARNING} minimal>
          {!iconOnly && (
            <>
              {conflictingReports.length}&nbsp;
              {pluralize("conflict", conflictingReports.length)}
            </>
          )}
        </Button>
      }
      interactionKind={PopoverInteractionKind.CLICK}
    />
  )
}

BasePlanningConflictForPerson.propTypes = {
  person: PropTypes.instanceOf(Person).isRequired,
  linkToComp: PropTypes.func.isRequired,
  report: PropTypes.instanceOf(Report).isRequired,
  iconOnly: PropTypes.bool
}

const PlanningConflictForPerson = ({
  person,
  report,
  iconOnly,
  linkToComp
}) => {
  if (!person?.uuid || !report?.engagementDate) {
    return null
  }
  return (
    <BasePlanningConflictForPerson
      person={person}
      report={report}
      iconOnly={iconOnly}
      linkToComp={linkToComp}
    />
  )
}

PlanningConflictForPerson.propTypes = {
  person: PropTypes.instanceOf(Person),
  linkToComp: PropTypes.func.isRequired,
  report: PropTypes.instanceOf(Report),
  iconOnly: PropTypes.bool
}

export default PlanningConflictForPerson
