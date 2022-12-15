import {
  $,
  component$,
  Resource,
  useClientEffect$,
  useStore,
} from "@builder.io/qwik"
import {
  DocumentHead,
  RequestHandler,
  useEndpoint,
} from "@builder.io/qwik-city"
import { Language, Mode, VocabItem } from "schema/core"
import { vocabSetResource } from "~/api"
import { authed } from "~/auth"
import { ArrowPathIcon } from "~/components/icons/lib/24/outline/tsx/ArrowPathIcon"
import { ArrowTrendingDownIcon } from "~/components/icons/lib/24/outline/tsx/ArrowTrendingDownIcon"
import { ArrowTrendingUpIcon } from "~/components/icons/lib/24/outline/tsx/ArrowTrendingUpIcon"
import { ArrowUturnLeftIcon } from "~/components/icons/lib/24/outline/tsx/ArrowUturnLeftIcon"
import { CursorArrowRaysIcon } from "~/components/icons/lib/24/outline/tsx/CursorArrowRaysIcon"
import { isSessionSyncRequest, SessionSyncRequest } from "~/sync"
import { given } from "~/validation"
import Question, { QuestionData, QuestionStore } from "./Question"
import { fetchQuestion } from "./words"

export interface LearnPageStore {
  knownLanguage: Language
  learntLanguage: Language
  mode: Mode
  view: "INITIAL" | "READY"
}

export interface InitialLearnPageSession extends LearnPageStore {
  view: "INITIAL"
}

export interface ReadyLearnPageSession extends LearnPageStore {
  vocab: VocabItem[]
  question: QuestionData
  view: "READY"
}

export type LearnPageSession = InitialLearnPageSession | ReadyLearnPageSession

export function isLearnPageSessionReady(
  lps: LearnPageSession
): lps is ReadyLearnPageSession {
  return lps.view === "READY"
}

export const onGet: RequestHandler<LearnPageSession> = authed(
  async ({ session, redirect }) => {
    const createLps = async (): Promise<InitialLearnPageSession> => {
      const vocabSets = (await vocabSetResource.vocabSetGet(session.user.uuid))
        .data
      if (vocabSets.length === 0)
        throw redirect("/my-sets", "doesn't have any vocab-sets")

      return {
        view: "INITIAL",
        knownLanguage: vocabSets[0].known,
        learntLanguage: vocabSets[0].learnt,
        mode: "WEAK_WORDS",
      }
    }

    return (session.pages.learnPage ||= await createLps())
  }
)

export interface LearnPageRequest {
  action: "INITIAL" | "READY"
}

export const learnPagePut = (
  body: LearnPageRequest | SessionSyncRequest<LearnPageStore>
): Promise<LearnPageSession> => {
  return fetch("/learn/", {
    method: "PUT",
    body: JSON.stringify(body),
  }).then(response => response.json() as Promise<LearnPageSession>)
}

export const onPut = authed<LearnPageSession>(
  async ({ session, request, redirect }) => {
    const body = (await request.json()) as
      | LearnPageRequest
      | SessionSyncRequest<LearnPageStore>

    const lps: LearnPageSession | undefined = session.pages.learnPage
    if (!lps) throw redirect("/learn", "learn page session is absent")

    if (isSessionSyncRequest(body)) {
      console.log("sync")

      given(body.payload.knownLanguage)
        .kindOf(Language)
        .then(lang => (lps.knownLanguage = lang))

      given(body.payload.learntLanguage)
        .kindOf(Language)
        .then(lang => (lps.learntLanguage = lang))

      given(body.payload.mode)
        .kindOf(Mode)
        .then(mode => (lps.mode = mode))
    } else {
      switch (body.action) {
        case "INITIAL":
          console.log("initial")
          if (isLearnPageSessionReady(lps)) {
            const ilps: InitialLearnPageSession = {
              knownLanguage: lps.knownLanguage,
              learntLanguage: lps.learntLanguage,
              mode: lps.mode,
              view: "INITIAL",
            }
            return (session.pages.learnPage = ilps)
          } else {
            return lps
          }
        case "READY":
          console.log("ready")
          if (!isLearnPageSessionReady(lps)) {
            const rlps: ReadyLearnPageSession = {
              ...lps,
              vocab: [],
              question: { answare: "correct" } as QuestionData,
              view: "READY",
            }

            try {
              await fetchQuestion(rlps, session.user.uuid)
            } catch (error) {
              return lps
            }

            return (session.pages.learnPage = rlps)
          } else {
            return lps
          }
      }
    }

    return lps
  }
)

export default component$(() => {
  const resource = useEndpoint<LearnPageSession>()

  return (
    <Resource
      value={resource}
      onResolved={(lps: LearnPageSession) => (
        <LearnPageComponent lps={lps}></LearnPageComponent>
      )}
    />
  )
})

