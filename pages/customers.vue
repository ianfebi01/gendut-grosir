<template>
  <div>
    <PageHeader
      title="Customer"
      subtitle="Kelola Customer Anda"
      add-text="Tambah Customer"
      :model-value="search"
      @update:model-value="search = $event"
      @add="openAddModal"
    />

    <div class="pt-4">
      <UTable
        :data="items"
        :columns="columns"
        :loading="isPending"
        class="data-table"
        :ui="{ th: 'text-ink-900! border-b-0!', td: 'text-ink-900' }"
      >
        <template #profilePicture-cell="{ row }">
          <UAvatar :src="row.original?.profilePicture" alt="avatar" size="md" />
        </template>
        <template #status-cell="{ row }">
          <span>{{ statusLabel(row.original?.status) }}</span>
        </template>
        <template #role-cell="{ row }">
          <span>{{ row.original?.role?.title ?? '-' }}</span>
        </template>
        <template #action-cell="{ row }">
          <div class="flex gap-1">
            <UButton
              variant="ghost"
              color="neutral"
              size="xs"
              @click="openEditModal(row.original)"
            >
              <template #leading
                ><UIcon name="i-heroicons-pencil-20-solid" class="size-4"
              /></template>
            </UButton>
            <UButton
              variant="ghost"
              color="neutral"
              size="xs"
              @click="openDeleteModal(row.original?._id)"
            >
              <template #leading
                ><UIcon name="i-heroicons-trash-20-solid" class="size-4"
              /></template>
            </UButton>
          </div>
        </template>
      </UTable>
      <div class="my-4 flex items-center text-sm">
        <span class="font-medium text-gray-700"
          >Halaman {{ page }} dari {{ paginator?.totalPages }}</span
        >
        <div class="flex-1" />
        <UButton
          variant="outline"
          color="neutral"
          size="sm"
          :disabled="!paginator?.hasPrevPage"
          @click="page--"
          >Sebelumnya</UButton
        >
        <UButton
          variant="outline"
          color="neutral"
          size="sm"
          class="ml-2"
          :disabled="!paginator?.hasNextPage"
          @click="page++"
          >Selanjutnya</UButton
        >
      </div>
    </div>

    <DialogModal
      v-model="modal"
      title="Tambah Customer"
      subtitle="Tambah customer baru untuk toko Anda"
      :loading="createUser.isPending.value"
      :error-message="mutationError"
      :disable="!addValid"
      @save="handleAdd"
      @clear-error-message="createUser.reset()"
    >
      <template #icon
        ><UIcon
          name="i-heroicons-user-plus-20-solid"
          class="size-6 text-primary-600"
      /></template>
      <template #content>
        <div class="space-y-4">
          <UFormField label="Image">
            <div
              class="relative flex h-52 w-full flex-col items-center justify-center overflow-hidden rounded-lg border border-gray-300 bg-white shadow-sm"
            >
              <UButton
                v-if="imagePreview"
                variant="ghost"
                color="neutral"
                size="xs"
                class="absolute top-2 right-2 z-10"
                @click="clearImage"
              >
                <template #leading
                  ><UIcon name="i-heroicons-x-mark-20-solid" class="size-4"
                /></template>
              </UButton>
              <div
                v-if="!imagePreview"
                class="flex h-full w-full cursor-pointer flex-col items-center justify-center"
                @click="addFileInput?.click()"
              >
                <div
                  class="flex size-10 items-center justify-center rounded-full bg-gray-100 ring-8 ring-gray-50"
                >
                  <UIcon
                    name="i-heroicons-arrow-up-tray-20-solid"
                    class="size-4 text-gray-500"
                  />
                </div>
                <span class="mt-2 text-sm font-bold text-primary-600"
                  >Click to upload</span
                >
                <span class="text-xs font-normal text-gray-500"
                  >SVG, PNG, JPG or GIF (max. 800x400px)</span
                >
              </div>
              <img
                v-else
                :src="imagePreview"
                class="size-[200px] rounded border object-cover"
                alt="preview"
              />
            </div>
            <input
              ref="addFileInput"
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
              placeholder="Masukkan Nama"
              size="md"
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
              type="email"
              placeholder="Masukkan Email"
              size="md"
              class="w-full"
              @blur="touched.email = true"
            />
          </UFormField>
          <UFormField label="Status">
            <USelect
              v-model="form.status"
              :items="statusItems"
              value-key="value"
              label-key="name"
              placeholder="Pilih status Customer"
              size="md"
              class="w-full"
            />
          </UFormField>
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
              type="password"
              placeholder="Masukan Password"
              size="md"
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
              type="password"
              placeholder="Enter Confirm Password"
              size="md"
              class="w-full"
              @blur="touched.confirmPassword = true"
            />
          </UFormField>
        </div>
      </template>
    </DialogModal>

    <DialogModal
      v-model="editModal"
      title="Edit Customer"
      subtitle="Edit customer pada toko Anda"
      :loading="updateUser.isPending.value"
      :error-message="mutationError"
      :disable="!editValid"
      @save="handleEdit"
      @clear-error-message="updateUser.reset()"
    >
      <template #icon
        ><UIcon
          name="i-heroicons-user-plus-20-solid"
          class="size-6 text-primary-600"
      /></template>
      <template #content>
        <div class="space-y-4">
          <UFormField label="Image">
            <div
              class="relative flex h-52 w-full flex-col items-center justify-center overflow-hidden rounded-lg border border-gray-300 bg-white shadow-sm"
            >
              <UButton
                v-if="imagePreview"
                variant="ghost"
                color="neutral"
                size="xs"
                class="absolute top-2 right-2 z-10"
                @click="clearImage"
              >
                <template #leading
                  ><UIcon name="i-heroicons-x-mark-20-solid" class="size-4"
                /></template>
              </UButton>
              <div
                v-if="!imagePreview"
                class="flex h-full w-full cursor-pointer flex-col items-center justify-center"
                @click="editFileInput?.click()"
              >
                <div
                  class="flex size-10 items-center justify-center rounded-full bg-gray-100 ring-8 ring-gray-50"
                >
                  <UIcon
                    name="i-heroicons-arrow-up-tray-20-solid"
                    class="size-4 text-gray-500"
                  />
                </div>
                <span class="mt-2 text-sm font-bold text-primary-600"
                  >Click to upload</span
                >
                <span class="text-xs font-normal text-gray-500"
                  >SVG, PNG, JPG or GIF (max. 800x400px)</span
                >
              </div>
              <img
                v-else
                :src="imagePreview"
                class="size-[200px] rounded border object-cover"
                alt="preview"
              />
            </div>
            <input
              ref="editFileInput"
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
              touched.name && editForm.name.trim().length < 3
                ? 'Minimal 3 karakter'
                : undefined
            "
          >
            <UInput
              v-model="editForm.name"
              placeholder="Masukkan Nama"
              size="md"
              class="w-full"
              @blur="touched.name = true"
            />
          </UFormField>
          <UFormField
            label="Email"
            required
            :error="
              touched.email && !emailRe.test(editForm.email)
                ? 'Format email tidak valid'
                : undefined
            "
          >
            <UInput
              v-model="editForm.email"
              type="email"
              placeholder="Masukkan Email"
              size="md"
              class="w-full"
              @blur="touched.email = true"
            />
          </UFormField>
          <UFormField label="Status">
            <USelect
              v-model="editForm.status"
              :items="statusItems"
              value-key="value"
              label-key="name"
              placeholder="Pilih status Customer"
              size="md"
              class="w-full"
            />
          </UFormField>
          <UFormField
            label="Password"
            hint="Kosongkan jika tidak diubah"
            :error="
              touched.password &&
              editForm.password &&
              editForm.password.length < 6
                ? 'Minimal 6 karakter'
                : undefined
            "
          >
            <UInput
              v-model="editForm.password"
              type="password"
              placeholder="Password baru (opsional)"
              size="md"
              class="w-full"
              @blur="touched.password = true"
            />
          </UFormField>
        </div>
      </template>
    </DialogModal>

    <DialogDelete
      v-model="deleteModal"
      :loading="deleteUser.isPending.value"
      @ok="handleDelete"
    />
  </div>
