import { DEFAULT_SEARCH_PROPS, PAGE_PROPS_NO_NAV } from "actions"
import API from "api"
import { gql } from "apollo-boost"
import { getInvisibleFields } from "components/CustomFields"
import {
  DEFAULT_CUSTOM_FIELDS_PARENT,
  INVISIBLE_CUSTOM_FIELDS_FIELD
} from "components/Model"
import {
  mapPageDispatchersToProps,
  PageDispatchersPropType,
  useBoilerplate
} from "components/Page"
import { Person } from "models"
import React from "react"
import { connect } from "react-redux"
import Settings from "settings"
import PersonForm from "./Form"

const GQL_GET_PERSON_LIST = gql`
  query($personQuery: PersonSearchQueryInput) {
    personList(query: $personQuery) {
      list {
        uuid
        name
      }
    }
  }
`

const personQuery = {}

const PersonNew = ({ pageDispatchers }) => {
  const { loading, error, data } = API.useApiQuery(GQL_GET_PERSON_LIST, {
    personQuery
  })
  useBoilerplate({
    loading,
    error,
    pageProps: PAGE_PROPS_NO_NAV,
    searchProps: DEFAULT_SEARCH_PROPS,
    pageDispatchers
  })

  const person = new Person()

  if (person[DEFAULT_CUSTOM_FIELDS_PARENT]) {
    // set initial invisible custom fields
    person[DEFAULT_CUSTOM_FIELDS_PARENT][
      INVISIBLE_CUSTOM_FIELDS_FIELD
    ] = getInvisibleFields(
      Settings.fields.person.customFields,
      DEFAULT_CUSTOM_FIELDS_PARENT,
      person
    )
  }
  return (
    <PersonForm
      initialValues={person}
      title="Create a new Person"
      people={data?.personList?.list || []}
    />
  )
}

PersonNew.propTypes = {
  pageDispatchers: PageDispatchersPropType
}

export default connect(null, mapPageDispatchersToProps)(PersonNew)
