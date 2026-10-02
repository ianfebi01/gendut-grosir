import { defineConfig } from 'orval'

/**
 * Generates a typed Vue Query client from the OpenAPI spec exported by
 * gendut-grosir-be (src/docs/openapi.ts). Regenerate with
 * `pnpm generate:api-client` whenever openapi.json changes.
 */
export default defineConfig({
  gendutGrosir: {
    input: {
      target: './openapi.json',
    },
    output: {
      client: 'vue-query',
      httpClient: 'fetch',
      clean: true,
      mode: 'tags-split',
      override: {
        mutator: {
          name: 'apiFetch',
          path: './api/http.ts',
        },
        fetch: {
          // apiFetch throws on non-2xx, so callers only ever see the body
          includeHttpResponseReturnType: false,
        },
      },
      target: './api/generated',
    },
  },
})
