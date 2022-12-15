import { component$, Resource } from "@builder.io/qwik"
import { RequestHandler, useEndpoint } from "@builder.io/qwik-city"
import { authed, Session } from "~/auth"

// Array.from(document.querySelector('.pages .learnPage .vocab').querySelectorAll('.lastEvent'))
// .map(le => (le.childElementCount == 0)? 0 : le.querySelector('.confidenceSnapshot').textContent)

export const onGet: RequestHandler<Session> = authed(({ session }) => session)

export default component$(() => {
  const sessionResource = useEndpoint<Session>()

  return (
    <Resource
      value={sessionResource}
      onPending={() => <div>Loading...</div>}
      onRejected={() => <div>Error</div>}
      onResolved={session => <article>{ListItem(session)}</article>}
    />
  )
})

export function ListItem(item: any, key?: string | number, depth = 0) {
  function asPrimitive() {
    return (
      <code>
        <var>{key}</var>:&nbsp;
        <samp class={key as string}>{JSON.stringify(item)}</samp>
      </code>
    )
  }

  function xstyle() {
    if (!depth) return ""
    const colors = [
      "var(--p)",
      // 'var(--pc)',
      "var(--s)",
      // 'var(--sc)',
      "var(--a)",
      // 'var(--ac)',
      // 'var(--n)',
      // 'var(--nf)',
      // 'var(--nc)'
    ]

    return "border-left: solid hsl(" + colors[depth % colors.length] + ") 1px;"
  }

  if (!item) return asPrimitive()
  switch (typeof item) {
    case "object":
      if (Array.isArray(item)) {
        return (
          <>
            <var>{key}</var>
            <ol class={key as string} style={xstyle()}>
              {item.map((value, index) => (
                <li class='ml-2'>{ListItem(value, index, depth + 1)}</li>
              ))}
            </ol>
          </>
        )
      } else {
        return (
          <>
            <var>{key}</var>
            <ul class={key as string} style={xstyle()}>
              {Object.entries(item).map(([key, value]) => (
                <li class='ml-2'>{ListItem(value, key, depth + 1)}</li>
              ))}
            </ul>
          </>
        )
      }
    default:
      return asPrimitive()
  }
}
