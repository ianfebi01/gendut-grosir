<template>
  <div class="flex min-h-screen items-center justify-center bg-gray-50 px-4">
    <UCard class="w-full max-w-md text-center">
      <template #header>
        <h1 class="text-3xl font-bold text-gray-900">
          {{ error?.statusCode === 404 ? '404 Not Found' : 'An error occurred' }}
        </h1>
      </template>

      <p class="text-sm text-gray-500">
        {{ error?.statusCode === 404
          ? 'The page you are looking for does not exist.'
          : (error?.message || 'Something went wrong.') }}
      </p>

      <template #footer>
        <div class="flex justify-center gap-2">
          <UButton color="primary" @click="handleError">Home page</UButton>
        </div>
      </template>
    </UCard>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  error: {
    type: Object as PropType<{ statusCode?: number; message?: string } | null>,
    default: null,
  },
})

const title = computed(() =>
  props.error?.statusCode === 404 ? '404 Not Found' : 'An error occurred'
)

useHead({ title })

const handleError = () => clearError({ redirect: '/' })
</script>
