<template>
  <div class="w-full">
    <div class="flex justify-center" style="margin-bottom: 16px">
      <img src="/logo.svg" alt="Gendut Grosir" style="height: 64px" />
    </div>
    <p class="text-center text-sm font-light text-gray-500">
      {{ isSetup ? 'Buat akun pertama untuk memulai.' : 'Daftar untuk membuat akun!' }}
    </p>
    <UAlert
      v-if="isSetup"
      color="info"
      variant="soft"
      class="mt-4"
      title="Akun ini akan menjadi Super Admin"
      description="Belum ada pengguna terdaftar. Akun pertama otomatis aktif dengan akses penuh."
    />

    <div v-if="!success" class="mt-4 space-y-4">
      <USeparator />
      <UFormField label="Nama" required :error="touched.name && !form.name ? 'Name is required' : undefined">
        <UInput v-model="form.name" placeholder="Enter your Name" size="lg" class="w-full" @blur="touched.name = true" />
      </UFormField>
      <UFormField label="Status">
        <USelect v-model="form.status" :items="status" value-key="value" label-key="name" placeholder="Select Status" size="lg" class="w-full" />
      </UFormField>
      <UFormField label="Email" required :error="emailError">
        <UInput v-model="form.email" placeholder="Enter your Email" size="lg" class="w-full" @blur="touched.email = true" />
      </UFormField>
      <UFormField label="Password" required :error="passwordError">
        <UInput v-model="form.password" type="password" placeholder="Enter your Password" size="lg" class="w-full" @blur="touched.password = true" />
      </UFormField>
      <UFormField label="Konfirmasi Password" required :error="confirmError">
        <UInput v-model="form.confirmPassword" type="password" placeholder="Enter your Password again" size="lg" class="w-full" @blur="touched.confirmPassword = true" />
      </UFormField>
      <UAlert v-if="registerError" color="error" variant="soft" :title="registerError" />
      <UButton color="primary" size="lg" block :disabled="!valid" :loading="register.isPending.value" @click="handleRegister">
        {{ isSetup ? 'Buat Akun Super Admin' : 'Daftar' }}
      </UButton>
      <p v-if="!isSetup" class="text-center text-sm">
        Sudah punya akun?
        <NuxtLink to="/login" class="text-primary-600 font-medium">Masuk</NuxtLink>
      </p>
    </div>
    <div v-else class="mt-4 text-center">
      <p class="font-medium text-primary-600">
        Proses pendaftaran berhasil, hubungi admin untuk mengaktifkan akun.
      </p>
      <UButton color="primary" size="lg" block class="mt-4" to="/login">Masuk</UButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthMutations } from '@/composables/queries/useUsers'

defineOptions({ name: 'RegisterForm' })

const form = reactive({ name: '', status: '', email: '', password: '', confirmPassword: '' })
const touched = reactive({ name: false, email: false, password: false, confirmPassword: false })
const status = [
  { name: 'Retail', value: 'retail' },
  { name: 'Sales', value: 'wholesaler' },
]
const success = ref(false)

const appStore = useAppStore()
const toast = useToast()
// The backend makes the first account an activated super admin
const isSetup = computed(() => !!appStore.needsSetup)

const { register, login } = useAuthMutations()
const registerError = computed(() => {
  const e: any = register.error.value ?? login.error.value
  return e?.data?.message ?? e?.message ?? ''
})

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
const confirmError = computed(() => {
  if (!touched.confirmPassword) return undefined
  if (!form.confirmPassword) return 'Password is required'
  if (form.confirmPassword.length < 6) return 'Minimum is 6 char'
  if (form.confirmPassword !== form.password) return 'Confirm Password must be same as Password'
  return undefined
})
const valid = computed(
  () => !!form.name && !emailError.value && !passwordError.value && !confirmError.value && !!form.email && !!form.password && !!form.confirmPassword,
)

async function handleRegister() {
  touched.name = touched.email = touched.password = touched.confirmPassword = true
  if (!valid.value) return
  const { confirmPassword: _, ...body } = form
  const firstAccount = isSetup.value
  try {
    await register.mutateAsync(body)
  } catch {
    // error surfaced via registerError
    return
  }

  if (!firstAccount) {
    success.value = true
    return
  }

  appStore.setNeedsSetup(false)
  try {
    await login.mutateAsync({ email: body.email, password: body.password })
    toast.add({ title: 'Akun Super Admin berhasil dibuat', color: 'success' })
    await navigateTo('/')
  } catch {
    // The account exists; let the user sign in manually
    await navigateTo('/login')
  }
}
</script>
