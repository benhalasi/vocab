import { HTMLAttributes } from '@builder.io/qwik'

interface PaperAirplaneIconProps extends HTMLAttributes<SVGElement> {
  'stroke-width'?: number
}

const defaults = {"stroke-width":"1.5"}

export const PaperAirplaneIcon = (props: PaperAirplaneIconProps) => {
  const attrs = {...defaults, ...props}
  return (
    // @ts-ignore
    <svg {...attrs} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
      <path stroke-linecap="round" stroke-linejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"></path>
    </svg>
  )
 }
