import { HTMLAttributes } from '@builder.io/qwik'

interface PlusCircleIconProps extends HTMLAttributes<SVGElement> {
  'stroke-width'?: number
}

const defaults = {"stroke-width":"1.5"}

export const PlusCircleIcon = (props: PlusCircleIconProps) => {
  const attrs = {...defaults, ...props}
  return (
    // @ts-ignore
    <svg {...attrs} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
      <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"></path>
    </svg>
  )
 }