</template>

<script setup lang="ts">
import { refDebounced } from '@vueuse/core'
import PageHeader from '~/components/Layout/PageHeader.vue'
import DialogModal from '~/components/Dialog/Modal.vue'
import DialogDelete from '~/components/Dialog/Delete.vue'
import { useUsers, useUserMutations } from '@/composables/queries/useUsers'
import { useUploadImageMutations } from '@/composables/queries/useLibrary'

definePageMeta({ layout: 'dashboard', title: 'Customer' })
useHead({ title: 'Gendut Grosir | Customers' })

const search = ref('')
const debouncedSearch = refDebounced(search, 500)
const page = ref(1)
const modal = ref(false)
const editModal = ref(false)
const deleteModal = ref(false)
const id = ref('')

const form = reactive({
  name: '',
  email: '',
  status: '',
  password: '',
  confirmPassword: '',
})
const editForm = reactive({ name: '', email: '', status: '', password: '' })
const touched = reactive({
  name: false,
  email: false,
  password: false,
  confirmPassword: false,
})

const image = ref<any>(null)
const imagePreview = ref('')
const addFileInput = ref<any>(null)
const editFileInput = ref<any>(null)

const params = computed(() => ({
  q: debouncedSearch.value,
  page: page.value,
  limit: 25,
}))
const { data, isPending } = useUsers(params)
const items = computed(() => data.value?.items ?? [])
const paginator = computed(() => data.value?.paginator ?? {})

