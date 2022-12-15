

export interface ValidationResult<T, R extends EnumObject> {
  kindOf: R
  isIt: () => boolean,
  orElse: (fallback: T) => T
  then: (action: (value: T) => any) => void
}

export type KindOfValidator<T, R extends EnumObject> = (enumObject: R) => ValidationResult<T, R>
export type EnumObject = { [s: string]: unknown; } | ArrayLike<unknown> | {}

export interface Validation<T> {
  kindOf: KindOfValidator<T, any>
}

function validate<T> (value: T): Validation<T> {

  function kindOf<R extends EnumObject> (
    enumObject: R
  ): ValidationResult<T, R> {

    const isIt = () => Object.values(enumObject).includes(value);
    const orElse = (fallback: T) => isIt() ? value : fallback;
    const then = (action: (value: T) => any) => {
      if (isIt()) action(value)
    };

    return {isIt, orElse, then, kindOf: enumObject}
  }

  return { kindOf }
}

export { validate as given }
