import { component$, Slot } from "@builder.io/qwik"
import Header from "../components/header/header"

export default component$(() => {
  return (
    <>
      <main class='flex flex-grow flex-col bg-base-300'>
        <Header />
        <section class='flex flex-auto'>
          <Slot />
        </section>
      </main>
      <footer class='flex-grow-0'></footer>
    </>
  )
})
