import { HTMLAttributes } from '@builder.io/qwik'

interface ArrowUturnDownIconProps extends HTMLAttributes<SVGElement> {
  'stroke-width'?: number
}

const defaults = {"stroke-width":"1.5"}

export const ArrowUturnDownIcon = (props: ArrowUturnDownIconProps) => {
  const attrs = {...defaults, ...props}
  return (
    // @ts-ignore
    <svg {...attrs} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
      <path stroke-linecap="round" stroke-linejoin="round" d="M15 15l-6 6m0 0l-6-6m6 6V9a6 6 0 0112 0v3"></path>
    </svg>
  )
 }
