<template>
  <form @submit.prevent="handleSave">
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
            Foto, nama dan email yang digunakan untuk mengenali customer.
          </p>
        </div>
        <div class="grid gap-4 sm:grid-cols-2">
          <UFormField label="Foto" class="sm:col-span-2">
            <div v-if="imagePreview" class="flex items-center gap-4">
              <UAvatar :src="imagePreview" alt="Foto customer" size="3xl" />
              <div class="flex gap-2">
                <UButton
                  variant="outline"
                  color="neutral"
                  icon="i-lucide-refresh-cw"
                  @click="triggerFileInput"
                  >Ganti</UButton
                >
                <UButton
                  variant="ghost"
                  color="error"
                  icon="i-lucide-trash-2"
                  @click="clearImage"
                  >Hapus</UButton
                >
              </div>
            </div>
            <button
              v-else
              type="button"
              class="flex w-full flex-col items-center justify-center gap-2 rounded-(--radius-card) border border-dashed border-ink-300 bg-ink-50 px-6 py-8 text-center transition-colors hover:border-ink-400 hover:bg-ink-100"
              @click="triggerFileInput"
            >
              <span
                class="flex size-10 items-center justify-center rounded-full bg-white shadow-(--shadow-lift)"
              >
                <UIcon name="i-lucide-image-plus" class="size-5 text-ink-600" />
              </span>
              <span class="text-sm font-medium text-ink-900"
                >Klik untuk upload foto</span
              >
              <span class="text-xs text-ink-500"
                >SVG, PNG, JPG or GIF (max. 800x400px)</span
              >
            </button>
            <input
              ref="fileInput"
              type="file"
              accept="image/*"
              class="hidden"
              @change="onImageInput"
            />
          </UFormField>
          <UFormField
            label="Nama"
            required
            :error="
              touched.name && form.name.trim().length < 3
                ? 'Minimal 3 karakter'
                : undefined
            "
          >
            <UInput
              v-model="form.name"
              variant="outline"
              placeholder="Masukkan Nama"
              class="w-full"
              @blur="touched.name = true"
            />
          </UFormField>
          <UFormField
            label="Email"
            required
            :error="
              touched.email && !emailRe.test(form.email)
                ? 'Format email tidak valid'
                : undefined
            "
          >
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

      <!-- Tipe Customer -->
      <section class="form-section">
        <div>
          <h2 class="section-title">Tipe Customer</h2>
          <p class="section-desc">
            Menentukan harga yang berlaku: harga retail atau harga sales.
          </p>
        </div>
        <div class="grid gap-4 sm:grid-cols-2">
          <UFormField label="Status">
            <USelect
              v-model="form.status"
              :items="statusItems"
              value-key="value"
              label-key="name"
              placeholder="Pilih status Customer"
              class="w-full"
            />
          </UFormField>
        </div>
      </section>

      <!-- Keamanan -->
      <section class="form-section">
        <div>
          <h2 class="section-title">Keamanan</h2>
          <p class="section-desc">
            {{
              isEdit
                ? 'Isi hanya jika ingin mengganti password customer.'
                : 'Password yang digunakan customer untuk masuk.'
            }}
          </p>
        </div>
        <div v-if="isEdit" class="grid gap-4 sm:grid-cols-2">
          <UFormField
            label="Password"
            hint="Kosongkan jika tidak diubah"
            :error="
              touched.password && form.password && form.password.length < 6
                ? 'Minimal 6 karakter'
                : undefined
            "
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
        </div>
        <div v-else class="grid gap-4 sm:grid-cols-2">
          <UFormField
            label="Password"
            required
            :error="
              touched.password && form.password.length < 6
                ? 'Minimal 6 karakter'
                : undefined
            "
          >
            <UInput
              v-model="form.password"
              variant="outline"
              type="password"
              placeholder="Masukan Password"
              class="w-full"
              @blur="touched.password = true"
            />
          </UFormField>
          <UFormField
            label="Konfirmasi Password"
            required
            :error="
              touched.confirmPassword && form.confirmPassword !== form.password
                ? 'Harus sama dengan password'
                : undefined
            "
          >
            <UInput
              v-model="form.confirmPassword"
              variant="outline"
              type="password"
              placeholder="Enter Confirm Password"
              class="w-full"
              @blur="touched.confirmPassword = true"
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
        :disabled="saving"
        to="/customers"
        >Batal</UButton
      >
      <UButton
        type="submit"
        color="primary"
        size="lg"
        icon="i-lucide-check"
        :loading="saving"
        :disabled="!valid"
        >{{ isEdit ? 'Simpan Perubahan' : 'Simpan Customer' }}</UButton
      >
    </div>
  </form>
