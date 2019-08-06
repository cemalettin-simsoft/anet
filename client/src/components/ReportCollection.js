import { Settings } from "api"
import autobind from "autobind-decorator"
import ButtonToggleGroup from "components/ButtonToggleGroup"
import Calendar from "components/Calendar"
import Map from "components/Map"
import ReportSummary from "components/ReportSummary"
import ReportTable from "components/ReportTable"
import UltimatePagination from "components/UltimatePagination"
import _get from "lodash/get"
import { Person, Report } from "models"
import moment from "moment"
import PropTypes from "prop-types"
import React, { Component } from "react"
import { Button } from "react-bootstrap"

export const FORMAT_CALENDAR = "calendar"
export const FORMAT_SUMMARY = "summary"
export const FORMAT_TABLE = "table"
export const FORMAT_MAP = "map"

export const GQL_REPORT_FIELDS = /* GraphQL */ `
  uuid, intent, engagementDate, duration, keyOutcomes, nextSteps, cancelledReason
  atmosphere, atmosphereDetails, state
  author { uuid, name, rank, role }
  primaryAdvisor { uuid, name, rank, role },
  primaryPrincipal { uuid, name, rank, role },
  advisorOrg { uuid, shortName },
  principalOrg { uuid, shortName },
  location { uuid, name, lat, lng },
  tasks { uuid, shortName },
  tags { uuid, name, description }
  workflow {
    type, createdAt
    step { uuid, name
      approvers { uuid, name, person { uuid, name, rank, role } }
    },
    person { uuid, name, rank, role }
  }
  updatedAt
`

export const GQL_BASIC_REPORT_FIELDS = /* GraphQL */ `
  uuid
  intent
  primaryAdvisor { name }
  principalOrg { shortName }
  engagementDate, duration
  state
  location { uuid name lat lng }
`

export default class ReportCollection extends Component {
  static propTypes = {
    width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    marginBottom: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    reports: PropTypes.array,
    calendarKey: PropTypes.string,
    getReportsQueryForCalendar: PropTypes.func,
    mapKey: PropTypes.string,
    getReportsQueryForMap: PropTypes.func,
    paginatedReports: PropTypes.shape({
      totalCount: PropTypes.number,
      pageNum: PropTypes.number,
      pageSize: PropTypes.number,
      list: PropTypes.array
    }),
    goToPage: PropTypes.func,
    mapId: PropTypes.string,
    viewFormats: PropTypes.arrayOf(PropTypes.string),
    reportsFilter: PropTypes.oneOfType([PropTypes.func, PropTypes.object])
  }

  static defaultProps = {
    viewFormats: [FORMAT_SUMMARY, FORMAT_TABLE, FORMAT_CALENDAR, FORMAT_MAP]
  }
  static VIEW_FORMATS_WITH_PAGINATION = [FORMAT_SUMMARY, FORMAT_TABLE]

  calendarComponentRef = React.createRef()

  constructor(props) {
    super(props)

    this.state = {
      viewFormat: this.props.viewFormats[0]
    }
  }

