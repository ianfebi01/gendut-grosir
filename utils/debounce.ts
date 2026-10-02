export type Debounced<T extends (...args: never[]) => unknown> = ((
  ...args: Parameters<T>
) => void) & { cancel: () => void }

/**
 * Delays calling `fn` until `wait` ms have passed since the last call.
 * Call `.cancel()` to drop a pending call (e.g. on unmount).
 */
export const debounce = <T extends (...args: never[]) => unknown>(
  fn: T,
  wait = 300,
): Debounced<T> => {
  let timer: ReturnType<typeof setTimeout> | undefined

  const debounced = (...args: Parameters<T>) => {
    clearTimeout(timer)
    timer = setTimeout(() => fn(...args), wait)
  }

  debounced.cancel = () => {
    clearTimeout(timer)
    timer = undefined
  }

  return debounced
}
