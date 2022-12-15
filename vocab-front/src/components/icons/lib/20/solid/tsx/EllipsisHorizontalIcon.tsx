import { HTMLAttributes } from '@builder.io/qwik'

interface EllipsisHorizontalIconProps extends HTMLAttributes<SVGElement> {

}

const defaults = {}

export const EllipsisHorizontalIcon = (props: EllipsisHorizontalIconProps) => {
  const attrs = {...defaults, ...props}
  return (
    // @ts-ignore
    <svg {...attrs} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
      <path d="M3 10a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zM8.5 10a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zM15.5 8.5a1.5 1.5 0 100 3 1.5 1.5 0 000-3z"></path>
    </svg>
  )
 }
