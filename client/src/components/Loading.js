import PropTypes from "prop-types"

function Loading({ isLoading = true }) {
  if (isLoading) {
    return <div className="loader" />
  }
}

Loading.propTypes = {
  isLoading: PropTypes.bool
}

export default Loading
