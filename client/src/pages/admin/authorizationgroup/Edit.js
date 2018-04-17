import PropTypes from 'prop-types'
import React from 'react'
import Page from 'components/Page'

import Messages from 'components/Messages'
import Breadcrumbs from 'components/Breadcrumbs'

import AuthorizationGroupForm from 'pages/admin/authorizationgroup/Form'
import {AuthorizationGroup} from 'models'

import API from 'api'

import { setPageProps, PAGE_PROPS_NO_NAV } from 'actions'
import { connect } from 'react-redux'

class AuthorizationGroupEdit extends Page {

	static propTypes = Object.assign({}, Page.propTypes)

	constructor(props) {
		super(props, PAGE_PROPS_NO_NAV)

		this.state = {
			authorizationGroup: new AuthorizationGroup(),
			originalAuthorizationGroup : new AuthorizationGroup()
		}
	}

	fetchData(props) {
		API.query(/* GraphQL */`
				authorizationGroup(uuid:"${props.match.params.uuid}") {
				uuid, name, description
				positions { uuid, name, code, type, status, organization { uuid, shortName}, person { uuid, name } }
				status
			}
		`).then(data => {
			this.setState({
				authorizationGroup: new AuthorizationGroup(data.authorizationGroup),
				originalAuthorizationGroup : new AuthorizationGroup(data.authorizationGroup)
			})
		})
	}

	render() {
		let authorizationGroup = this.state.authorizationGroup
		return (
			<div>
				<Breadcrumbs items={[[authorizationGroup.name, AuthorizationGroup.pathFor(authorizationGroup)], ["Edit", AuthorizationGroup.pathForEdit(authorizationGroup)]]} />
				<Messages error={this.state.error} success={this.state.success} />

				<AuthorizationGroupForm original={this.state.originalAuthorizationGroup} authorizationGroup={authorizationGroup} edit />
			</div>
		)
	}
}

const mapDispatchToProps = (dispatch, ownProps) => ({
	setPageProps: pageProps => dispatch(setPageProps(pageProps))
})

export default connect(null, mapDispatchToProps)(AuthorizationGroupEdit)
