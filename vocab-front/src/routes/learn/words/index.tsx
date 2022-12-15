import { RequestHandler } from "@builder.io/qwik-city"
import { wordResource } from "~/api"
import { authed } from "~/auth"
import {
  isLearnPageSessionReady,
  LearnPageSession,
  ReadyLearnPageSession,
} from ".."
import { Option, QuestionData } from "../Question"

export const onGet: RequestHandler<QuestionData> = authed(
  async ({ session, redirect }) => {
    if (!session.pages.learnPage)
      throw redirect("/learn", "learn page session is absent")

    if (!isLearnPageSessionReady(session.pages.learnPage))
      throw redirect("/learn", "learn page session isn't ready")

    return fetchQuestion(session.pages.learnPage, session.user.uuid)
  }
)

export async function fetchQuestion(
  lps: ReadyLearnPageSession,
  userUuid: string
) {
  if (!lps.question.answare) {
    console.debug("refreshed without answare")
    return lps.question
  }

  if (lps.question.number == 20) {
    console.debug("answared x consecutive questions")
    lps.vocab = []
    lps.question.number = 0
  }

  if (lps.vocab.length === 0) {
    console.debug("fetching vocab")
    lps.vocab = await fetchWords(lps, userUuid)
  } else {
    console.debug("shuffling vocab")
    if (lps.question.answare === "correct") {
      const answareIndex = lps.question.options.findIndex(
        o => o.id === lps.question?.solution.id
      )

      lps.vocab.push(...lps.question.options.splice(answareIndex, 1))
    }

    lps.vocab.splice(6, 0, ...lps.question.options.splice(0, 1))
    lps.vocab.splice(8, 0, ...lps.question.options.splice(0, 1))
    lps.vocab.splice(10, 0, ...lps.question.options.splice(0, 1))
    lps.vocab.splice(14, 0, ...lps.question.options)
  }

  // console.log("pre vocab:", {
  //   vocab: (lps.vocab || []).map(vi => vi.known.word),
  //   options: (lps.question?.options || []).map(vi => vi.known.word),
  // })

  lps.vocab.forEach((o: Option) => (o.state = undefined))
  const options = lps.vocab.splice(0, 4) as Option[]

  // console.log("pos vocab:", {
  //   vocab: lps.vocab.map(vi => vi.known.word),
  //   options: options.map(vi => vi.known.word),
  // })

  lps.question = {
    number: (lps.question?.number || 0) + 1,
    answare: false,
    options: options,
    solution: options[Math.floor(Math.random() * options.length)],
  }

  return lps.question
}

export async function fetchWords(lps: LearnPageSession, userUuid: string) {
  return await wordResource
    .wordsPost({
      ownerUUID: userUuid,
      mode: lps.mode,
      known: lps.knownLanguage,
      learnt: lps.learntLanguage,
      amount: 20,
    })
    .then(response => response.data)
}
