import {
  AnchorButton,
  Popover,
  PopoverInteractionKind,
  Tooltip
} from "@blueprintjs/core"
import styled from "@emotion/styled"
import * as FieldHelper from "components/FieldHelper"
import SelectLocationFormat from "components/SelectLocationFormat"
import { Field } from "formik"
import {
  convertLatLngToMGRS,
  convertMGRSToLatLng,
  parseCoordinate
} from "geoUtils"
import { Location } from "models"
import PropTypes from "prop-types"
import React, { useState } from "react"
import { Col, ControlLabel, FormGroup, Table } from "react-bootstrap"

export const GEO_LOCATION_DISPLAY_TYPE = {
  FORM_FIELD: "FORM_FIELD",
  GENERIC: "GENERIC"
}

const MGRS_LABEL = "MGRS Coordinate"
const LAT_LON_LABEL = "Latitude, Longitude"
const DEFAULT_COORDINATES = {
  lat: null,
  lng: null,
  displayedCoordinate: null
}
const GeoLocation = ({
  coordinates,
  editable,
  setFieldValue,
  setFieldTouched,
  isSubmitting,
  displayType
}) => {
  const [locationFormat, setLocationFormat] = useState(Location.locationFormat)

  let label = LAT_LON_LABEL
  let CoordinatesFormField = LatLonFormField
  if (locationFormat === Location.LOCATION_FORMATS.MGRS) {
    label = MGRS_LABEL
    CoordinatesFormField = MGRSFormField
  }

  if (!editable) {
    const humanValue = (
      <ReadonlyGeoLocation>
        <CoordinatesFormField coordinates={coordinates} />
        <AllFormatsInfo coordinates={coordinates} />
        <SelectLocationFormat
          locationFormat={locationFormat}
          setLocationFormat={setLocationFormat}
        />
      </ReadonlyGeoLocation>
    )

    if (displayType === GEO_LOCATION_DISPLAY_TYPE.FORM_FIELD) {
      return (
        <>
          <Field
            name="location"
            label={label}
            component={FieldHelper.ReadonlyField}
            humanValue={humanValue}
            style={{ paddingTop: "2px" }}
          />
        </>
      )
    }

    return humanValue
  }

  return (
    <CoordinatesFormField
      coordinates={coordinates}
      editable
      setFieldValue={setFieldValue}
      setFieldTouched={setFieldTouched}
      isSubmitting={isSubmitting}
      locationFormat={locationFormat}
      setLocationFormat={setLocationFormat}
    />
  )
}

const ReadonlyGeoLocation = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  @media (max-width: 440px) {
    flex-direction: column;
    align-items: flex-start;
  }
