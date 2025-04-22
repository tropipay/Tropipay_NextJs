import { createStore, fetchGetWithTriggers, EnhancedStore } from "./utils"

interface QuerySet {
  queryName: string
  queryTime?: number
}

interface UserRelationTypeStoreMethods {
  List(querySet?: QuerySet): void
}

type UserRelationTypeStoreType = EnhancedStore & UserRelationTypeStoreMethods

const UserRelationTypeStore = createStore(
  (store): { name: string } & UserRelationTypeStoreMethods => ({
    name: "UserRelationTypeStore",

    List(querySet: QuerySet = { queryName: "userRelationsList" }): void {
      fetchGetWithTriggers({
        store: store as EnhancedStore,
        endpoint: "/api/userRelations",
        eventOk: "USER_RELATION_TYPE_LIST_OK",
        eventKO: "USER_RELATION_TYPE_LIST_KO",
      })
    },
  })
) as UserRelationTypeStoreType

export default UserRelationTypeStore
