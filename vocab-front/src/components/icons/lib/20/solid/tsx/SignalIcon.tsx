import { HTMLAttributes } from '@builder.io/qwik'

interface SignalIconProps extends HTMLAttributes<SVGElement> {

}

const defaults = {}

export const SignalIcon = (props: SignalIconProps) => {
  const attrs = {...defaults, ...props}
  return (
    // @ts-ignore
    <svg {...attrs} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
      <path d="M16.364 3.636a.75.75 0 00-1.06 1.06 7.5 7.5 0 010 10.607.75.75 0 001.06 1.061 9 9 0 000-12.728zM4.697 4.697a.75.75 0 00-1.061-1.06 9 9 0 000 12.727.75.75 0 101.06-1.06 7.5 7.5 0 010-10.607z"></path>
      <path d="M12.475 6.465a.75.75 0 011.06 0 5 5 0 010 7.07.75.75 0 11-1.06-1.06 3.5 3.5 0 000-4.95.75.75 0 010-1.06zM7.525 6.465a.75.75 0 010 1.06 3.5 3.5 0 000 4.95.75.75 0 01-1.06 1.06 5 5 0 010-7.07.75.75 0 011.06 0zM11 10a1 1 0 11-2 0 1 1 0 012 0z"></path>
    </svg>
  )
 }
