import { component$, QRL, QwikChangeEvent, Slot } from "@builder.io/qwik"

export interface SnippetProps {
  id: string
}
export const Snippet = component$((props: SnippetProps) => {
  return (
    <span class={"relative max-w-full border-l-2 border-base-content "}>
      <button
        class={"btn btn-outline btn-primary btn-sm absolute right-2 "}
        onClick$={() => {
          navigator.clipboard.writeText(
            Array.from(document.querySelector("#" + props.id)?.childNodes || [])
              .filter(node => node.nodeType === 1 || node.nodeType === 3)
              .map(node => (node.nodeName === "BR" ? "\n" : node.textContent))
              .join("") || "Wasn't able to copy, sorry :("
          )
        }}
      >
        copy
      </button>
      <span
        id={props.id}
        class={
          "block max-w-full overflow-auto whitespace-nowrap py-2 pl-2 font-mono leading-tight"
        }
      >
        <Slot />
      </span>
    </span>
  )
})

export interface ContentEditableProps {
  id?: string
  value: string
  onChange$?: QRL<(event: QwikChangeEvent<HTMLSpanElement>) => any>
}
export const ContentEditable = component$((props: ContentEditableProps) => {
  return (
    <>
      <span
        id={props.id}
        class='snippet--content-editable'
        contentEditable='true'
        // @ts-ignore
        onKeyPress$={props.onChange$}
        onBlur$={props.onChange$}
      >
        {props.value}
      </span>
    </>
  )
})
