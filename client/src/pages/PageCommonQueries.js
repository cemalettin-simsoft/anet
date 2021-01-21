import API from "api"
import { gql } from "apollo-boost"

const GQL_GET_AUTHORIZATION_GROUP_MINIMAL_LIST = gql`
  query($query: AuthorizationGroupSearchQueryInput) {
    authorizationGroupList(query: $query) {
      list {
        uuid
        positions {
          uuid
        }
      }
    }
  }
`

export const useAuthorizationGroupQuery = () => {
  const query = {
    pageSize: 0 // retrieve all
  }
  const { loading, error, data } = API.useApiQuery(
    GQL_GET_AUTHORIZATION_GROUP_MINIMAL_LIST,
    {
      query
    }
  )

  return {
    loadingAuth: loading,
    errorAuth: error,
    // return as { authGroupUuid1: Array<PositionUuid>, authGroupUuid2: Array<PositionUuid> }
    authGroups: data?.authorizationGroupList?.list.reduce((accum, ag) => {
      accum[ag.uuid] = ag.positions.map(p => p.uuid)
      return accum
    }, {})
  }
}
