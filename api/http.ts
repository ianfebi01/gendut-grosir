const NO_CONTENT = 204

/**
 * Error thrown for any non-2xx response. Mirrors the shape of ofetch's
 * FetchError (`.status`, `.data`) so existing `e?.data?.message` handling
 * keeps working.
 */
export class ApiError<T = unknown> extends Error {
  status: number
  data: T

  constructor(status: number, data: T) {
    const message =
      (data as { message?: string } | undefined)?.message ??
      `Request failed with status ${status}`
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.data = data
  }
}

/**
 * Mutator for the Orval-generated client (see orval.config.ts). Requests go
 * same-origin to `/api/**` and reach the backend through the Nitro proxy
 * (nuxt.config.ts). Attaches the bearer token from the `access_token` cookie,
 * resolves with the parsed body and throws an ApiError on non-2xx.
 * @param url - Request URL as defined in the spec (e.g. `/product`).
 * @param options - Native fetch options, as built by the generated caller.
 * @returns The parsed response body.
 */
export async function apiFetch<T>(
  url: string,
  options?: RequestInit,
): Promise<T> {
  const token = useCookie<string | null>('access_token')

  const headers = new Headers(options?.headers)
  if (!headers.has('Authorization') && token.value) {
    headers.set('Authorization', `Bearer ${token.value}`)
  }

  const response = await fetch(`/api${url}`, { ...options, headers })

  const contentType = response.headers.get('content-type')
  const data: unknown =
    response.status === NO_CONTENT || !contentType?.includes('application/json')
      ? undefined
      : await response.json()

  if (!response.ok) {
    const route = useRoute()
    if (
      (response.status === 403 || response.status === 504) &&
      route.path !== '/login' &&
      route.path !== '/register'
    ) {
      token.value = null
      navigateTo('/login')
    } else {
      console.error(response)
    }
    throw new ApiError(response.status, data)
  }

  return data as T
}

export type ErrorType<E> = ApiError<E>
export type BodyType<B> = B
