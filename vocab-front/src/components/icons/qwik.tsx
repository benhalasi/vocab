export const QwikLogo = () => (
  <svg
    stroke-width='2'
    xmlns='http://www.w3.org/2000/svg'
    fill='none'
    viewBox='0 0 24 24'
    stroke='currentColor'
    aria-hidden='true'
    class='h-12 w-12'
  >
    <defs>
      <radialGradient
        id='gradient'
        spreadMethod='reflect'
        cx='0'
        cy='0'
        fx='0.375'
        fy='0.52'
        r='0.75'
      >
        <stop stop-color='hsl(var(--s))' offset='0%'></stop>
        <stop stop-color='hsl(var(--p))' offset='100%'></stop>
      </radialGradient>

      <clipPath id='clip'>
        <path
          stroke-linecap='round'
          stroke-linejoin='round'
          d='M10.5 21l5.25-11.25L21 21m-9-3h7.5M3 5.621a48.474 48.474 0 016-.371m0 0c1.12 0 2.233.038 3.334.114M9 5.25V3m3.334 2.364C11.176 10.658 7.69 15.08 3 17.502m9.334-12.138c.896.061 1.785.147 2.666.257m-4.589 8.495a18.023 18.023 0 01-3.827-5.802'
        ></path>
      </clipPath>
    </defs>

    <rect
      id='background'
      x='0'
      y='0'
      width='24'
      height='24'
      stroke-width={1}
      clip-path='url(#clip)'
      fill="url('#gradient')"
    />

    <path
      stroke-linecap='butt'
      stroke-linejoin='bevel'
      stroke-width={0.33}
      d='M10.5 21l5.25-11.25L21 21m-9-3h7.5M3 5.621a48.474 48.474 0 016-.371m0 0c1.12 0 2.233.038 3.334.114M9 5.25V3m3.334 2.364C11.176 10.658 7.69 15.08 3 17.502m9.334-12.138c.896.061 1.785.147 2.666.257m-4.589 8.495a18.023 18.023 0 01-3.827-5.802'
    ></path>
  </svg>
)
