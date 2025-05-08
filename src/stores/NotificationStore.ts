import {
  createStore,
  fetchGetWithTriggers,
  fetchPostWithTriggers,
  EnhancedStore,
} from "./utils"

type NotificationId = string | number

interface QuerySet {
  queryName: string
  queryTime?: number
  queryAction?: string
}

interface NotificationStoreMethods {
  List(querySet?: QuerySet): void
  Dimiss(notificationId: NotificationId, querySet?: QuerySet): void
}

type NotificationStoreType = EnhancedStore & NotificationStoreMethods

const NotificationStore = createStore(
  (store): { name: string } & NotificationStoreMethods => ({
    name: "NotificationStore",

    List(querySet: QuerySet = { queryName: "notificationList" }): void {
      fetchGetWithTriggers({
        store: store as EnhancedStore,
        endpoint: "/api/v3/notifications",
        eventOk: "NOTIFICATION_LIST_OK",
        eventKO: "NOTIFICATION_LIST_KO",
      })
    },

    Dimiss(
      notificationId: NotificationId,
      querySet: QuerySet = {
        queryName: "notificationList",
        queryAction: "clear",
      }
    ): void {
      fetchPostWithTriggers<NotificationId>({
        store: store as EnhancedStore,
        endpoint: "/api/v3/notifications/dismiss",
        payload: notificationId,
        eventOk: "NOTIFICATION_DIMISS_OK",
        eventKO: "NOTIFICATION_DIMISS_KO",
      })
    },
  })
) as NotificationStoreType

export default NotificationStore
