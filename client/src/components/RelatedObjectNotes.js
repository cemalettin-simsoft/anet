import { Icon } from "@blueprintjs/core"
import "@blueprintjs/core/lib/css/blueprint.css"
import { IconNames } from "@blueprintjs/icons"
import API from "api"
import { gql } from "apollo-boost"
import AppContext from "components/AppContext"
import ConfirmDelete from "components/ConfirmDelete"
import { parseHtmlWithLinkTo } from "components/editor/LinkAnet"
import LinkTo from "components/LinkTo"
import Messages from "components/Messages"
import Model, {
  INVISIBLE_CUSTOM_FIELDS_FIELD,
  NOTE_TYPE
} from "components/Model"
import RelatedObjectNoteModal from "components/RelatedObjectNoteModal"
import _isEmpty from "lodash/isEmpty"
import _isEqualWith from "lodash/isEqualWith"
import { Person } from "models"
import moment from "moment"
import PropTypes from "prop-types"
import React, { useContext, useEffect, useRef, useState } from "react"
import { Button, Panel } from "react-bootstrap"
import ReactDOM from "react-dom"
import NotificationBadge from "react-notification-badge"
import REMOVE_ICON from "resources/delete.png"
import utils from "utils"
import "./BlueprintOverrides.css"

const GQL_DELETE_NOTE = gql`
  mutation($uuid: String!) {
    deleteNote(uuid: $uuid)
  }
`

export { GRAPHQL_NOTES_FIELDS } from "components/Model"

export const EXCLUDED_ASSESSMENT_FIELDS = [
  "__recurrence",
  "__periodStart",
  "__relatedObjectType",
  INVISIBLE_CUSTOM_FIELDS_FIELD
]