</template>

<script setup lang="ts">
import { useUserMutations } from '@/composables/queries/useUsers'
import { useUploadImageMutations } from '@/composables/queries/useLibrary'

defineOptions({ name: 'CustomerForm' })

// Pass `customer` to edit; omit it to create
const props = defineProps<{ customer?: any }>()

const toast = useToast()
const isEdit = computed(() => !!props.customer)

const form = reactive({
  _id: '',
  name: '',
  email: '',
  status: '',
  password: '',
  confirmPassword: '',
})
const touched = reactive({
  name: false,
  email: false,
  password: false,
  confirmPassword: false,
})

const imageFile = ref<File | null>(null)
const imagePreview = ref('')
const fileInput = ref<HTMLInputElement | null>(null)

// Fill the form when the customer (edit mode) arrives
watch(
  () => props.customer,
  (item) => {
    if (!item) return
    form._id = item._id ?? ''
    form.name = item.name ?? ''
    form.email = item.email ?? ''
    form.status = item.status ?? ''
    form.password = ''
    form.confirmPassword = ''
    imageFile.value = null
    imagePreview.value = item.profilePicture ?? ''
  },
  { immediate: true },
)

const statusItems = [
  { name: 'Retail', value: 'retail' },
  { name: 'Sales', value: 'wholesaler' },
]

const { createUser, updateUser } = useUserMutations()
const { uploadImages } = useUploadImageMutations()

const saving = computed(
  () =>
    createUser.isPending.value ||
    updateUser.isPending.value ||
    uploadImages.isPending.value,
)
const mutationError = computed(() => {
  const e: any = createUser.error.value ?? updateUser.error.value
  return e?.data?.message ?? e?.message ?? ''
})

const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const valid = computed(() => {
  const base = form.name.trim().length >= 3 && emailRe.test(form.email)
  if (isEdit.value) {
    return base && (!form.password || form.password.length >= 6)
  }
  return (
    base && form.password.length >= 6 && form.confirmPassword === form.password
  )
})

async function uploadImageIfNeeded(fallback: string) {
  if (!imageFile.value) return fallback
  const res: any = await uploadImages.mutateAsync({
    path: 'gendut-grosir/profile-picture',
    file: [imageFile.value],
  })
  return (
    res?.data?.[0]?.url ??
    res?.[0]?.url ??
    res?.data?.url ??
    res?.url ??
    fallback
  )
}

async function handleSave() {
  touched.name = touched.email = touched.password = true
  if (!isEdit.value) touched.confirmPassword = true
  if (!valid.value) return
  try {
    if (isEdit.value) {
      const profilePicture = await uploadImageIfNeeded(
        imagePreview.value && !imageFile.value ? imagePreview.value : '',
      )
      const body: any = {
        id: form._id,
        name: form.name,
        email: form.email,
        status: form.status,
        profilePicture,
      }
      if (form.password) body.password = form.password
      await updateUser.mutateAsync(body)
      toast.add({ title: 'Customer diperbarui', color: 'success' })
    } else {
      const profilePicture = await uploadImageIfNeeded('')
      await createUser.mutateAsync({
        name: form.name,
        email: form.email,
        status: form.status,
        password: form.password,
        profilePicture,
      })
      toast.add({ title: 'Customer ditambahkan', color: 'success' })
    }
    await navigateTo('/customers')
  } catch {
    // surfaced via mutationError
  }
}

function triggerFileInput() {
  fileInput.value?.click()
}

function onImageInput(event: Event) {
  const file = (event.target as HTMLInputElement)?.files?.[0]
  if (!file) return
  imageFile.value = file
  imagePreview.value = URL.createObjectURL(file)
}

function clearImage() {
  imageFile.value = null
  imagePreview.value = ''
  if (fileInput.value) fileInput.value.value = ''
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
