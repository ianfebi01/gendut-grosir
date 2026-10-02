<template>
  <div>
    <PageHeader
      title="Profil Saya"
      subtitle="Ubah data akun yang sedang Anda gunakan"
      :actions="false"
      :search-bar="false"
    />

    <div class="pt-6">
      <div v-if="isPending" class="grid gap-4 md:grid-cols-2">
        <USkeleton class="h-10 w-full" />
        <USkeleton class="h-10 w-full" />
      </div>

      <form v-else @submit.prevent="handleSave">
        <UAlert
          v-if="mutationError"
          color="error"
          variant="soft"
          icon="i-lucide-circle-alert"
          :title="mutationError"
          class="mb-6"
        />

        <div class="divide-y divide-(--ui-border-muted)">
          <!-- Profil -->
          <section class="form-section">
            <div>
              <h2 class="section-title">Profil</h2>
              <p class="section-desc">
                Foto, nama dan email akun Anda. Mengganti email memerlukan
                password saat ini.
              </p>
            </div>
            <div class="grid gap-4 sm:grid-cols-2">
              <UFormField label="Foto" class="sm:col-span-2">
                <div class="flex items-center gap-4">
                  <UAvatar
                    :src="imagePreview || undefined"
                    :alt="form.name"
                    size="3xl"
                    class="border bg-gray-100"
                  />
                  <div class="flex gap-2">
                    <UButton
                      variant="outline"
                      color="neutral"
                      icon="i-lucide-refresh-cw"
                      @click="fileInput?.click()"
                      >{{ imagePreview ? 'Ganti' : 'Upload' }}</UButton
                    >
                    <UButton
                      v-if="imageFile"
                      variant="ghost"
                      color="neutral"
                      icon="i-lucide-undo-2"
                      @click="resetImage"
                      >Batalkan</UButton
                    >
                  </div>
                </div>
                <input
                  ref="fileInput"
                  type="file"
                  accept="image/*"
                  class="hidden"
                  @change="onImageInput"
                />
              </UFormField>
              <UFormField label="Nama" required :error="errors.name">
                <UInput
                  v-model="form.name"
                  variant="outline"
                  placeholder="Masukkan Nama"
                  class="w-full"
                  @blur="touched.name = true"
                />
              </UFormField>
              <UFormField label="Email" required :error="errors.email">
                <UInput
                  v-model="form.email"
                  variant="outline"
                  type="email"
                  placeholder="Masukkan Email"
                  class="w-full"
                  @blur="touched.email = true"
                />
              </UFormField>
            </div>
          </section>

          <!-- Keamanan -->
          <section class="form-section">
            <div>
              <h2 class="section-title">Keamanan</h2>
              <p class="section-desc">
                Isi password baru hanya jika ingin menggantinya.
              </p>
            </div>
            <div class="grid gap-4 sm:grid-cols-2">
              <UFormField
                label="Password Baru"
                hint="Kosongkan jika tidak diubah"
                :error="errors.password"
              >
                <UInput
                  v-model="form.password"
                  variant="outline"
                  type="password"
                  placeholder="Password baru (opsional)"
                  class="w-full"
                  @blur="touched.password = true"
                />
              </UFormField>
              <UFormField
                label="Konfirmasi Password Baru"
                :required="!!form.password"
                :error="errors.confirmPassword"
              >
                <UInput
                  v-model="form.confirmPassword"
                  variant="outline"
                  type="password"
                  placeholder="Ulangi password baru"
                  class="w-full"
                  :disabled="!form.password"
                  @blur="touched.confirmPassword = true"
                />
              </UFormField>
              <UFormField
                v-if="needsCurrentPassword"
                label="Password Saat Ini"
                required
                hint="Wajib untuk mengganti email atau password"
                :error="errors.currentPassword"
              >
                <UInput
                  v-model="form.currentPassword"
                  variant="outline"
                  type="password"
                  placeholder="Masukkan password saat ini"
                  class="w-full"
                  @blur="touched.currentPassword = true"
                />
              </UFormField>
            </div>
          </section>
        </div>

        <!-- Actions stay visible while scrolling -->
        <div
          class="sticky bottom-0 -mx-4 mt-2 flex justify-end gap-2 border-t border-(--ui-border-muted) bg-white/90 px-4 py-4 backdrop-blur md:-mx-6 md:px-6"
        >
          <UButton
            variant="outline"
            color="neutral"
            size="lg"
            :disabled="updateMe.isPending.value || !dirty"
            @click="fillForm"
            >Reset</UButton
          >
          <UButton
            type="submit"
            color="primary"
            size="lg"
            icon="i-lucide-check"
            :loading="updateMe.isPending.value"
            :disabled="!valid || !dirty"
            >Simpan Perubahan</UButton
          >
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import PageHeader from '~/components/Layout/PageHeader.vue'
import { useMe, useUpdateMe } from '@/composables/queries/useUsers'
import type { UpdateMeVariables } from '@/composables/queries/useUsers'

