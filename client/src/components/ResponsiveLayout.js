import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'
import LoadingBar from 'react-redux-loading-bar'
import TopBar from 'components/TopBar'
import Nav from 'components/Nav'
import { Element } from 'react-scroll'


const container = {
	flex:'1 1 auto',
	display:'flex',
	flexDirection:'row'
}
const mainViewportContainer = {
	flex:'1 1 auto',
	overflowY: 'scroll',
	paddingLeft: 18,
	paddingRight: 18
}
const mainViewport = {
	flexGrow: 1,
	overflowY: 'auto',

}
const sidebarContainer = {
	flex:'0 0 auto',
	overflowY: 'scroll'
}
const sidebar = {
	flexGrow: 1,
	minWidth: 200,
	paddingTop: 10,
	paddingLeft: 8,
	paddingRight: 8
}
const glassPane = {
	position: 'absolute',
	backgroundColor: `rgba(0, 0, 0, 0.6)`,
	width: '100%',
	height: '100vh',
	marginTop: -5,
	left: 0,
	zIndex: 99,
}
const loadingBar = {
	backgroundColor: '#29d'
}


class ResponsiveLayout extends Component {
	static propTypes = {
		pageProps: PropTypes.shape({
			minimalHeader: PropTypes.bool,
		}).isRequired,
		pageHistory: PropTypes.object.isRequired,
		location: PropTypes.object.isRequired,
		sidebarData: PropTypes.array,
		children: PropTypes.node
	}

	constructor(props) {
		super(props)

		this.state = {
			floatingMenu: false,
			topbarHeight: 0,
		}
	}

	componentDidMount() {
		// We want to hide the floating menu on navigation events
		this.unlistenHistory = this.props.pageHistory.listen((location, action) => {
			this.showFloatingMenu(false)
		})
	}

	componentWillUnmount() {
		this.unlistenHistory()
	}

	handleTopbarHeight = (topbarHeight) => {
		this.setState({topbarHeight})
	}

	showFloatingMenu = (floatingMenu) => {
		this.setState({floatingMenu: floatingMenu})
	}

	render() {
		const { floatingMenu, topbarHeight } = this.state
		const { pageProps, location, sidebarData, children } = this.props

		return (
			<div className="anet" style={{display: 'flex', flexDirection: 'column', height:'100vh', overflow: 'hidden'}}>
				<TopBar
					topbarHeight={this.handleTopbarHeight}
					minimalHeader={pageProps.minimalHeader}
					location={location}
					toggleMenuAction={() => {
						this.showFloatingMenu(!floatingMenu)
					}} />
				<div style={container}>
					<LoadingBar showFastActions style={loadingBar} />
					<div
						style={floatingMenu === false ? null : glassPane}
						onClick={() => {
							this.showFloatingMenu(false)
						}}
					/>
					{(pageProps.useNavigation === true || floatingMenu === true) &&
						<div style={sidebarContainer} className={ floatingMenu === false ? "hidden-xs" : "nav-overlay"}>
							<div>
								<div style={sidebar}>
									{<Nav showFloatingMenu={this.showFloatingMenu} organizations={sidebarData} topbarOffset={topbarHeight} />}
								</div>
							</div>
						</div>
					}
					<Element
						style={mainViewportContainer}
						name="mainViewport"
						id="main-viewport"
					>
						{children}
					</Element>
				</div>
			</div>
		)
	}
}

export default withRouter(ResponsiveLayout)
