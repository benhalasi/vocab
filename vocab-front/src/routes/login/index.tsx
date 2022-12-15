import { component$ } from "@builder.io/qwik"
import type { DocumentHead, RequestHandler } from "@builder.io/qwik-city"
import { authentication, notAuthed } from "~/auth"
import { validateInput } from "~/utils"

export const onGet: RequestHandler<void> = notAuthed()

export const onPost: RequestHandler<void> = authentication({
  whenBadCredentials: "?authnt",
  whenServiceUnavailable: "?service_unavailable",
})

export default component$(() => {
  return (
    <div class='mx-auto h-full w-full self-center bg-base-100 sm:card sm:my-2 sm:h-fit sm:w-fit sm:shadow-xl md:my-4 lg:card-side'>
      <figure>
        <img
          src='https://placeimg.com/640/640/arch'
          alt='Welcome to Wokabb mock up picture'
          width='320'
          height='320'
          class='h-80 w-full object-cover'
          loading='lazy'
        />
      </figure>
      <div class='card-body h-auto'>
        <h1 class='card-title'>Welcome to Wokabb</h1>
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
              name='password'
              type='password'
              placeholder='password'
              aria-label='password'
              required
              class='input input-bordered w-full'
              onBlur$={e => validateInput(e, "input-error")}
            />
          </div>
          <button type='submit' class='btn btn-primary w-full'>
            Login
          </button>
        </form>
        <p class='mt-auto grow-0 text-sm'>
          Registration currently is not possible.
        </p>
      </div>
    </div>
  )
})

export const head: DocumentHead = {
  title: "Login @ Wokabb",
}
