import { component$, Resource } from "@builder.io/qwik"
import { DocumentHead, useEndpoint } from "@builder.io/qwik-city"
import { User } from "schema/core"
import { getEmojiFor } from "~/asciiemoji"

import { authed } from "~/auth"
import { PlusIcon } from "~/components/icons/lib/20/solid/tsx/PlusIcon"
import { ContentEditable, Snippet } from "~/components/Snippet"

export const head: DocumentHead = {
  title: "Wokabb",
}

export const onGet = authed<User>(({ session }) => session.user)

export default component$(() => {
  const resource = useEndpoint<User>()

  return (
    <Resource
      value={resource}
      onResolved={(user: User) => (
        <div
          class='prose mx-auto p-4'
          style={"max-width: calc(min(100%, 65ch))"}
        >
          <article>
            <h1 class='my-3 text-4xl'>Wazzup {user.name}?!</h1>
            <p>
              Good to see you here and all of that nice stuff... You can go
              learn words or read about the ins and outs of this project and
              it's backlog.
            </p>
          </article>
          <article>
            <h2 class='divider text-2xl'>How to x, y and z?</h2>
            <h3 class='my-2 text-lg'>Add words to you profile:</h3>
            <ol class='ml-4 list-decimal pl-2'>
              <li>
                <a href='/my-sets'>goto `my sets` page</a>
              </li>
              <li>
                <span class='inline-flex flex-row items-center gap-2'>
                  <span>click on the</span>
                  <div class='group'>
                    <label class='btn glass btn-circle hover:translate-y-20 hover:opacity-0 group-hover:translate-x-20'>
                      <PlusIcon class='h-8 w-8' />
                    </label>
                  </div>
                </span>
              </li>
              <li>choose your known and learnt languages</li>
              <li>
                <span class='inline-flex max-w-full flex-col'>
                  <span>upload a vocabulary text file</span>
                  <span>
                    You extract this file from{" "}
                    <a href='#extract_words_from_quizlet'>quizlet</a> or you can
                    create one manualy like this:
                  </span>
                  <Snippet id='vocabulary-upload-file'>
                    # file: <em>my-vocabulary-set.csv</em>
                    <br />
                    known word<i class={"text-error"}>;</i> know word's info
                    <i class={"text-error"}>;</i> learnt word
                    <i class={"text-error"}>;</i> learnt word's info
                    <br />
                    known word<i class={"text-error"}>;</i> know word's info
                    <i class={"text-error"}>;</i> learnt word
                    <i class={"text-error"}>;</i> learnt word's info
                    <br />
                    known word<i class={"text-error"}>;</i> know word's info
                    <i class={"text-error"}>;</i> learnt word
                    <i class={"text-error"}>;</i> learnt word's info
                    <br /># word without <em>known word info</em>:
                    <br />
                    known word<i class={"text-error"}>;</i>
                    <i class={"text-error"}>;</i> learnt word
                    <i class={"text-error"}>;</i> learnt word's info
                    <br /># word without <em>learnt word info</em>:
                    <br />
                    known word<i class={"text-error"}>;</i> known word's info
                    <i class={"text-error"}>;</i> learnt word
                    <i class={"text-error"}>;</i>
                    <br />
                  </Snippet>
                  <span>
                    Important that the{" "}
                    <kbd
                      class={"rounded-md bg-base-100 px-1.5 py-0.5 font-sans"}
                    >
                      ;
                    </kbd>{" "}
                    and{" "}
                    <kbd
                      class={"rounded-md bg-base-100 px-1.5 py-0.5 font-sans"}
                    >
                      new line
                    </kbd>{" "}
                    characters are have to be strictly in place.
                  </span>
                </span>
              </li>
            </ol>
            <h3 id='extract_words_from_quizlet' class='my-2 text-lg'>
              Extract words from quizlet:
            </h3>
            <ol class='ml-4 list-decimal pl-2'>
              <li>
                Find a great set like{" "}
                <a
                  target='_blank'
                  href='https://quizlet.com/nl/218837040/hoofdstuk-4-nederlands-in-gang-nederlands-engels-flash-cards/'
                >
                  this one
                </a>
              </li>
              <li>
                press{" "}
                <kbd class={"rounded-md bg-base-100 px-1.5 py-0.5 font-sans"}>
                  ctrl + shift + i
                </kbd>
              </li>
              <li>
                <span class='inline-flex max-w-full flex-col'>
                  <span>
                    specify the set's known and learnt languages - you do that
                    in this snippet - and copy-paste this thing into the{" "}
                    <em>console</em>{" "}
                    <span class={"text-base-content text-opacity-70"}>
                      that you opened up in the previous step
                    </span>{" "}
                  </span>
                  <Snippet id='quizlet-snippet'>
                    known = '
                    <ContentEditable value='lang-en' />
                    ';
                    <br />
                    learnt = '<ContentEditable value='lang-nl' />
                    ';
                    <br />
                    {
                      "(()=>{const rows=Array.from(document.querySelectorAll('.SetPageTerms-term')).map((term)=>{return{k:term.querySelector('.'+known).textContent,l:term.querySelector('.'+learnt).textContent}}).map(({k,l})=>{const xinfo=(w)=>{return[...w.matchAll('\\\\(.*?\\\\)')].flatMap((x)=>(Array.isArray(x)?x:[x])).map((x)=>x.slice(1,-1).trim()).join(' | ')};const trunc=(w)=>w.replaceAll(new RegExp('\\\\(.*?\\\\)','g'),'').trim();return[trunc(k),xinfo(k),trunc(l),xinfo(l)].join('; ')});const text=['# Vocab App compatible word set csv upload. ','# generated at '+new Date().toLocaleString(),'# based on '+window.location.href,'','',...rows,''].join('\\n');const textBlob=new Blob([text],{type:'text/plain'});const downloadAnchor=document.createElement('a');downloadAnchor.download='vocabulary set - '+document.title+' - '+new Date().toLocaleString()+'.csv';downloadAnchor.href=window.URL.createObjectURL(textBlob);downloadAnchor.click()})();"
                    }
                  </Snippet>
                </span>
              </li>
            </ol>
          </article>
          <article>
            <h2 class='divider'>Fixes, Updates and Changes</h2>
            <ul>
              <li>
                <span className='badge badge-success badge-outline mr-2'>
                  fixed
                </span>
                <a href='/learn'>@Learn Page</a> on setup view, when default
                configuration is changed, the change has no effect on generated
                questions.
              </li>
              <li>
                <span className='badge badge-success badge-outline mr-2'>
                  solved
                </span>
                <a href='/learn'>@Learn Page</a> unable to re-initalize the
                learn session - meaning you can't go back to the setup view to
                change the question generation behaviour or the languages you
                want to learn — solution: when hovering/focusing the question
                card, you will see a panel showing up, where you can go back to
                the setup view.
              </li>
              <li>
                <span className='badge badge-success badge-outline mr-2'>
                  new
                </span>
                <a class={"mr-1"} href='/learn'>
                  @Learn Page
                </a>
                <span class={"mr-1"}>
                  Options without extra info are getting a nice emoji like
                </span>
                <ContentEditable
                  value='this one here:'
                  onChange$={e =>
                    ((
                      document.querySelector("#emoji") || { textContent: "" }
                    ).textContent = getEmojiFor(e.target.textContent || ""))
                  }
                />{" "}
                <samp id='emoji' class='mx-2 whitespace-nowrap'>
                  {getEmojiFor("this one here:")}
                </samp>
              </li>
            </ul>
          </article>
          <article>
            <h2 class='divider'>Known Issues and Limitations</h2>
            <p>
              We have a bunch of unimplemented features, halfly done functions
              and for a good measure; bugs. Here are some that we know of:
              <ul>
                <li>
                  <a href='/my-sets'>@My Sets Page</a> doesn't update the
                  vocabulary-set list when one is added or deleted — solution:
                  manual refresh
                </li>
                <li>
                  <a href='/my-sets'>@My Sets Page</a> cannot add words to
                  existing vocabulary sets
                </li>
                <li>
                  <a href='/my-sets'>@My Sets Page</a> doesn't have pagination
                  for the sets and for their words, this could cause slow page
                  load and bad performance.
                </li>
                <li>
                  <a href='/search'>@Search Page</a> is not implemented yet.
                </li>
              </ul>
            </p>
          </article>
        </div>
      )}
    />
  )
})
