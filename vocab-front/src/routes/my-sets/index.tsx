import { component$, Resource } from "@builder.io/qwik"
import {
  DocumentHead,
  RequestHandler,
  useEndpoint,
} from "@builder.io/qwik-city"
import { VocabSet } from "schema/core"
import { vocabSetResource } from "~/api"

import { authed } from "~/auth"
import { PlusIcon } from "~/components/icons/lib/20/solid/tsx/PlusIcon"
import VocabSetCard, { VocabSetModal } from "./VocabSetElement"

export const head: DocumentHead = {
  title: "Learn @ Wokabb",
}

export const onGet: RequestHandler<VocabSet[]> = authed(({ session }) => {
  return vocabSetResource
    .vocabSetGet(session.user.uuid)
    .then(response => response.data)
})

export default component$(() => {
  const resource = useEndpoint<VocabSet[]>()

  return (
    <>
      <Resource
        value={resource}
        onPending={() => <div>Loading...</div>}
        onRejected={() => <div>Error</div>}
        onResolved={(vocabsets: VocabSet[]) => (
          <div class='mt-4 flex w-full flex-row flex-wrap content-start gap-2 p-2'>
            {vocabsets.map(vocabSet => (
              <VocabSetCard vocabSet={vocabSet} />
            ))}
          </div>
        )}
      />

      <label
        for={"vocab_set-m-new"}
        class='btn glass btn-circle fixed right-4 bottom-4'
      >
        <PlusIcon class='h-8 w-8' />
      </label>
      <VocabSetModal key={"jsxk-vs-m-new"} id={"vocab_set-m-new"} />
    </>
  )
})
