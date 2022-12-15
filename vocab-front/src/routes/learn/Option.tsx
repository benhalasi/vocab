import { component$, QRL } from "@builder.io/qwik"
import { Word } from "schema/core"
import { getEmojiFor } from "~/asciiemoji"

export default component$(
  (props: {
    word: Word
    xinfo?: string
    state: "option" | "pending" | "wrong" | "correct"
    onClick: QRL<() => void>
  }) => {
    return (
      <button
        tabIndex={1}
        onClick$={props.onClick}
        class={
          "btn flex h-fit max-w-full flex-grow flex-col flex-nowrap gap-1 p-2 text-lg normal-case focus-visible:outline-base-content " +
          (props.state === "option"
            ? "btn-outline"
            : props.state === "pending"
            ? "btn-primary"
            : props.state === "wrong"
            ? "btn-error"
            : props.state === "correct"
            ? "btn-success"
            : "")
        }
        style='min-width: 5ch;'
      >
        <span>{props.word.word}</span>
        <span class='max-w-full overflow-hidden whitespace-normal text-sm text-base-content text-opacity-70'>
          {(() => {
            const isBracketInfoPresent =
              props.word.bracketInfo && props.word.bracketInfo.trim().length > 0
            return isBracketInfoPresent ? (
              props.word.bracketInfo
            ) : (
              <span
                class={
                  "inline-block truncate text-xs text-base-content text-opacity-10"
                }
                style={
                  "max-width: " + (4 + (props.word.word.length / 3) * 4) + "ch;"
                }
              >
                {getEmojiFor(props.word.word)}
              </span>
            )
          })()}
        </span>
      </button>
    )
  }
)
