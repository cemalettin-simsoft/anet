import { DEFAULT_SEARCH_PROPS, PAGE_PROPS_NO_NAV } from "actions"
import API from "api"
import { gql } from "apollo-boost"
import {
  mapPageDispatchersToProps,
  PageDispatchersPropType,
  useBoilerplate
} from "components/Page"
import { Location } from "models"
import React from "react"
import { connect } from "react-redux"
import LocationForm from "./Form"

const GQL_GET_LOCATION_LIST = gql`
  query($locationQuery: LocationSearchQueryInput) {
    locationList(query: $locationQuery) {
      list {
        uuid
        name
      }
    }
  }
`
const locationQuery = {}

const LocationNew = ({ pageDispatchers }) => {
  const { loading, error, data } = API.useApiQuery(GQL_GET_LOCATION_LIST, {
    locationQuery
  })

  useBoilerplate({
    loading,
    error,
    pageProps: PAGE_PROPS_NO_NAV,
    searchProps: DEFAULT_SEARCH_PROPS,
    pageDispatchers
  })

  const location = new Location()

  return (
    <LocationForm
      initialValues={location}
      title="Create a new Location"
      locations={data?.locationList?.list || []}
    />
  )
}

LocationNew.propTypes = {
  pageDispatchers: PageDispatchersPropType
}

export default connect(null, mapPageDispatchersToProps)(LocationNew)
