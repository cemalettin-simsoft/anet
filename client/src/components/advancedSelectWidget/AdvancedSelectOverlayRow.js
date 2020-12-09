import LinkTo from "components/LinkTo"
import moment from "moment"
import { Fragment } from "react"
import Settings from "settings"

export const AuthorizationGroupOverlayRow = item => (
  <Fragment key={item.uuid}>
    <td>{item.name}</td>
    <td>{item.description}</td>
  </Fragment>
)

export const LocationOverlayRow = item => (
  <Fragment key={item.uuid}>
    <td>
      <LinkTo modelType="Location" model={item} isLink={false} />
    </td>
  </Fragment>
)

export const OrganizationOverlayRow = item => (
  <Fragment key={item.uuid}>
    <td className="orgShortName">
      <span>
        {item.shortName} - {item.longName} {item.identificationCode}
      </span>
    </td>
  </Fragment>
)

export const TaskSimpleOverlayRow = item => (
  <Fragment key={item.uuid}>
    <td className="taskName">
      <span>
        {item.shortName} - {item.longName}
      </span>
    </td>
  </Fragment>
)

export const TaskDetailedOverlayRow = item => (
  <Fragment key={item.uuid}>
    <td className="taskName">
      <LinkTo modelType="Task" model={item} isLink={false}>
        {item.shortName}
      </LinkTo>
    </td>
    <td className="parentTaskName">
      {item.customFieldRef1 && (
        <LinkTo modelType="Task" model={item.customFieldRef1} isLink={false}>
          {item.customFieldRef1.shortName}
        </LinkTo>
      )}
    </td>
  </Fragment>
)

export const PositionOverlayRow = item => (
  <Fragment key={item.uuid}>
    <td>
      <LinkTo modelType="Position" model={item} isLink={false} />
      {item.code ? `, ${item.code}` : ""}
    </td>
    <td>
      <LinkTo
        modelType="Organization"
        model={item.organization}
        isLink={false}
      />
    </td>
    <td>
      <LinkTo modelType="Person" model={item.person} isLink={false} />
    </td>
  </Fragment>
)

export const PersonSimpleOverlayRow = item => (
  <Fragment key={item.uuid}>
    <td>
      <LinkTo modelType="Person" model={item} isLink={false} />
    </td>
  </Fragment>
)

export const PersonDetailedOverlayRow = item => (
  <Fragment key={item.uuid}>
    <td>
      <LinkTo modelType="Person" model={item} isLink={false} />
    </td>
    <td>
      <LinkTo modelType="Position" model={item.position} isLink={false} />
      {item.position && item.position.code ? `, ${item.position.code}` : ""}
    </td>
    <td>
      <LinkTo
        modelType="Location"
        model={item.position && item.position.location}
        whenUnspecified=""
        isLink={false}
      />
    </td>
    <td>
      {item.position && item.position.organization && (
        <LinkTo
          modelType="Organization"
          model={item.position.organization}
          isLink={false}
        />
      )}
    </td>
  </Fragment>
)

export const TagOverlayRow = item => (
  <Fragment key={item.uuid}>
    <td>
      <LinkTo modelType="Tag" model={item} isLink={false} />
    </td>
  </Fragment>
)

export const ApproverOverlayRow = item => (
  <Fragment key={item.uuid}>
    <td>
      <LinkTo modelType="Person" model={item.person} isLink={false} />
    </td>
    <td>
      <LinkTo modelType="Position" model={item} isLink={false} />
    </td>
  </Fragment>
)

export const ReportDetailedOverlayRow = item => (
  <Fragment key={item.uuid}>
    <td>
      <LinkTo modelType="Report" model={item} isLink={false} />
    </td>
    <td>
      <span>
        {item.authors
          ? item.authors.map(a => (
            <div key={a.uuid} style={{ whiteSpace: "nowrap" }}>
              {a.name}
            </div>
          ))
          : "Unknown"}
      </span>
    </td>
    <td>
      <span>
        {moment(item.updatedAt).format(
          Settings.dateFormats.forms.displayShort.withTime
        )}
      </span>
    </td>
  </Fragment>
)
