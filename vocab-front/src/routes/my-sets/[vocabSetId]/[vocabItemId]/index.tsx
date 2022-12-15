import { VocabItemPayload } from "schema/core"
import { vocabItemResource } from "~/api"
import { authed } from "~/auth"

export const onPut = authed(async ({ params, request }) => {
  const vocabItemId = Number.parseInt(params.vocabItemId)
  const vocabSetId = Number.parseInt(params.vocabSetId)
  const payload = await request.json()
  await vocabItemResource.vocabItemIdPut(vocabItemId, vocabSetId, payload)
})

export const onDelete = authed(async ({ params }) => {
  const vocabItemId = Number.parseInt(params.vocabItemId)
  const vocabSetId = Number.parseInt(params.vocabSetId)
  await vocabItemResource.vocabItemIdDelete(vocabItemId, vocabSetId)
})

export const onPost = authed(async ({ params, request }) => {
  const vocabItemId = Number.parseInt(params.vocabItemId)
  const payload: VocabItemPayload = await request.json()
  await vocabItemResource.vocabItemPost(vocabItemId, payload)
})
