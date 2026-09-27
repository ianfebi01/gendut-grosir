<template>
  <div class="grid min-h-screen w-full grid-cols-1 md:grid-cols-2">
    <div class="flex items-center justify-center px-4 py-10 md:px-16">
      <div class="w-full max-w-[440px]">
        <RegisterForm />
      </div>
    </div>
    <div class="hidden items-center justify-center bg-gray-100 md:flex" style="min-height: 100vh">
      <img src="/shoping-cart.svg" alt="Shopping" class="max-w-[80%]" />
    </div>
  </div>
</template>

<script setup lang="ts">
import RegisterForm from '~/components/Form/RegisterForm.vue'

definePageMeta({ layout: 'default' })

const route = useRoute()

onMounted(() => {
  const accessToken = route.query.access_token as string | undefined
  if (accessToken) {
    useCookie('access_token').value = accessToken
    navigateTo('/')
  }
})
</script>
