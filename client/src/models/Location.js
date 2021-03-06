import Model, {
  createCustomFieldsSchema,
  GRAPHQL_NOTES_FIELDS
} from "components/Model"
import { convertLatLngToMGRS, convertMGRSToLatLng } from "geoUtils"
import _isEmpty from "lodash/isEmpty"
import LOCATIONS_ICON from "resources/locations.png"
import Settings from "settings"
import utils from "utils"
import * as yup from "yup"

export default class Location extends Model {
  static resourceName = "Location"
  static listName = "locationList"
  static getInstanceName = "location"
  static relatedObjectType = "locations"

  static APPROVAL_STEP_TYPE = {
    PLANNING_APPROVAL: "PLANNING_APPROVAL",
    REPORT_APPROVAL: "REPORT_APPROVAL"
  }

  // create yup schema for the customFields, based on the customFields config
  static customFieldsSchema = createCustomFieldsSchema(
    Settings.fields.location.customFields
  )

  static yupSchema = yup
    .object()
    .shape({
      name: yup.string().required().default(""),
      status: yup
        .string()
        .required()
        .default(() => Model.STATUS.ACTIVE),
      lat: yup
        .number()
        .nullable()
        .min(-90, "Latitude must be a number between -90 and +90")
        .max(90, "Latitude must be a number between -90 and +90")
        .test("lat", "Please enter latitude", function(lat) {
          const { lng } = this.parent
          if (lng || lng === 0) {
            return !!lat || lat === 0
          }
          return true
        })
        .default(null),
      lng: yup
        .number()
        .nullable()
        .min(-180, "Longitude must be a number between -180 and +180")
        .max(180, "Longitude must be a number between -180 and +180")
        .test("lng", "Please enter longitude", function(lng) {
          const { lat } = this.parent
          if (lat || lat === 0) {
            return !!lng || lng === 0
          }
          return true
        })
        .default(null),
      // not actually in the database, but used for validation
      displayedCoordinate: yup
        .string()
        .nullable()
        .test({
          name: "displayedCoordinate",
          test: function(displayedCoordinate) {
            if (_isEmpty(displayedCoordinate)) {
              return true
            }
            if (Settings?.fields?.location?.format === "MGRS") {
              const latLngValue = convertMGRSToLatLng(displayedCoordinate)
              return !latLngValue[0] || !latLngValue[1]
                ? this.createError({
                  message: "Please enter a valid MGRS coordinate",
                  path: "displayedCoordinate"
                })
                : true
            }
            return true
          }
        })
        .default(null),
      // FIXME: resolve code duplication in yup schema for approval steps
      planningApprovalSteps: yup
        .array()
        .of(
          yup.object().shape({
            name: yup
              .string()
              .required("You must provide the step name")
              .default(""),
            type: yup
              .string()
              .required()
              .default(() => Location.APPROVAL_STEP_TYPE.PLANNING_APPROVAL),
            approvers: yup
              .array()
              .required()
              .min(1, "You must select at least one approver")
              .default([])
          })
        )
        .nullable()
        .default([]),
      approvalSteps: yup
        .array()
        .of(
          yup.object().shape({
            name: yup
              .string()
              .required("You must provide the step name")
              .default(""),
            type: yup
              .string()
              .required()
              .default(() => Location.APPROVAL_STEP_TYPE.REPORT_APPROVAL),
            approvers: yup
              .array()
              .required()
              .min(1, "You must select at least one approver")
              .default([])
          })
        )
        .nullable()
        .default([])
    })
    // not actually in the database, the database contains the JSON customFields
    .concat(Location.customFieldsSchema)
    .concat(Model.yupSchema)

  static autocompleteQuery = "uuid, name"

  static autocompleteQueryWithNotes = `${this.autocompleteQuery} ${GRAPHQL_NOTES_FIELDS}`

  static hasCoordinates(location) {
    return (
      location &&
      typeof location.lat === "number" &&
      typeof location.lng === "number"
    )
  }

  static humanNameOfStatus(status) {
    return utils.sentenceCase(status)
  }

  constructor(props) {
    super(Model.fillObject(props, Location.yupSchema))
  }

  iconUrl() {
    return LOCATIONS_ICON
  }

  toString() {
    if (this.lat && this.lng) {
      const coordinate =
        Settings?.fields?.location?.format === "MGRS"
          ? convertLatLngToMGRS(this.lat, this.lng)
          : `${this.lat},${this.lng}`
      return `${this.name} ${coordinate}`
    }
    return this.name
  }
}