definePageMeta({ layout: 'dashboard', title: 'Profil Saya' })
useHead({ title: 'Gendut Grosir | Profil' })

const toast = useToast()
const { data: me, isPending } = useMe()
const updateMe = useUpdateMe()

const form = reactive({
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
  currentPassword: '',
})
const touched = reactive({
  name: false,
  email: false,
  password: false,
  confirmPassword: false,
  currentPassword: false,
})

const imageFile = ref<File | null>(null)
const imagePreview = ref('')
const fileInput = ref<HTMLInputElement | null>(null)

function fillForm() {
  form.name = me.value?.name ?? ''
  form.email = me.value?.email ?? ''
  form.password = form.confirmPassword = form.currentPassword = ''
  Object.keys(touched).forEach(
    (k) => (touched[k as keyof typeof touched] = false),
  )
  resetImage()
}
watch(me, fillForm, { immediate: true })

const emailChanged = computed(
  () => form.email.trim() !== (me.value?.email ?? ''),
)
const needsCurrentPassword = computed(
  () => emailChanged.value || !!form.password,
)
const dirty = computed(
  () =>
    form.name.trim() !== (me.value?.name ?? '') ||
    emailChanged.value ||
    !!form.password ||
    !!imageFile.value,
)

const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const errors = computed(() => ({
  name:
    touched.name &&
    (form.name.trim().length < 3 || form.name.trim().length > 30)
      ? 'Nama 3 - 30 karakter'
      : undefined,
  email:
    touched.email && !emailRe.test(form.email.trim())
      ? 'Format email tidak valid'
      : undefined,
  password:
    touched.password &&
    form.password &&
    (form.password.length < 6 || form.password.length > 40)
      ? 'Password 6 - 40 karakter'
      : undefined,
  confirmPassword:
    touched.confirmPassword &&
    form.password &&
    form.confirmPassword !== form.password
      ? 'Harus sama dengan password baru'
      : undefined,
  currentPassword:
    touched.currentPassword &&
    needsCurrentPassword.value &&
    !form.currentPassword
      ? 'Password saat ini wajib diisi'
      : undefined,
}))

const valid = computed(() => {
  const name = form.name.trim()
  if (name.length < 3 || name.length > 30) return false
  if (!emailRe.test(form.email.trim())) return false
  if (form.password) {
    if (form.password.length < 6 || form.password.length > 40) return false
    if (form.confirmPassword !== form.password) return false
  }
  return !needsCurrentPassword.value || !!form.currentPassword
})

const mutationError = computed(() => {
  const e: any = updateMe.error.value
  return e?.data?.message ?? e?.message ?? ''
})

function onImageInput(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input?.files?.[0]
  if (!file) return
  imageFile.value = file
  imagePreview.value = URL.createObjectURL(file)
  input.value = ''
}

function resetImage() {
  if (imageFile.value) URL.revokeObjectURL(imagePreview.value)
  imageFile.value = null
  imagePreview.value = me.value?.profilePicture ?? ''
}

async function handleSave() {
  Object.keys(touched).forEach(
    (k) => (touched[k as keyof typeof touched] = true),
  )
  if (!valid.value || !dirty.value) return

  // Send only what changed; the API leaves omitted fields untouched
  const body: UpdateMeVariables = { image: imageFile.value }
  if (form.name.trim() !== me.value?.name) body.name = form.name.trim()
  if (emailChanged.value) body.email = form.email.trim()
  if (form.password) body.password = form.password
  if (needsCurrentPassword.value) body.currentPassword = form.currentPassword

  try {
    await updateMe.mutateAsync(body)
    toast.add({ title: 'Profil diperbarui', color: 'success' })
  } catch {
    // surfaced via mutationError
  }
}
</script>

<style scoped>
.form-section {
  display: grid;
  gap: 1rem 2.5rem;
  padding-block: 1.75rem;
}
.form-section:first-child {
  padding-top: 0.5rem;
}
@media (min-width: 1024px) {
  .form-section {
    grid-template-columns: 240px minmax(0, 1fr);
  }
}
.section-title {
  font-size: 0.9375rem;
  font-weight: 600;
  color: var(--color-ink-900);
}
.section-desc {
  margin-top: 0.25rem;
  font-size: 0.8125rem;
  line-height: 1.25rem;
  color: var(--color-ink-500);
}
</style>
