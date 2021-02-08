import PropTypes from "prop-types"
import { Alert } from "react-bootstrap"

const Messages = ({ error, success }) => (
  <div>
    {error && (
      <Alert variant="danger">
        {error.statusText && `${error.statusText}: `}
        {error.message}
      </Alert>
    )}
    {success && <Alert variant="success">{success}</Alert>}
  </div>
)
Messages.propTypes = {
  error: PropTypes.object,
  success: PropTypes.string
}

export default Messages
