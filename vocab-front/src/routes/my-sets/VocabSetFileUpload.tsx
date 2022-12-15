import {
  $,
  component$,
  QwikChangeEvent,
  useClientEffect$,
  useStore,
} from "@builder.io/qwik"
import { VocabItemPayload } from "schema/core"
import { formatAmount } from "~/utils"

export interface VocabSetProps {
  hook: {
    vocabItems: VocabItemPayload[]
  }
}

interface Store {
  state: "INITIAL" | "PROCESSING" | "PROCCESSED"
  error?: string
  badRows: number
  badRowsText?: string
  foundWordsText: string
}

export default component$((props: VocabSetProps) => {
  const store: Store = useStore({
    state: "INITIAL",
    badRows: 0,
    foundWordsText: "Select a file to import a word batch.",
  })

  useClientEffect$(({ track }) => {
    track(() => store.badRows)
    track(() => store.state)

    store.badRowsText =
      store.badRows == 0
        ? undefined
        : "Skipped " + formatAmount(store.badRows, "row", "rows")

    store.foundWordsText = (() => {
      switch (store.state) {
        case "INITIAL":
          return "Select a file to import a word batch."
        case "PROCESSING":
          return "Processing"
        case "PROCCESSED":
          return store.error
            ? store.error
            : "Found " +
                formatAmount(props.hook.vocabItems.length, "word", "words")
      }
    })()
  })

  const process = $((event: QwikChangeEvent<HTMLInputElement>) => {
    store.state = "PROCESSING"
    store.badRows = 0

    const file = (event.target.files || [])[0]
    if (!file) {
      store.error = "No file found."
      store.state = "PROCCESSED"
      return
    }

    const reader = new FileReader()

    reader.addEventListener(
      "load",
      () => {
        const content = reader.result as string

        props.hook.vocabItems = content
          .split("\n")
          .map(row => row.split(";").map(c => c.normalize().trim()))
          .filter(cells => {
            const f = cells.length == 4
            if (!f) store.badRows++
            return f
          })
          .map(cells => {
            const vip: VocabItemPayload = {
              known: {
                word: cells[0],
                bracketInfo: cells[1],
              },
              learnt: {
                word: cells[2],
                bracketInfo: cells[3],
              },
            }
            return vip
          })
          .filter(vip => {
            const isWordValid = (w: string) => {
              return w && w.length > 0 && w.length < 60
            }

            const f =
              isWordValid(vip.known.word) &&
              isWordValid(vip.learnt.word) &&
              (!vip.known.bracketInfo || isWordValid(vip.known.bracketInfo)) &&
              (!vip.learnt.bracketInfo || isWordValid(vip.learnt.bracketInfo))

            if (!f) store.badRows++
            return f
          })

        if (props.hook.vocabItems.length === 0) {
          store.error = "Didn't found any words :("
        }

        console.log(props.hook.vocabItems)
        store.state = "PROCCESSED"
      },
      false
    )
    reader.readAsText(file)
  })

  return (
    <div class='form-control w-full max-w-xs'>
      <label class='label'>
        <span class='label-text'>Vocabulary file</span>
      </label>
      <input
        type='file'
        onChange$={process}
        class='file-input file-input-bordered w-full max-w-xs'
      />
      <label class='label'>
        <span class='label-text-alt'>{store.foundWordsText}</span>
        <span class='label-text-alt'>{store.badRowsText}</span>
      </label>
    </div>
  )
})
