import { QwikFocusEvent } from "@builder.io/qwik";

export function validateInput (event: QwikFocusEvent<HTMLInputElement>, invalidClass: string) {
  const target = event.target as HTMLElement;
  console.log('enabling ui validation; target:', target, " class:", invalidClass)
  target.classList.add('invalid:' + invalidClass)
}

export function formatAmount (amount: number, singular: string, plural: string) {
  console.log("format", amount, singular, plural)
  return "" + amount + " " + ((-2 < amount && amount < 2 && amount % 1 === 0)? singular : plural)
}
