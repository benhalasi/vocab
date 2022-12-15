import { component$, Resource } from "@builder.io/qwik"
import { useEndpoint } from "@builder.io/qwik-city"
import { User } from "schema/core"
import { userResource } from "~/api"
import { sessionAware, SessionAwareAction } from "~/auth"
import { validateInput } from "~/utils"

export interface OhmResource {
  state: "ok"
}

const secret = process.env.WOCABB__MDLW_SECRET || "yes=please"
const superu = process.env.WOCABB__MDLW_SUPERU || "benph"

console.log("/debug/ohm/", { secret, superu })

const lock = new Uint8Array(1)
const tryLock = () => {
  const succ = Atomics.compareExchange(lock, 0, 0, 1) === 0
  console.log(lock, succ)
  return succ
}

const ohmAction: SessionAwareAction<OhmResource> = async ({
  request,
  session,
  redirect,
}) => {
  if (session !== undefined && session.user.handle === superu) {
    return { state: "ok" }
  }

  const query = request.url.split("?").slice(-1)[0]

  if (query === secret && tryLock()) {
    await new Promise<void>(resolve => {
      setTimeout(() => {
        resolve()
      }, 10000)
    })

    lock[0] = 0

    const benph = (
      await userResource.userAuthPost({
        handle: superu,
        password: "********",
      })
    ).data

    if (!benph) return { state: "ok" }
  }

  throw redirect("/login/", "unauthorized")
}

export const onGet = sessionAware<OhmResource>(ohmAction)

export const onPost = sessionAware<User>(async requestEvent => {
  await ohmAction(requestEvent)

  const form = await requestEvent.request.formData()
  console.debug("trying to registrate /w", form)

  try {
    const user = await userResource
      .userPost({
        handle: form.get("handle") as string,
        name: form.get("name") as string,
      })
      .then(response => response.data)

    throw requestEvent.redirect("?created-" + user.handle, "")
  } catch (error) {
    throw requestEvent.redirect("?notok", "")
  }
})

export default component$(() => {
  const r = useEndpoint<OhmResource>()

  return (
    <Resource
      value={r}
      onRejected={() => <div>whatyaupto?</div>}
      onResolved={() => (
        <div class='mx-auto h-full w-full self-center bg-base-100 sm:card sm:my-2 sm:h-fit sm:w-fit sm:shadow-xl md:my-4 lg:card-side'>
          <figure>
            <img
              src='https://placeimg.com/640/640/tech'
              alt='Welcome to Wokabb mock up picture'
              width='320'
              height='320'
              class='h-80 w-full object-cover'
              loading='lazy'
            />
          </figure>
          <div class='card-body h-auto'>
            <h1 class='card-title'>Hi there!</h1>
            <form action='' method='post' class='flex flex-col gap-2'>
              <div class='form-control w-full'>
                <input
                  name='handle'
                  placeholder='handle'
                  aria-label='handle'
                  required
                  class='input input-bordered w-full'
                  onBlur$={e => validateInput(e, "input-error")}
                />
              </div>
              <div class='form-control w-full'>
                <input
                  name='name'
                  placeholder='name'
                  aria-label='name'
                  required
                  class='input input-bordered w-full'
                  onBlur$={e => validateInput(e, "input-error")}
                />
              </div>
              <button type='submit' class='btn btn-primary w-full'>
                Registrate
              </button>
            </form>
          </div>
        </div>
      )}
    />
  )
})
