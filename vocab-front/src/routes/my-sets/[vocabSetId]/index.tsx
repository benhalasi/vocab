import { RequestHandler } from "@builder.io/qwik-city"
import {
  Language,
  VocabItem,
  VocabItemPayload,
  VocabSet,
  VocabSetPayload,
  VocabSetState,
} from "schema/core"
import { vocabItemResource, vocabSetResource } from "~/api"
import { authed } from "~/auth"

export const onGet: RequestHandler<VocabItem[]> = authed(({ params }) => {
  return vocabItemResource
    .vocabItemGet(Number.parseInt(params.vocabSetId))
    .then(response => response.data)
})

export const onDelete: RequestHandler<void> = authed(({ session, params }) => {
  const vocabSetId = Number.parseInt(params.vocabSetId)
  vocabSetResource.vocabSetIdDelete(vocabSetId, session.user.uuid)
})

export const onPut: RequestHandler<void> = authed(
  async ({ session, request, params }) => {
    const vocabSetId = Number.parseInt(params.vocabSetId)
    const form: VocabSetPayload = await request.json()
    const payload: VocabSetPayload = {
      known: form.known.toLowerCase() as Language,
      learnt: form.learnt.toLowerCase() as Language,
      state: form.state.toUpperCase() as VocabSetState,
    }
    vocabSetResource.vocabSetIdPut(vocabSetId, session.user.uuid, payload)
  }
)

export interface VocabSetPost extends VocabSetPayload {
  words: VocabItemPayload[]
}

export const onPost: RequestHandler<void> = authed(
  async ({ session, request }) => {
    const form: VocabSetPost = await request.json()
    const payload: VocabSetPayload = {
      known: form.known.toLowerCase() as Language,
      learnt: form.learnt.toLowerCase() as Language,
      state: form.state.toUpperCase() as VocabSetState,
    }

    console.log("got words:", form.words)

    return vocabSetResource
      .vocabSetPost(session.user.uuid, payload)
      .then(response => response.data)
      .then((vocabSet: VocabSet) => {
        console.log("new vs id", vocabSet.id)
        return Promise.all(
          form.words.map(vocabItem => {
            const vocabItemPayload: VocabItemPayload = {
              known: {
                word: vocabItem.known.word,
                bracketInfo: vocabItem.known.bracketInfo,
              },
              learnt: {
                word: vocabItem.learnt.word,
                bracketInfo: vocabItem.learnt.bracketInfo,
              },
            }
            return vocabItemResource.vocabItemPost(
              vocabSet.id,
              vocabItemPayload
            )
          })
        )
      })
      .then(() => {
        console.log("vocab set populated")
      })
  }
)