const { createUser, updateUser, deleteUser } = useUserMutations()
const { uploadImages } = useUploadImageMutations()
const toast = useToast()
const mutationError = computed(() => {
  const e: any = createUser.error.value ?? updateUser.error.value
  return e?.data?.message ?? e?.message ?? ''
})

const statusItems = [
  { name: 'Retail', value: 'retail' },
  { name: 'Sales', value: 'wholesaler' },
]

const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const addValid = computed(
  () =>
    form.name.trim().length >= 3 &&
    emailRe.test(form.email) &&
    form.password.length >= 6 &&
    form.confirmPassword === form.password,
)
const editValid = computed(
  () =>
    editForm.name.trim().length >= 3 &&
    emailRe.test(editForm.email) &&
    (!editForm.password || editForm.password.length >= 6),
)

const columns = [
  { accessorKey: 'profilePicture', header: 'Image' },
  { accessorKey: 'name', header: 'Name' },
  { accessorKey: 'email', header: 'Email' },
  { id: 'role', header: 'Role' },
  { id: 'status', header: 'Status' },
  { id: 'action', header: 'Action' },
]

watch([search], () => {
  page.value = 1
})

function statusLabel(s: string) {
  return s === 'retail' ? 'Retail' : s === 'wholesaler' ? 'Sales' : '-'
}

function onImageInput(e: any) {
  const file = e?.target?.files?.[0]
  if (!file) return
  image.value = file
  imagePreview.value = URL.createObjectURL(file)
}

function clearImage() {
  image.value = null
  imagePreview.value = ''
  if (addFileInput.value) addFileInput.value.value = ''
  if (editFileInput.value) editFileInput.value.value = ''
}

function resetTouched() {
  touched.name =
    touched.email =
    touched.password =
    touched.confirmPassword =
      false
}

function openAddModal() {
  Object.assign(form, {
    name: '',
    email: '',
    status: '',
    password: '',
    confirmPassword: '',
  })
  clearImage()
  resetTouched()
  modal.value = true
}

async function uploadImageIfNeeded(fallback: string) {
  if (!image.value) return fallback
  const fd = new FormData()
  fd.append('image', image.value)
  fd.append('path', 'gendut-grosir/profile-picture')
  const res: any = await uploadImages.mutateAsync(fd)
  return (
    res?.data?.[0]?.url ??
    res?.[0]?.url ??
    res?.data?.url ??
    res?.url ??
    fallback
  )
}

async function handleAdd() {
  try {
    const profilePicture = await uploadImageIfNeeded('')
    await createUser.mutateAsync({
      name: form.name,
      email: form.email,
      status: form.status,
      password: form.password,
      profilePicture,
    })
    toast.add({ title: 'Customer ditambahkan', color: 'success' })
    modal.value = false
    clearImage()
  } catch {}
}

function openEditModal(item: any) {
  id.value = item?._id
  Object.assign(editForm, {
    name: item?.name ?? '',
    email: item?.email ?? '',
    status: item?.status ?? '',
    password: '',
  })
  image.value = null
  imagePreview.value = item?.profilePicture ?? ''
  resetTouched()
  editModal.value = true
}

async function handleEdit() {
  try {
    const profilePicture = await uploadImageIfNeeded(
      imagePreview.value && !image.value ? imagePreview.value : '',
    )
    const body: any = {
      id: id.value,
      name: editForm.name,
      email: editForm.email,
      status: editForm.status,
      profilePicture,
    }
    if (editForm.password) body.password = editForm.password
    await updateUser.mutateAsync(body)
    toast.add({ title: 'Customer diperbarui', color: 'success' })
    editModal.value = false
    clearImage()
  } catch {}
}

function openDeleteModal(userId: string) {
  id.value = userId
  deleteModal.value = true
}

async function handleDelete() {
  try {
    await deleteUser.mutateAsync(id.value)
    toast.add({ title: 'Customer dihapus', color: 'success' })
    deleteModal.value = false
  } catch {
    toast.add({ title: 'Gagal menghapus', color: 'error' })
  }
}
</script>
