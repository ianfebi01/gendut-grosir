import { logout } from '~/utils/logout'

const NO_CONTENT = 204
const UNAUTHORIZED = 401

// isAdmin also answers 401, but for a valid session without the admin role
// -- that must not sign the user out.
const PERMISSION_DENIED = 'Permission denied'

let loggingOut = false

/**
 * Sign out once when a request comes back 401 with an invalid or expired
 * token; concurrent 401s share the same logout.
 * @param data - Parsed error body.
 */
async function handleUnauthorized(data: unknown): Promise<void> {
  const route = useRoute()
  if (
    loggingOut ||
    route.path === '/login' ||
    route.path === '/register' ||
    (data as { message?: string } | undefined)?.message === PERMISSION_DENIED
  ) {
    return
  }
  loggingOut = true
  try {
    await logout()
  } finally {
    loggingOut = false
  }
}

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
 * resolves with the parsed body and throws an ApiError on non-2xx. A 401 from
 * an invalid/expired token signs the user out.
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
    if (response.status === UNAUTHORIZED) {
      await handleUnauthorized(data)
    } else {
      console.error(response)
    }
    throw new ApiError(response.status, data)
  }

  return data as T
}

export type ErrorType<E> = ApiError<E>
export type BodyType<B> = B
