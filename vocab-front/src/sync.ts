
export interface SessionSyncRequest<T> {
  action: "SYNC"
  payload: T
}

export function isSessionSyncRequest<T> (req: {action: any}): req is SessionSyncRequest<T> {
  return req && req.action === "SYNC"
}
