import { component$, useStylesScoped$ } from "@builder.io/qwik"
import { ChevronDownIcon } from "../icons/lib/20/solid/tsx/ChevronDownIcon"
import { AcademicCapIcon } from "../icons/lib/24/outline/tsx/AcademicCapIcon"
import { ArrowRightOnRectangleIcon } from "../icons/lib/24/outline/tsx/ArrowRightOnRectangleIcon"
import { BugAntIcon } from "../icons/lib/24/outline/tsx/BugAntIcon"
import { QwikLogo } from "../icons/qwik"
import styles from "./header.css?inline"

export default component$(() => {
  useStylesScoped$(styles)

  return (
    <div class='navbar bg-base-100 shadow-xl'>
      <QwikLogo></QwikLogo>
      <div class='flex-1'></div>

      <div class='flex-none gap-2'>
        <ul class='menu menu-horizontal gap-2 p-0'>
          <li class='hidden sm:flex'>
            <a href='/learn'>
              Learn
              <AcademicCapIcon class='h-4 w-4' />
            </a>
          </li>
          <li tabIndex={0} class='group'>
            <label>
              Vocabulary
              <span class='relative h-4 w-4'>
                <ChevronDownIcon class='absolute transition-transform group-hover:rotate-180 group-focus:rotate-180' />
              </span>
            </label>
            <ul class='right-0 z-10 bg-base-100 p-2 shadow-md focus-within:block group-focus-within:block'>
              <li class='sm:hidden'>
                <a href='/learn'>
                  Learn
                  <AcademicCapIcon class='h-4 w-4' />
                </a>
              </li>
              <li>
                <a href='/my-sets'>My Sets</a>
              </li>
              <li>
                <a href='/search'>Search</a>
              </li>
            </ul>
          </li>
        </ul>
        <div class='dropdown-end dropdown'>
          <label tabIndex={0} class='avatar btn btn-ghost btn-circle'>
            <div class='w-10 rounded-full'>
              <img
                src='https://placeimg.com/80/80/people'
                alt='avatar'
                loading='lazy'
              />
            </div>
          </label>
          <ul class='dropdown-content menu rounded-box menu-compact mt-3 w-52 bg-base-100 p-2 shadow'>
            <li>
              <a class='justify-between'>
                Profile
                <span class='badge'>Unavailable</span>
              </a>
            </li>
            <li>
              <a class='justify-between'>
                Settings
                <span class='badge'>Unavailable</span>
              </a>
            </li>
            <li>
              <a href='/debug' class='justify-between'>
                Debug
                <BugAntIcon class='h-4 w-4' />
              </a>
            </li>
            <li>
              <a href='/logout' class='justify-between'>
                Logout
                <ArrowRightOnRectangleIcon class='h-4 w-4'></ArrowRightOnRectangleIcon>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
})
