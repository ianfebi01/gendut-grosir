<template>
  <div class="grid min-h-screen w-full grid-cols-1 md:grid-cols-2">
    <div class="flex items-center justify-center px-4 py-10 md:px-16 bg-white">
      <div class="w-full max-w-[440px]">
        <LoginForm
          :loading-props="login.isPending.value"
          :error-message="loginError"
          @handle-login="handleLogin"
        />
      </div>
    </div>
    <div
      class="hidden items-center justify-center bg-gray-100 md:flex"
      style="min-height: 100vh"
    >
      <img src="/shoping-cart.svg" alt="Shopping" class="max-w-[80%]" />
    </div>
  </div>
</template>

<script setup lang="ts">
import LoginForm from '~/components/Form/LoginForm.vue'
import { useAuthMutations } from '@/composables/queries/useUsers'

definePageMeta({ layout: 'default' })

const route = useRoute()
const toast = useToast()
const { login } = useAuthMutations()

const loginError = computed(() => {
  const e: any = login.error.value
  return e?.data?.message ?? e?.message ?? ''
})

onMounted(() => {
  const accessToken = route.query.access_token as string | undefined
  if (accessToken) {
    useCookie('access_token').value = accessToken
    navigateTo('/')
  }
})

async function handleLogin(body: any) {
  try {
    await login.mutateAsync(body)
    toast.add({ title: 'Login berhasil', color: 'success' })
    await navigateTo('/')
  } catch {
    // surfaced via loginError
  }
}
</script>
