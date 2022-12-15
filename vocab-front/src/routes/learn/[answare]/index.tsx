import { RequestHandler } from "@builder.io/qwik-city"
import { eventApi } from "~/api"
import { authed } from "~/auth"
import { LearnPageSession } from ".."

export interface AnswareResponse {
  success: boolean
  correct: number
}

export const onPost: RequestHandler<AnswareResponse> = authed(
  ({ session, params, redirect }) => {
    if (!session.pages.learnPage)
      throw redirect("/learn", "learn page session is absent")

    const selectedOptionIndex = Number(params.answare)
    if (!isFinite(selectedOptionIndex))
      throw redirect("/learn", "selected option index is not aplicable")

    try {
      return handleAnsware(session.pages.learnPage, selectedOptionIndex)
    } catch (error) {
      throw redirect("/learn", "unable to handle answare: " + error)
    }
  }
)

function handleAnsware(lps: LearnPageSession, answareOptionIndex: number) {
  if (!lps.question) throw "no question"
  const answare = lps.question.options[answareOptionIndex]
  const success = answare.id == lps.question.solution.id
  lps.question.answare = success ? "correct" : "wrong"

  setTimeout(() => {
    eventApi.vocabItemVocabItemIdEventPost(answare.id as number, {
      type: "Q_CHOICE_4",
      success: success,
    })
    // .then(response => console.log('answare', response.data))
    if (!success)
      eventApi.vocabItemVocabItemIdEventPost(
        lps.question?.solution.id as number,
        {
          type: "Q_CHOICE_4_BAD_ALT",
          success: success,
        }
      )
    // .then(response => console.log('correct', response.data))
  }, 0)

  return {
    success: success,
    correct: lps.question.solution.id,
  } as AnswareResponse
}