  render() {
    var reports = []
    const viewWithPagination =
      ReportCollection.VIEW_FORMATS_WITH_PAGINATION.includes(
        this.state.viewFormat
      ) && this.props.paginatedReports
    if (viewWithPagination) {
      var { pageSize, pageNum, totalCount } = this.props.paginatedReports
      var numPages = pageSize <= 0 ? 1 : Math.ceil(totalCount / pageSize)
      reports = this.props.paginatedReports.list
      pageNum++
    } else if (this.props.reports) {
      reports = this.props.reports
    }
    const showHeader = this.props.viewFormats.length > 1 || numPages > 1
    return (
      <div className="report-collection">
        <div>
          {showHeader && (
            <header>
              {this.props.viewFormats.length > 1 && (
                <ButtonToggleGroup
                  value={this.state.viewFormat}
                  onChange={this.changeViewFormat}
                  className="hide-for-print"
                >
                  {this.props.viewFormats.includes(FORMAT_TABLE) && (
                    <Button value={FORMAT_TABLE}>Table</Button>
                  )}
                  {this.props.viewFormats.includes(FORMAT_SUMMARY) && (
                    <Button value={FORMAT_SUMMARY}>Summary</Button>
                  )}
                  {this.props.viewFormats.includes(FORMAT_CALENDAR) && (
                    <Button value={FORMAT_CALENDAR}>Calendar</Button>
                  )}
                  {this.props.viewFormats.includes(FORMAT_MAP) && (
                    <Button value={FORMAT_MAP}>Map</Button>
                  )}
                </ButtonToggleGroup>
              )}

              {viewWithPagination && numPages > 1 && (
                <UltimatePagination
                  className="pull-right"
                  currentPage={pageNum}
                  totalPages={numPages}
                  boundaryPagesRange={1}
                  siblingPagesRange={2}
                  hideEllipsis={false}
                  hidePreviousAndNextPageLinks={false}
                  hideFirstAndLastPageLinks
                  onChange={value => this.props.goToPage(value - 1)}
                />
              )}

              {this.props.reportsFilter && (
                <div className="reports-filter">
                  Filter: {this.props.reportsFilter}
                </div>
              )}
            </header>
          )}

          <div>
            {this.state.viewFormat === FORMAT_CALENDAR &&
              this.renderCalendar(reports)}
            {this.state.viewFormat === FORMAT_TABLE &&
              this.renderTable(reports)}
            {this.state.viewFormat === FORMAT_SUMMARY &&
              this.renderSummary(reports)}
            {this.state.viewFormat === FORMAT_MAP && this.renderMap(reports)}
          </div>

          {viewWithPagination && numPages > 1 && (
            <footer>
              <UltimatePagination
                className="pull-right"
                currentPage={pageNum}
                totalPages={numPages}
                boundaryPagesRange={1}
                siblingPagesRange={2}
                hideEllipsis={false}
                hidePreviousAndNextPageLinks={false}
                hideFirstAndLastPageLinks
                onChange={value => this.props.goToPage(value - 1)}
              />
            </footer>
          )}
        </div>
      </div>
    )
  }

  renderTable(reports) {
    const hasReports = _get(reports, "length", 0)
    return (
      <React.Fragment>
        {(hasReports && <ReportTable showAuthors reports={reports} />) || (
          <em>No reports found</em>
        )}
      </React.Fragment>
    )
  }

  renderSummary(reports) {
    const hasReports = _get(reports, "length", 0)
    return (
      <React.Fragment>
        {(hasReports &&
          reports.map(report => (
            <ReportSummary report={report} key={report.uuid} />
          ))) || <em>No reports found</em>}
      </React.Fragment>
    )
  }

  renderMap(reports) {
    return (
      <Map
        key={this.props.mapKey}
        reports={reports}
        getReportsQuery={this.props.getReportsQueryForMap}
        mapId={this.props.mapId}
        width={this.props.width}
        height={this.props.height}
        marginBottom={this.props.marginBottom}
      />
    )
  }

  getEvents = reports => {
    if (!reports) {
      return []
    } else {
      return reports.map(r => {
        const who =
          (r.primaryAdvisor && new Person(r.primaryAdvisor).toString()) || ""
        const where =
          (r.principalOrg && r.principalOrg.shortName) ||
          (r.location && r.location.name) ||
          ""

        return {
          title: who + "@" + where,
          start: moment(r.engagementDate).format("YYYY-MM-DD HH:mm"),
          end: moment(r.engagementDate)
            .add(r.duration, "minutes")
            .format("YYYY-MM-DD HH:mm"),
          url: Report.pathFor(r),
          classNames: ["event-" + r.state.toLowerCase()],
          extendedProps: { ...r },
          allDay:
            !Settings.engagementsIncludeTimeAndDuration || r.duration === null
        }
      })
    }
  }

  fetchReportsForCalendar = (fetchInfo, successCallback, failureCallback) => {
    this.props
      .getReportsQueryForCalendar(fetchInfo)
      .then(data => {
        for (var prop in data) {
          successCallback(this.getEvents(data[prop].list))
          break
        }
      })
      .catch(failureCallback)
  }

  renderCalendar(reports) {
    return (
      <Calendar
        key={this.props.calendarKey}
        events={
          this.props.getReportsQueryForCalendar
            ? this.fetchReportsForCalendar
            : this.getEvents(reports)
        }
        calendarComponentRef={this.calendarComponentRef}
      />
    )
  }

  @autobind
  changeViewFormat(value) {
    this.setState({ viewFormat: value })
  }
}

ReportCollection.GQL_REPORT_FIELDS = GQL_REPORT_FIELDS
