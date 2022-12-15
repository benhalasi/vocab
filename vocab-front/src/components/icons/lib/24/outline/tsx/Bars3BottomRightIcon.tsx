import { HTMLAttributes } from '@builder.io/qwik'

interface Bars3BottomRightIconProps extends HTMLAttributes<SVGElement> {
  'stroke-width'?: number
}

const defaults = {"stroke-width":"1.5"}

export const Bars3BottomRightIcon = (props: Bars3BottomRightIconProps) => {
  const attrs = {...defaults, ...props}
  return (
    // @ts-ignore
    <svg {...attrs} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
      <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5M12 17.25h8.25"></path>
    </svg>
  )
 }
