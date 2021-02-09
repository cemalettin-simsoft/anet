import PropTypes from "prop-types"
import { useState } from "react"
import Button from "react-bootstrap/Button"
import Modal from "react-bootstrap/Modal"

function ButtonWithModalTrigger({
  buttonLabel,
  modalTitle,
  modalBody,
  confirmButtonLabel,
  onConfirm,
  otherButtonProps,
  confirmButtonProps,
  otherModalProps
}) {
  const [show, setShow] = useState(false)

  return (
    <>
      <Button {...otherButtonProps} onClick={() => setShow(true)}>
        {buttonLabel}
      </Button>
      <Modal {...otherModalProps} show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{modalTitle}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{modalBody}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button {...confirmButtonProps} onClick={handlePrimary}>
            {confirmButtonLabel}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )

  function handleClose() {
    setShow(false)
  }

  function handlePrimary() {
    onConfirm()
  }
}

ButtonWithModalTrigger.propTypes = {
  buttonLabel: PropTypes.node,
  modalTitle: PropTypes.node,
  modalBody: PropTypes.node,
  confirmButtonLabel: PropTypes.node,
  onConfirm: PropTypes.func,
  otherButtonProps: PropTypes.object,
  confirmButtonProps: PropTypes.object,
  otherModalProps: PropTypes.object
}

export default ButtonWithModalTrigger
