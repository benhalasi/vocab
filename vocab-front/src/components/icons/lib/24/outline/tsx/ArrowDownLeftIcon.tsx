import { HTMLAttributes } from '@builder.io/qwik'

interface ArrowDownLeftIconProps extends HTMLAttributes<SVGElement> {
  'stroke-width'?: number
}

const defaults = {"stroke-width":"1.5"}

export const ArrowDownLeftIcon = (props: ArrowDownLeftIconProps) => {
  const attrs = {...defaults, ...props}
  return (
    // @ts-ignore
    <svg {...attrs} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
      <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 4.5l-15 15m0 0h11.25m-11.25 0V8.25"></path>
    </svg>
  )
 }
