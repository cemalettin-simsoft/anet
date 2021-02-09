import PropTypes from "prop-types"

function Fieldset({ title, action, children, ...otherProps }) {
  return (
    <fieldset {...otherProps}>
      <div className="fieldset-title-row">
        <h4>{title}</h4>
        {action}
      </div>
      <div className="fieldset-content">{children}</div>
    </fieldset>
  )
}

Fieldset.propTypes = {
  title: PropTypes.node,
  action: PropTypes.node,
  children: PropTypes.node
}

export default Fieldset
