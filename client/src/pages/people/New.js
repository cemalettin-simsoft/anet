import { DEFAULT_SEARCH_PROPS, PAGE_PROPS_NO_NAV } from "actions"
import { initInvisibleFields } from "components/CustomFields"
import {
  mapPageDispatchersToProps,
  PageDispatchersPropType,
  useBoilerplate
} from "components/Page"
import { Person } from "models"
import React from "react"
import { connect } from "react-redux"
import Settings from "settings"
import { useAuthorizationGroupQuery } from "../PageCommonQueries"
import PersonForm from "./Form"

const PersonNew = ({ pageDispatchers }) => {
  const { loadingAuth, errorAuth, authGroups } = useAuthorizationGroupQuery()
  const { done, result } = useBoilerplate({
    loading: loadingAuth,
    error: errorAuth,
    pageProps: PAGE_PROPS_NO_NAV,
    searchProps: DEFAULT_SEARCH_PROPS,
    pageDispatchers
  })

  if (done) {
    return result
  }

  const person = new Person()

  // mutates the object
  initInvisibleFields(person, Settings.fields.person.customFields)

  return (
    <PersonForm
      initialValues={person}
      title="Create a new Person"
      authGroups={authGroups || {}}
    />
  )
}

PersonNew.propTypes = {
  pageDispatchers: PageDispatchersPropType
}

export default connect(null, mapPageDispatchersToProps)(PersonNew)
