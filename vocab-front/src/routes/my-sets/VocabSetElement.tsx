import { $, component$, useClientEffect$, useStore } from "@builder.io/qwik"
import {
  Language,
  VocabItem,
  VocabItemPayload,
  VocabSet,
  VocabSetState,
} from "schema/core"
import { CheckIcon } from "~/components/icons/lib/20/solid/tsx/CheckIcon"
import { PencilIcon } from "~/components/icons/lib/20/solid/tsx/PencilIcon"
import { TrashIcon } from "~/components/icons/lib/20/solid/tsx/TrashIcon"
import { XMarkIcon } from "~/components/icons/lib/20/solid/tsx/XMarkIcon"
import VocabSetFileUpload from "./VocabSetFileUpload"
import { VocabSetPost } from "./[vocabSetId]"

export interface VocabSetProps {
  vocabSet: VocabSet
}

export default component$((props: VocabSetProps) => {
  return (
    <section class='card card-compact h-fit w-96 max-w-full flex-1 bg-base-100 shadow-md md:max-w-md'>
      <div class='card-body'>
        <h2 class='card-title inline-flex flex-col place-items-start gap-0'>
          <span class='inline-flex gap-2'>
            <div
              class={[
                "badge badge-outline capitalize",
                props.vocabSet.state == "ENABLED"
                  ? "badge-success"
                  : "badge-warning",
              ].concat(" ")}
            >
              {props.vocabSet.state.toLowerCase()}
            </div>
            <div class='badge badge-outline uppercase '>
              {props.vocabSet.known}
            </div>
            <div class='badge badge-primary uppercase '>
              {props.vocabSet.learnt}
            </div>
          </span>
          <span>{"Vocabulary Set #" + props.vocabSet.id}</span>
        </h2>
        <p class='mt-0 grow-0 text-sm lowercase text-base-content text-opacity-50'>
          {props.vocabSet.upToDate == false ? (
            "up-to-date"
          ) : (
            <span class='inline-flex w-full max-w-full flex-row flex-nowrap gap-2'>
              <span class='w-0 flex-1 truncate'>
                The basis of this vocab set has been modified, you can press
                update to enable these changes for your vocabulary set.
              </span>
              <button class='badge badge-warning flex-none'>Update</button>
            </span>
          )}
        </p>
        <p>Vocabulary set description ... </p>
        <div class='divider mb-0 text-base-content text-opacity-20'>(#.#)</div>
        <div class='card-actions justify-end'>
          <label
            for={"vocab_set-m-" + props.vocabSet.id}
            class='btn btn-outline btn-sm'
          >
            edit
          </label>
          <VocabSetModal
            key={"jsxk-vs-m-" + props.vocabSet.id}
            id={"vocab_set-m-" + props.vocabSet.id}
            vocabSet={props.vocabSet}
          />
          <label
            for={"vocab_items-m-" + props.vocabSet.id}
            class='btn btn-outline btn-sm'
          >
            words
          </label>
          <VocabItemModal
            key={"jsxk-vi-m-" + props.vocabSet.id}
            vocabSet={props.vocabSet}
            id={"vocab_items-m-" + props.vocabSet.id}
            name={"Vocabulary Set #" + props.vocabSet.id}
            vocabItemsUrl={"/my-sets/" + props.vocabSet.id}
          />
        </div>
      </div>
    </section>
  )
})

export interface VocabSetModalProps {
  id: string
  vocabSet?: VocabSet
}

export const VocabSetModal = component$((props: VocabSetModalProps) => {
  const __vs = {
    ...{
      name: props.vocabSet
        ? "Vocabulary set #" + props.vocabSet.id
        : "New vocabulary set",
      state: VocabSetState.Enabled,
      shared: true,
      known: Language.En,
      learnt: Language.Nl,
    },
    ...props.vocabSet,
  }

  const store = useStore(
    {
      persisted: __vs,
      nameEdit: false,
      vocabItems: [] as VocabItemPayload[],
      update: {
        name: __vs.name,
        state: __vs.state,
        shared: __vs.shared,
        known: __vs.known,
        learnt: __vs.learnt,
      },
    },
    {
      recursive: true,
    }
  )

  const toggleNameEditMode = $(() => {
    store.nameEdit = !store.nameEdit
  })

  return (
    <>
      <input type='checkbox' id={props.id} class='modal-toggle' />
      <label for={props.id} class='modal modal-bottom sm:modal-middle'>
        <div class='modal-box flex w-full max-w-sm flex-col'>
          <div class='flex flex-row-reverse flex-nowrap items-center gap-1'>
            <label for={props.id} class='btn btn-ghost btn-circle btn-sm'>
              <XMarkIcon class='h-6 w-6' />
            </label>
            <div class='divider divider-horizontal m-0 ml-4 text-base-content text-opacity-20'></div>
            <div class='flex flex-auto flex-row flex-nowrap items-center gap-2'>
              {store.nameEdit ? (
                <>
                  <div class='form-control'>
                    <label class='input-group-md'>
                      <input
                        type='text'
                        placeholder='What is this?'
                        autoComplete='true'
                        autoCorrect='true'
                        class='input input-bordered input-md'
                        onChange$={e => {
                          store.update.name = e.target.value || "Unnamed set"
                        }}
                        value={store.update.name}
                      />
                    </label>
                  </div>
                  <button
                    onClick$={toggleNameEditMode}
                    class='btn btn-ghost btn-circle btn-xs'
                  >
                    <CheckIcon class='h-3 w-3' />
                  </button>
                </>
              ) : (
                <>
                  <h3 class='text-lg font-bold'>{store.update.name}</h3>
                  <button
                    onClick$={toggleNameEditMode}
                    class='btn btn-ghost btn-circle btn-xs'
                  >
                    <PencilIcon class='h-3 w-3' />
                  </button>
                </>
              )}
            </div>
          </div>
          <div class='divider divider-vertical m-0 text-base-content text-opacity-20'></div>
          <div class='my-4 overflow-x-auto'>
            <div class='form-control'>
              <label class='label cursor-pointer gap-2'>
                <span class='label-text'>
                  Should other people be able to find this word set?
                </span>
                <input type='checkbox' class='toggle' checked />
              </label>
            </div>
            <div class='form-control'>
              <label class='label'>
                <span class='label-text'>Should this set be practised?</span>
              </label>
              <select
                onChange$={e =>
                  (store.update.state = e.target.value as VocabSetState)
                }
                class='select select-bordered w-full'
                value={store.update.state}
              >
                <option disabled>Practise or not to practise?</option>
                {Object.keys(VocabSetState).map(option => (
                  <option
                    selected={
                      store.update.state.toLowerCase() == option.toLowerCase()
                    }
                  >
                    {option}
                  </option>
                ))}
              </select>
            </div>
            <div class='flex flex-row flex-wrap gap-2'>
              <div class='form-control max-w-full flex-auto'>
                <label class='label'>
                  <span class='label-text'>Known language</span>
                </label>
                <select
                  onChange$={e =>
                    (store.update.known = e.target.value as Language)
                  }
                  class='select select-bordered w-full'
                  value={store.update.known}
                >
                  <option disabled>Know language</option>
                  {Object.keys(Language).map(option => (
                    <option
                      value={option}
                      selected={
                        store.update.known.toLowerCase() == option.toLowerCase()
                      }
                    >
                      {option.toUpperCase()}
                    </option>
                  ))}
                </select>
              </div>
              <div class='form-control max-w-full flex-auto'>
                <label class='label'>
                  <span class='label-text'>Learnt language</span>
                </label>
                <select
                  onChange$={e =>
                    (store.update.learnt = e.target.value as Language)
                  }
                  class='select select-bordered w-full'
                  value={store.update.learnt}
                >
                  <option disabled>Learnt language</option>
                  {Object.keys(Language).map(option => (
                    <option
                      selected={
                        store.update.learnt.toLowerCase() ==
                        option.toLowerCase()
                      }
                    >
                      {option.toUpperCase()}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          {props.vocabSet ? <></> : <VocabSetFileUpload hook={store} />}
          <div class='modal-action flex-row-reverse justify-start gap-2'>
            <label
              for={props.id}
              onClick$={() => {
                const payload: VocabSetPost | VocabSetPost = {
                  ...store.update,
                  words: store.vocabItems,
                }

                fetch("/my-sets/" + (store.persisted.id || "-"), {
                  method: props.vocabSet ? "PUT" : "POST",
                  body: JSON.stringify(payload),
                })
              }}
              class='btn btn-primary btn-sm'
            >
              Save
            </label>
            {props.vocabSet ? (
              <label
                for={props.id}
                onClick$={() => {
                  fetch("/my-sets/" + store.persisted.id, {
                    method: "DELETE",
                  })
                }}
                class='btn btn-outline btn-error btn-sm'
              >
                Delete
              </label>
            ) : (
              <></>
            )}
          </div>
        </div>
      </label>
    </>
  )
})

export interface VocabItemModalProps {
  vocabSet: VocabSet
  name: string
  id: string
  vocabItemsUrl: string
}

export const VocabItemModal = component$((props: VocabItemModalProps) => {
  const resource: ClientResource<VocabItem[]> = useStore({
    state: "initial",
  })

  useClientEffect$(
    async () => {
      resource.state = "loading"
      fetch(props.vocabItemsUrl)
        .then(response => response.json())
        .then(result => {
          resource.result = result
          resource.state = "resolved"
          return result
        })
        .catch(reason => {
          console.warn("unable to resolve promise due to", reason)
          resource.state = "rejected"
        })
    },
    {
      eagerness: "visible",
    }
  )

  return (
    <>
      <input type='checkbox' id={props.id} class='modal-toggle' />
      <label for={props.id} class='modal modal-bottom sm:modal-middle'>
        <div class='modal-box flex w-full flex-col sm:w-max sm:max-w-full'>
          <div class='flex flex-row-reverse flex-nowrap items-center'>
            <label for={props.id} class='btn btn-ghost btn-circle btn-sm'>
              <XMarkIcon class='h-6 w-6' />
            </label>
            <h3 class='flex-grow text-lg font-bold'>{props.name}</h3>
          </div>
          <div class='my-4 overflow-x-auto'>
            {((r: ClientResource<VocabItem[]>) => {
              if (r.state == "initial" || r.state == "loading") {
                return <>Loading ...</>
              }
              if (r.state == "rejected") {
                return <>Error</>
              }

              return (
                <table class='table-zebra table w-full'>
                  <thead>
                    <tr>
                      <th></th>
                      <th>Known</th>
                      <th>Learnt</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {(r.result || []).map((vocabItem, index) => (
                      <VocabItemElement
                        key={["jsxk-", props.vocabSet.id, vocabItem.id].join(
                          ""
                        )}
                        vocabSet={props.vocabSet}
                        vocabItem={vocabItem}
                        index={index}
                      />
                    ))}
                  </tbody>
                </table>
              )
            })(resource)}
          </div>
          <div class='modal-action flex-row-reverse'>
            <label for={props.id} class='btn'>
              Okay
            </label>
          </div>
        </div>
      </label>
    </>
  )
})

export interface VocabItemElementProps {
  index: number
  vocabItem: VocabItem
  vocabSet: VocabSet
}
export const VocabItemElement = component$((props: VocabItemElementProps) => {
  const store = useStore(
    {
      editing: false,
      deleted: false,
      new: false,
      persisted: props.vocabItem,
      update: {
        known: {
          ...props.vocabItem.known,
        },
        learnt: {
          ...props.vocabItem.learnt,
        },
      },
    },
    {
      recursive: true,
    }
  )

  const remove = $(() => {
    store.deleted = true
  })

  const toggleEditMode = $(() => {
    store.editing = !store.editing
  })

  const saveEdit = $(() => {
    store.persisted.known.word = store.update.known.word
    store.persisted.known.bracketInfo = store.update.known.bracketInfo
    store.persisted.learnt.word = store.update.learnt.word
    store.persisted.learnt.bracketInfo = store.update.learnt.bracketInfo

    fetch("/my-sets/" + props.vocabSet.id + "/" + +props.vocabItem.id, {
      method: store.new ? "POST" : "PUT",
      body: JSON.stringify(store.update),
    }).then(() => {
      store.new = false
    })

    store.editing = !store.editing
  })

  return (
    <>
      {store.deleted ? (
        <tr>
          <td>{props.index + 1}</td>
          <td></td>
          <td></td>
          <td></td>
        </tr>
      ) : store.editing ? (
        <tr>
          <td>{props.index + 1}</td>
          <td class='align-top'>
            <div class='flex flex-col gap-x-2'>
              <div class='form-control'>
                <label class='input-group-sm'>
                  <input
                    type='text'
                    placeholder='known word'
                    autoComplete='true'
                    autoCorrect='true'
                    class='input input-bordered input-sm'
                    onChange$={e => (store.update.known.word = e.target.value)}
                    value={store.update.known.word}
                  />
                </label>
              </div>
              <div class='form-control'>
                <label class='input-group-sm'>
                  <textarea
                    placeholder='extra info'
                    autoComplete='true'
                    autoCorrect='true'
                    class='input input-bordered input-sm'
                    onChange$={e =>
                      (store.update.known.bracketInfo = e.target.value)
                    }
                    value={store.update.known.bracketInfo}
                  />
                </label>
              </div>
            </div>
          </td>
          <td class='align-top'>
            <div class='flex flex-col gap-x-2'>
              <div class='form-control'>
                <label class='input-group-sm'>
                  <input
                    type='text'
                    placeholder='learnt word'
                    autoComplete='true'
                    autoCorrect='true'
                    class='input input-bordered input-sm'
                    onChange$={e => (store.update.learnt.word = e.target.value)}
                    value={store.update.learnt.word}
                  />
                </label>
              </div>
              <div class='form-control'>
                <label class='input-group-sm'>
                  <textarea
                    placeholder='extra info'
                    autoComplete='true'
                    autoCorrect='true'
                    class='input input-bordered input-sm'
                    onChange$={e =>
                      (store.update.learnt.bracketInfo = e.target.value)
                    }
                    value={store.update.learnt.bracketInfo}
                  />
                </label>
              </div>
            </div>
          </td>
          <td>
            <div class='flex gap-1'>
              <button onClick$={toggleEditMode} class='btn btn-ghost btn-xs'>
                <XMarkIcon class='h-4 w-4' />
              </button>
              <button onClick$={saveEdit} class='btn btn-primary btn-xs'>
                <CheckIcon class='h-4 w-4' />
              </button>
            </div>
          </td>
        </tr>
      ) : (
        <tr>
          <th>{props.index + 1}</th>
          <td class='align-top'>
            <div class='flex flex-row flex-wrap gap-x-2'>
              <span
                class='w-full overflow-x-auto'
                style='max-width: min(33vw, 40ch);'
              >
                {props.vocabItem.known.word}
              </span>
              <span class='whitespace-normal text-base-content text-opacity-75'>
                {props.vocabItem.known.bracketInfo}
              </span>
            </div>
          </td>
          <td class='align-top'>
            <div class='flex flex-row flex-wrap gap-x-2'>
              <span
                class='w-full overflow-x-auto'
                style='max-width: min(33vw, 40ch);'
              >
                {props.vocabItem.learnt.word}
              </span>
              <span class='whitespace-normal text-base-content text-opacity-75'>
                {props.vocabItem.learnt.bracketInfo}
              </span>
            </div>
          </td>
          <td>
            <div class='flex gap-1'>
              <button onClick$={remove} class='btn btn-ghost btn-xs'>
                <TrashIcon class='h-4 w-4 text-error text-opacity-50' />
              </button>
              <button onClick$={toggleEditMode} class='btn btn-ghost btn-xs'>
                <PencilIcon class='h-4 w-4' />
              </button>
            </div>
          </td>
        </tr>
      )}
    </>
  )
})

export interface ClientResource<T> {
  result?: T
  state: "initial" | "loading" | "resolved" | "rejected"
}