export const head: DocumentHead = {
  title: "Learn @ Wokabb",
}

export const LearnPageComponent = component$(
  (props: { lps: LearnPageSession }) => {
    const lps = props.lps

    const questionStore = useStore<QuestionStore>(
      {
        data: isLearnPageSessionReady(lps) ? lps.question : null,
      } as QuestionStore,
      {
        recursive: true,
      }
    )

    const store = useStore<LearnPageStore>(
      {
        knownLanguage: lps.knownLanguage,
        learntLanguage: lps.learntLanguage,
        mode: lps.mode,
        view: lps.view,
      },
      {
        recursive: true,
      }
    )

    useClientEffect$(({ track }) => {
      track(store)

      learnPagePut({
        action: "SYNC",
        payload: store,
      })
    })

    const goReady = $(async () => {
      learnPagePut({
        action: "READY",
      }).then(response => {
        if (!isLearnPageSessionReady(response))
          return console.warn("unable to start learn session")
        questionStore.data = response.question
        store.knownLanguage = response.knownLanguage
        store.learntLanguage = response.learntLanguage
        store.mode = response.mode
        store.view = response.view
      })
    })

    const goInitial = $(async () => {
      learnPagePut({
        action: "INITIAL",
      }).then(response => {
        if (isLearnPageSessionReady(response))
          return console.warn("unable to reset learn session")
        store.knownLanguage = response.knownLanguage
        store.learntLanguage = response.learntLanguage
        store.mode = response.mode
        store.view = response.view
      })
    })

    return (
      <>
        {store.view === "READY" ? (
          <div class='group m-auto flex h-fit max-w-full flex-col-reverse items-center justify-center gap-2 sm:p-20'>
            <div class='transition-transform duration-200 ease-in-out sm:-translate-y-full sm:pb-2 sm:group-focus-within:translate-y-0 sm:group-hover:translate-y-0'>
              <div class='card w-96 sm:bg-base-200'>
                <div class='card-body flex-col items-center text-center'>
                  <div class={"flex w-full flex-row justify-between"}>
                    <button
                      tabIndex={10}
                      class='btn btn-outline'
                      title='back to setup'
                      onClick$={goInitial}
                    >
                      <ArrowUturnLeftIcon class={"h-6 w-6"} />
                    </button>
                    <div class='btn-group'>
                      <button
                        disabled
                        tabIndex={10}
                        class='btn btn-outline'
                        title='previous question was hard'
                      >
                        <ArrowTrendingDownIcon class={"h-6 w-6"} />
                      </button>
                      <button
                        disabled
                        tabIndex={10}
                        class='btn btn-outline'
                        title='previous question was easy'
                      >
                        <ArrowTrendingUpIcon class={"h-6 w-6"} />
                      </button>
                      <button
                        disabled
                        tabIndex={10}
                        class='btn btn-outline'
                        title='previous answare was accidental'
                      >
                        <CursorArrowRaysIcon class={"h-6 w-6"} />
                      </button>
                    </div>
                    <div class='btn-group'>
                      <button
                        disabled
                        tabIndex={10}
                        class='btn btn-outline'
                        title='new question'
                      >
                        <ArrowPathIcon class={"h-6 w-6"} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class='rounded-2xl transition-shadow sm:shadow-sm sm:group-focus-within:shadow-lg sm:group-hover:shadow-lg'>
              <Question lpStore={store} questionStore={questionStore} />
            </div>
          </div>
        ) : (
          <div class='mx-auto flex max-w-full items-center justify-center'>
            <div class='flex flex-col gap-2'>
              <select
                class='select w-full max-w-xs'
                onChange$={e =>
                  (store.knownLanguage = e.target.value as Language)
                }
              >
                <option disabled>Known language</option>
                {Object.entries(Language).map(([, language]) => (
                  <option
                    value={language}
                    selected={store.knownLanguage === language}
                  >
                    {language.toUpperCase()}
                  </option>
                ))}
              </select>
              <select
                class='select w-full max-w-xs'
                onChange$={e =>
                  (store.learntLanguage = e.target.value as Language)
                }
              >
                <option disabled>Learnt language</option>
                {Object.entries(Language).map(([, language]) => (
                  <option
                    value={language}
                    selected={store.learntLanguage === language}
                  >
                    {language.toUpperCase()}
                  </option>
                ))}
              </select>
              <select
                class='select w-full max-w-xs'
                onChange$={e => (store.mode = e.target.value as Mode)}
              >
                <option disabled>Mode</option>
                {Object.values(Mode).map(mode => (
                  <option value={mode} selected={store.mode === mode}>
                    {mode.trim().replace("_", " ").toLowerCase()}
                  </option>
                ))}
              </select>
              <button class='btn btn-primary btn-block' onClick$={goReady}>
                START!
              </button>
            </div>
          </div>
        )}
      </>
    )
  }
)
