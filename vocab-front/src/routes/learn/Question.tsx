import { $, component$, useStore, useWatch$ } from "@builder.io/qwik"
import { Language, VocabItem } from "schema/core"
import { utterance } from "~/speech"
import { LearnPageStore } from "."
import Option from "./Option"
import { AnswareResponse } from "./[answare]"

export interface Option extends VocabItem {
  state?: "wrong" | "correct" | "pending"
}

export interface QuestionData {
  number: number
  answare: false | "wrong" | "correct"
  solution: Option
  options: Option[]
}

export interface QuestionStore {
  data: QuestionData
}

export interface QuestionProps {
  lpStore: LearnPageStore
  questionStore: QuestionStore
}

export default component$((props: QuestionProps) => {
  const store = useStore({
    answared: false,
  })

  useWatch$(async ({ track }): Promise<void> => {
    track(() => props.questionStore.data.answare)
    if (props.questionStore.data.answare !== false) {
      return fetch("/learn/words")
        .then(response => response.json())
        .then(questionData => {
          props.questionStore.data = questionData
          store.answared = false
        })
    }
  })

  const genChoose = (option: Option, index: number) => {
    return $(() => {
      if (store.answared) return

      option.state = "pending"
      store.answared = true

      fetch("/learn/" + index, {
        method: "POST",
      })
        .then(response => response.json())
        .then((response: AnswareResponse) => {
          const correctOption = props.questionStore.data.options.find(
            o => o.id == response.correct
          )

          if (!correctOption) return // invalid state

          correctOption.state = "correct"

          if (!response.success) {
            option.state = "wrong"
          }

          speak(props.lpStore.learntLanguage, correctOption.learnt.word, {
            rate: 0.8,
            timeout: 10000,
          }).catch(error => {
            console.warn("unable to speek due to", error)
          })

          const uiFeedback = new Promise(res => {
            setTimeout(res, response.success ? 350 : 1250)
          }).then(() => console.log("ui feedback"))

          // const prefetch = fetch("/learn").then(() =>
          //   console.log("prefetch")
          // )
          return Promise.all([uiFeedback]).finally(() => {
            props.questionStore.data.answare = response.success
              ? "correct"
              : "wrong"
          })
        })
    })
  }

  const QuestionComponent = (
    <div class='card w-96 sm:bg-base-200'>
      <div class='card-body items-center text-center'>
        <div class='absolute left-4 top-4 flex items-center gap-2'>
          <samp class='text-base-content text-opacity-60'>
            <em>{props.questionStore.data.number}</em>
          </samp>
          {props.questionStore.data.solution.lastDirectEvent ? (
            <samp class='text-base-content text-opacity-30'>
              {props.questionStore.data.solution.confidence}
            </samp>
          ) : (
            <span class='badge badge-info badge-sm'>NEW</span>
          )}
        </div>
        <h2 class='card-title'>
          {props.questionStore.data.solution.known.word}
        </h2>
        <p className='flex items-center'>
          {props.questionStore.data.solution.known.bracketInfo}
        </p>
        <div class='card-actions max-w-full justify-end'>
          {props.questionStore.data.options.map((option, index) => (
            <Option
              key={"jsxk-lpqo-" + option.id}
              state={option.state || "option"}
              word={option.learnt}
              onClick={genChoose(option, index)}
            />
          ))}
        </div>
      </div>
    </div>
  )
  return QuestionComponent
})

export interface SpeakProps {
  timeout?: number
  pitch?: number
  rate?: number
}

export function speak(
  language: Language,
  text: string,
  props: SpeakProps = {}
) {
  const config = {
    ...{
      timeout: 1500,
      pitch: 1,
      rate: 1,
    },
    ...props,
  }

  console.log(config)

  const ssu = utterance(language, text, 0)

  ssu.pitch = config.pitch
  ssu.rate = config.rate

  const speech = new Promise<void>((res, rej) => {
    ssu.onend = () => {
      res()
    }
    ssu.onerror = error => {
      rej(error)
    }
    setTimeout(rej.bind("timeout"), config.timeout)
  })
    .then(() => console.log("speech"))
    .catch(reason => console.log("speech rejected due to", reason))

  speechSynthesis.speak(ssu)
  return speech
}
