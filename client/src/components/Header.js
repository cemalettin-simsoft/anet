import CreateButton from "components/CreateButton"
import SearchBar from "components/SearchBar"
import PropTypes from "prop-types"
import React from "react"
import { Col, Grid, Row } from "react-bootstrap"
import { Link } from "react-router-dom"
import menuLogo from "resources/anet-menu.png"
import logo from "resources/logo.png"

const backgroundCss = {
  background: "#fff",
  paddingTop: "2em",
  paddingBottom: "1em",
  zIndex: 100,
  boxShadow: "0 4px 6px hsla(0, 0%, 0%, 0.2)"
}

const Header = ({ minimalHeader, onHomeClick, toggleMenuAction }) => (
  <header style={backgroundCss} className="header">
    <Grid fluid>
      <Row>
        <Col xs={3} sm={3} md={2} lg={2} id="anet-logo">
          {minimalHeader ? (
            <span className="logo hidden-xs">
              <img src={logo} alt="ANET Logo" />
            </span>
          ) : (
            <Link to="/" className="logo hidden-xs" onClick={onHomeClick}>
              <img src={logo} alt="ANET logo" />
            </Link>
          )}
          <span className="logo visible-xs">
            <img src={menuLogo} alt="ANET Menu" onClick={toggleMenuAction} />
          </span>
        </Col>

        {!minimalHeader && (
          <Col xs={6} sm={7} md={8} lg={9} className="middle-header">
            <SearchBar />
          </Col>
        )}

        {!minimalHeader && (
          <Col xs={3} sm={2} md={2} lg={1}>
            <div style={{ paddingRight: 5 }} className="pull-right">
              <CreateButton />
            </div>
          </Col>
        )}
      </Row>
    </Grid>
  </header>
)
Header.propTypes = {
  minimalHeader: PropTypes.bool,
  onHomeClick: PropTypes.func,
  toggleMenuAction: PropTypes.func
}

export default Header
