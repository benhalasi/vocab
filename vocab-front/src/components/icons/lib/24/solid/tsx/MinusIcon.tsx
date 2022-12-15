import { HTMLAttributes } from '@builder.io/qwik'

interface MinusIconProps extends HTMLAttributes<SVGElement> {

}

const defaults = {}

export const MinusIcon = (props: MinusIconProps) => {
  const attrs = {...defaults, ...props}
  return (
    // @ts-ignore
    <svg {...attrs} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path fill-rule="evenodd" d="M3.75 12a.75.75 0 01.75-.75h15a.75.75 0 010 1.5h-15a.75.75 0 01-.75-.75z" clip-rule="evenodd"></path>
    </svg>
  )
 }
