import PropTypes from "prop-types"
import { Col, Row } from "react-bootstrap"
import Container from "react-bootstrap/Container"
import FormControl from "react-bootstrap/FormControl"
import FormGroup from "react-bootstrap/FormGroup"
import FormLabel from "react-bootstrap/FormLabel"

export const InputField = ({ field, form, ...others }) => {
  const { name } = field
  const { id, type, label, asA, children, ...additionals } = others

  const isInvalid = form.touched[name] && form.errors[name]

  return (
    <FormGroup controlId={id || name}>
      <Container>
        <Row>
          <Col sm={3}>
            <FormLabel>{label}</FormLabel>
          </Col>
          <Col sm={9}>
            <FormControl
              as={asA}
              type={asA ? undefined : type || "text"}
              {...field}
              isInvalid={isInvalid}
              {...additionals}
            >
              {children}
            </FormControl>
            <FormControl.Feedback type="invalid">
              {form.errors[name]}
            </FormControl.Feedback>
          </Col>
        </Row>
      </Container>
    </FormGroup>
  )
}

InputField.propTypes = {
  field: PropTypes.object,
  form: PropTypes.object
}
