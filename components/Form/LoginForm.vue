<template>
  <div class="w-full">
    <div class="flex justify-center" style="margin-bottom: 16px">
      <img src="/logo.svg" alt="Gendut Grosir" style="height: 64px" />
    </div>
    <p class="text-center text-sm font-light text-gray-500">
      Masuk dengan akun Anda dan selamat berbelanja!
    </p>
    <UAlert v-if="errorMessage" color="error" variant="soft" :title="`Error: ${errorMessage}`" class="mt-2" />

    <form class="mt-4 space-y-4" @submit.prevent="submit">
      <USeparator />
      <UFormField label="Email" required :error="emailError">
        <UInput v-model="form.email" placeholder="Enter your Email" size="lg" class="w-full" @blur="touched.email = true" />
      </UFormField>
      <UFormField label="Password" required :error="passwordError">
        <UInput v-model="form.password" type="password" placeholder="Enter your Password" size="lg" class="w-full" @blur="touched.password = true" />
      </UFormField>
      <UButton type="submit" color="primary" size="lg" block :disabled="!valid" :loading="loading">
        Masuk
      </UButton>
      <p class="text-center text-sm">
        Tidak punya akun?
        <NuxtLink to="/register" class="text-primary-600 font-medium">Daftar</NuxtLink>
      </p>
    </form>
  </div>
</template>

<script setup lang="ts">
defineOptions({ name: 'LoginForm' })

const props = defineProps({ loadingProps: { type: Boolean, default: false }, errorMessage: { type: String, default: '' } })
const emit = defineEmits(['handleLogin', 'setLoading'])

const form = reactive({ email: '', password: '' })
const touched = reactive({ email: false, password: false })

const emailError = computed(() => {
  if (!touched.email) return undefined
  if (!form.email) return 'Email is required'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return 'Please insert valid email address'
  return undefined
})
const passwordError = computed(() => {
  if (!touched.password) return undefined
  if (!form.password) return 'Password is required'
  if (form.password.length < 6) return 'Minimum is 6 char'
  return undefined
})
const valid = computed(() => !emailError.value && !passwordError.value && !!form.email && !!form.password)
const loading = computed({
  get: () => props.loadingProps,
  set: (v) => emit('setLoading', v),
})

function submit() {
  touched.email = true
  touched.password = true
  if (!valid.value) return
  emit('handleLogin', { ...form })
}
</script>