const RelatedObjectNotes = ({
  notesElemId,
  relatedObject,
  notes: notesProp
}) => {
  const { currentUser } = useContext(AppContext)
  const latestNotesProp = useRef(notesProp)
  const notesPropUnchanged = _isEqualWith(
    latestNotesProp.current,
    notesProp,
    utils.treatFunctionsAsEqual
  )

  const [error, setError] = useState(null)
  const [hidden, setHidden] = useState(true)
  const [
    showRelatedObjectNoteModalKey,
    setShowRelatedObjectNoteModalKey
  ] = useState(null)
  const [noteType, setNoteType] = useState(null)
  const [notes, setNotes] = useState(notesProp)

  const notesElem = document.getElementById(notesElemId)

  useEffect(() => {
    if (!notesPropUnchanged) {
      latestNotesProp.current = notesProp
      setError(null)
      setNotes(notesProp)
    }
  }, [notesPropUnchanged, notesProp])

  const renderPortal = () => {
    const noNotes = _isEmpty(notes)
    const nrNotes = noNotes ? 0 : notes.length
    const badgeLabel = nrNotes > 10 ? "10+" : null

    return hidden ? (
      <div style={{ minWidth: 50, padding: 5, marginRight: 15 }}>
        <NotificationBadge
          count={nrNotes}
          label={badgeLabel}
          style={{ fontSize: "8px", padding: 4 }}
          effect={["none", "none"]}
        />
        <Button bsSize="small" onClick={toggleHidden} title="Show notes">
          <Icon icon={IconNames.COMMENT} />
        </Button>
      </div>
    ) : (
      <div
        style={{
          flexDirection: "column",
          alignItems: "flex-end",
          padding: 5,
          height: "100%",
          overflowX: "hidden"
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "flex-end",
            padding: 5
          }}
        >
          <h4 style={{ paddingRight: 5 }}>Notes</h4>
          <Button bsSize="small" onClick={toggleHidden} title="hidden notes">
            <Icon icon={IconNames.DOUBLE_CHEVRON_RIGHT} />
          </Button>
        </div>
        <Messages error={error} />
        <br />
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            flexWrap: "wrap",
            justifyContent: "space-evenly",
            width: "100%"
          }}
        >
          <Button
            bsStyle="primary"
            style={{ margin: "5px" }}
            onClick={() =>
              showRelatedObjectNoteModal("new", NOTE_TYPE.FREE_TEXT)
            }
          >
            Post new note
          </Button>
        </div>
        <br />
        <RelatedObjectNoteModal
          note={{
            type: noteType,
            noteRelatedObjects: [{ ...relatedObject }]
          }}
          currentObject={relatedObject}
          showModal={showRelatedObjectNoteModalKey === "new"}
          onCancel={cancelRelatedObjectNoteModal}
          onSuccess={hideNewRelatedObjectNoteModal}
        />
        {noNotes && (
          <div>
            <i>No notes</i>
          </div>
        )}

        <div
          style={{
            display: "flex",
            flexDirection: "column"
          }}
        >
          {notes.map(note => {
            const updatedAt = moment(note.updatedAt).fromNow()
            const byMe = Person.isEqual(currentUser, note.author)
            const canEdit =
              note.type !== NOTE_TYPE.PARTNER_ASSESSMENT &&
              note.type !== NOTE_TYPE.ASSESSMENT &&
              (byMe || currentUser.isAdmin())
            const isJson = note.type !== NOTE_TYPE.FREE_TEXT
            const jsonFields =
              isJson && note.text ? utils.parseJsonSafe(note.text) : {}
            const noteText = isJson
              ? jsonFields.text
              : parseHtmlWithLinkTo(note.text)
            return (
              <Panel
                key={note.uuid}
                bsStyle="primary"
                style={{ borderRadius: "15px" }}
              >
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
                  <i>{updatedAt}</i>{" "}
                  <LinkTo
                    modelType="Person"
                    model={note.author}
                    style={{ color: "white" }}
                  />
                  {canEdit && (
                    <>
                      <Button
                        title="Edit note"
                        onClick={() => showRelatedObjectNoteModal(note.uuid)}
                        bsSize="xsmall"
                        bsStyle="primary"
                      >
                        <Icon icon={IconNames.EDIT} />
                      </Button>
                      <RelatedObjectNoteModal
                        note={note}
                        currentObject={relatedObject}
                        showModal={showRelatedObjectNoteModalKey === note.uuid}
                        onCancel={cancelRelatedObjectNoteModal}
                        onSuccess={hideEditRelatedObjectNoteModal}
                        onDelete={hideDeleteRelatedObjectNoteModal}
                      />
                      <ConfirmDelete
                        onConfirmDelete={() => deleteNote(note.uuid)}
                        objectType="note"
                        objectDisplay={"#" + note.uuid}
                        title="Delete note"
                        bsSize="xsmall"
                        bsStyle="primary"
                      >
                        <img src={REMOVE_ICON} height={14} alt="Delete" />
                      </ConfirmDelete>
                    </>
                  )}
                </Panel.Heading>
                <Panel.Body>
                  <div
                    style={{
                      overflowWrap: "break-word",
                      /* IE: */ wordWrap: "break-word"
                    }}
                  >
                    {note.type === NOTE_TYPE.CHANGE_RECORD &&
                      (jsonFields.oldValue === jsonFields.newValue ? (
                        <span>
                          Field <b>{jsonFields.changedField}</b> was unchanged (
                          <em>'{jsonFields.oldValue}'</em>):
                        </span>
                      ) : (
                        <span>
                          Field <b>{jsonFields.changedField}</b> was changed
                          from <em>'{jsonFields.oldValue}'</em> to{" "}
                          <em>'{jsonFields.newValue}'</em>:
                        </span>
                      ))}
                    {note.type === NOTE_TYPE.PARTNER_ASSESSMENT && (
                      <>
                        <h4>
                          <u>
                            <b>Old-style partner assessment</b>
                          </u>
                        </h4>
                        {Object.keys(jsonFields)
                          .filter(field => field !== "text")
                          .map(field => (
                            <p key={field}>
                              <i>{field}</i>: <b>{jsonFields[field]}</b>
                            </p>
                          ))}
                      </>
                    )}
                    {note.type === NOTE_TYPE.ASSESSMENT && (
                      <>
                        <h4>
                          <u>
                            <b>Assessment</b>
                          </u>
                        </h4>
                        {Object.keys(jsonFields)
                          .filter(
                            field => !EXCLUDED_ASSESSMENT_FIELDS.includes(field)
                          )
                          .map(field => (
                            <p key={field}>
                              <i>{field}</i>: <b>{jsonFields[field]}</b>
                            </p>
                          ))}
                      </>
                    )}
                  </div>
                  <div
                    style={{
                      overflowWrap: "break-word",
                      /* IE: */ wordWrap: "break-word"
                    }}
                  >
                    {noteText}
                  </div>
                </Panel.Body>
              </Panel>
            )
          })}
        </div>
      </div>
    )
  }

  return notesElem && ReactDOM.createPortal(renderPortal(), notesElem)

  function toggleHidden() {
    setHidden(!hidden)
  }

  function showRelatedObjectNoteModal(key, type) {
    setError(null)
    setShowRelatedObjectNoteModalKey(key)
    setNoteType(type)
  }

  function cancelRelatedObjectNoteModal() {
    setError(null)
    setShowRelatedObjectNoteModalKey(null)
    setNoteType(null)
  }

  function hideNewRelatedObjectNoteModal(note) {
    notes.unshift(note) // add new note at the front
    setError(null)
    setShowRelatedObjectNoteModalKey(null)
    setNoteType(null)
    setNotes(notes)
  }

  function hideEditRelatedObjectNoteModal(note) {
    const newNotes = notes.filter(item => item.uuid !== note.uuid) // remove old note
    const roUuids = note?.noteRelatedObjects.map(nro => nro.relatedObjectUuid)
    if (roUuids?.includes(relatedObject?.relatedObjectUuid)) {
      newNotes.unshift(note) // add updated note at the front
    }
    setError(null)
    setShowRelatedObjectNoteModalKey(null)
    setNoteType(null)
    setNotes(newNotes)
  }

  function hideDeleteRelatedObjectNoteModal(uuid) {
    setShowRelatedObjectNoteModalKey(null)
    deleteNote(uuid)
  }

  function deleteNote(uuid) {
    const newNotes = notes.filter(item => item.uuid !== uuid) // remove note
    API.mutation(GQL_DELETE_NOTE, { uuid })
      .then(data => {
        setError(null)
        setNotes(newNotes) // remove note
      })
      .catch(error => {
        setError(error)
      })
  }
}
RelatedObjectNotes.propTypes = {
  notesElemId: PropTypes.string.isRequired,
  notes: PropTypes.arrayOf(Model.notePropType),
  relatedObject: Model.relatedObjectPropType
}
RelatedObjectNotes.defaultProps = {
  notesElemId: "notes-view",
  notes: []
}

export default RelatedObjectNotes
