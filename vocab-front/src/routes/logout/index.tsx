import { RequestHandler } from "@builder.io/qwik-city"
import { deauth } from "~/auth"

export const onGet: RequestHandler<void> = deauth({
  withSession: async session => {
    console.debug(
      session.user.handle,
      "just logged out and we have to start a long running task"
    )
    await new Promise(res => {
      setTimeout(res, 5000)
    })
    console.debug(
      session.user.handle,
      "just logged out and the long running task finished."
    )
  },
})