`

function fnRequiredWhenEditable(props, propName, componentName) {
  if (props.editable === true && typeof props[propName] !== "function") {
    return new Error(
      `Invalid prop '${propName}' is supplied to ${componentName}. '${propName}' isRequired when ${componentName} is editable and '${propName}' must be a function!`
    )
  }
}

export const CoordinatesPropType = PropTypes.shape({
  // user can input string
  lat: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  lng: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  displayedCoordinate: PropTypes.string
})

GeoLocation.propTypes = {
  coordinates: CoordinatesPropType,
  editable: PropTypes.bool,
  setFieldValue: fnRequiredWhenEditable,
  setFieldTouched: fnRequiredWhenEditable,
  isSubmitting: PropTypes.bool,
  displayType: PropTypes.oneOf([
    GEO_LOCATION_DISPLAY_TYPE.FORM_FIELD,
    GEO_LOCATION_DISPLAY_TYPE.GENERIC
  ])
}

GeoLocation.defaultProps = {
  coordinates: DEFAULT_COORDINATES,
  editable: false,
  isSubmitting: false,
  displayType: GEO_LOCATION_DISPLAY_TYPE.GENERIC
}

export default GeoLocation

/* =========================== MGRSFormField ================================ */

const MGRSFormField = ({
  coordinates,
  editable,
  setFieldValue,
  setFieldTouched,
  isSubmitting,
  locationFormat,
  setLocationFormat
}) => {
  const { displayedCoordinate } = coordinates
  if (!editable) {
    return <span>{displayedCoordinate || "?"}</span>
  }

  return (
    <FormGroup style={{ marginBottom: 0 }}>
      <Col sm={2} componentClass={ControlLabel} htmlFor="displayedCoordinate">
        {MGRS_LABEL}
      </Col>

      <Col sm={7}>
        <Col sm={4}>
          <Field
            name="displayedCoordinate"
            component={FieldHelper.InputFieldNoLabel}
            onChange={e => updateCoordinatesOnChange(e.target.value)}
            onBlur={e => {
              updateCoordinatesOnBlur(e.target.value)
            }}
          />
        </Col>
        <CoordinateActionButtons
          coordinates={coordinates}
          isSubmitting={isSubmitting}
          disabled={!displayedCoordinate}
          onClear={() => {
            setFieldTouched("displayedCoordinate", false, false)
            setFieldValue("displayedCoordinate", null, false)
            setFieldValue("lat", null, false)
            setFieldValue("lng", null, false)
          }}
          locationFormat={locationFormat}
          setLocationFormat={setLocationFormat}
        />
      </Col>
    </FormGroup>
  )
  // Lat-Lng fields are read only, no need to validate in onChange or onBlur
  function updateCoordinatesOnChange(val) {
    setFieldValue("displayedCoordinate", val)
    const newLatLng = convertMGRSToLatLng(val)
    setFieldValue("lat", newLatLng[0], false)
    setFieldValue("lng", newLatLng[1], false)
  }
  function updateCoordinatesOnBlur(val) {
    setFieldTouched("displayedCoordinate", true)
    const newLatLng = convertMGRSToLatLng(val)
    setFieldValue("lat", newLatLng[0], false)
    setFieldValue("lng", newLatLng[1], false)
  }
}

MGRSFormField.propTypes = {
  coordinates: CoordinatesPropType,
  editable: PropTypes.bool,
  setFieldValue: fnRequiredWhenEditable,
  setFieldTouched: fnRequiredWhenEditable,
  isSubmitting: PropTypes.bool,
  locationFormat: PropTypes.string,
  setLocationFormat: PropTypes.func
}

MGRSFormField.defaultProps = {
  coordinates: DEFAULT_COORDINATES,
  editable: false,
  isSubmitting: false
}

/* ========================= LatLonFormField ================================ */

const LatLonFormField = ({
  coordinates,
  editable,
  setFieldValue,
  setFieldTouched,
  isSubmitting,
  locationFormat,
  setLocationFormat
}) => {
  const { lat, lng } = coordinates
  if (!editable) {
    return (
      <div>
        <span>{lat || lat === 0 ? lat : "?"}</span>
        <span>,&nbsp;</span>
        <span>{lng || lng === 0 ? lng : "?"}</span>
      </div>
    )
  }
  return (
    <FormGroup style={{ marginBottom: 0 }}>
      <Col sm={2} componentClass={ControlLabel} htmlFor="lat">
        {LAT_LON_LABEL}
      </Col>

      <Col sm={7}>
        <Col sm={3} style={{ marginRight: "8px" }}>
          <Field
            name="lat"
            component={FieldHelper.InputFieldNoLabel}
            onChange={e => setLatOnChange(e.target.value)}
            onBlur={e => {
              setParsedLatOnBlur(e.target.value)
            }}
          />
        </Col>
        <Col sm={3}>
          <Field
            name="lng"
            component={FieldHelper.InputFieldNoLabel}
            onChange={e => setLngOnChange(e.target.value)}
            onBlur={e => {
              setParsedLngOnBlur(e.target.value)
            }}
          />
        </Col>
        <CoordinateActionButtons
          coordinates={coordinates}
          isSubmitting={isSubmitting}
          disabled={!lat && lat !== 0 && !lng && lng !== 0}
          onClear={() => {
            // setting second param to false prevents validation since lat, lng can be null together
            setFieldTouched("lat", false, false)
            setFieldTouched("lng", false, false)
            setFieldValue("displayedCoordinate", null)
            setFieldValue("lat", null)
            setFieldValue("lng", null)
          }}
          locationFormat={locationFormat}
          setLocationFormat={setLocationFormat}
        />
      </Col>
    </FormGroup>
  )

  // Don't parse in onChange, it limits user
  // displayedCoordinate is in read-only field, no need to validate
  function setLatOnChange(val) {
    setFieldValue("lat", val)
    setFieldValue("displayedCoordinate", convertLatLngToMGRS(val, lng), false)
  }

  function setLngOnChange(val) {
    setFieldValue("lng", val)
    setFieldValue("displayedCoordinate", convertLatLngToMGRS(lat, val), false)
  }

  function setParsedLatOnBlur(val) {
    setFieldValue("displayedCoordinate", convertLatLngToMGRS(val, lng), false)
    setFieldTouched("lat", true)
    setFieldValue("lat", parseCoordinate(val))
  }

  function setParsedLngOnBlur(val) {
    setFieldValue("displayedCoordinate", convertLatLngToMGRS(lat, val), false)
    setFieldTouched("lng", true)
    setFieldValue("lng", parseCoordinate(val))
  }
}

LatLonFormField.propTypes = {
  coordinates: CoordinatesPropType,
  editable: PropTypes.bool,
  setFieldValue: fnRequiredWhenEditable,
  setFieldTouched: fnRequiredWhenEditable,
  isSubmitting: PropTypes.bool,
  locationFormat: PropTypes.string,
  setLocationFormat: PropTypes.func
}

LatLonFormField.defaultProps = {
  coordinates: DEFAULT_COORDINATES,
  editable: false,
  isSubmitting: false
}

/* ======================= CoordinateActionButtons ============================ */

const CoordinateActionButtons = ({
  coordinates,
  onClear,
  isSubmitting,
  disabled,
  locationFormat,
  setLocationFormat
}) => {
  return (
    <Col sm={5} style={{ padding: "4px 8px" }}>
      <Tooltip content="Clear coordinates">
        <AnchorButton
          minimal
          icon="delete"
          outlined
          intent="danger"
          onClick={onClear}
          disabled={isSubmitting || disabled}
        />
      </Tooltip>
      <AllFormatsInfo coordinates={coordinates} inForm />
      <SelectLocationFormat
        locationFormat={locationFormat}
        setLocationFormat={setLocationFormat}
      />
    </Col>
  )
}

CoordinateActionButtons.propTypes = {
  coordinates: CoordinatesPropType,
  onClear: PropTypes.func.isRequired,
  isSubmitting: PropTypes.bool.isRequired,
  disabled: PropTypes.bool,
  locationFormat: PropTypes.string,
  setLocationFormat: PropTypes.func
}

CoordinateActionButtons.defaultProps = {
  coordinates: DEFAULT_COORDINATES,
  disabled: true
}

/* ======================= AllFormatsInfo ============================ */

const AllFormatsInfo = ({ coordinates, inForm }) => {
  const { lat, lng } = coordinates
  if (!inForm && ((!lat && lat !== 0) || (!lng && lng !== 0))) {
    return null
  }
  return (
    <Popover
      content={
        <div style={{ padding: "8px" }}>
          <Table style={{ margin: 0 }}>
            <thead>
              <tr>
                <th colSpan="2" className="text-center">
                  All Coordinate Formats
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ whiteSpace: "nowrap" }}>{LAT_LON_LABEL}</td>
                <td>
                  <LatLonFormField coordinates={coordinates} />
                </td>
              </tr>
              <tr>
                <td style={{ whiteSpace: "nowrap" }}>{MGRS_LABEL}</td>
                <td>
                  <MGRSFormField coordinates={coordinates} />
                </td>
              </tr>
            </tbody>
          </Table>
        </div>
      }
      target={
        <Tooltip content="Display all coordinate formats">
          <AnchorButton
            style={{ marginLeft: "8px" }}
            id="gloc-info-btn"
            minimal
            icon="info-sign"
            intent="primary"
            outlined={inForm}
          />
        </Tooltip>
      }
      interactionKind={PopoverInteractionKind.CLICK_TARGET_ONLY}
      usePortal={false}
    />
  )
}

AllFormatsInfo.propTypes = {
  coordinates: CoordinatesPropType,
  inForm: PropTypes.bool
}

AllFormatsInfo.defaultProps = {
  coordinates: DEFAULT_COORDINATES,
  inForm: false
}
