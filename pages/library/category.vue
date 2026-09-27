<template>
  <div>
    <PageHeader
      title="Kategori"
      subtitle="Lihat semua kategori untuk produk Anda"
      add-text="Tambah Kategori"
      :model-value="search"
      @update:model-value="search = $event"
      @add="modal = true"
    />

    <div class="pt-4">
      <UTable
        :data="items"
        :columns="columns"
        :loading="isPending"
        class="data-table"
        :ui="{ th: 'text-ink-900! border-b-0!', td: 'text-ink-900' }"
      >
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
      title="Tambah Kategori"
      subtitle="Masukkan nama kategori"
      :loading="createCategory.isPending.value"
      :error-message="mutationError"
      :disable="!name"
      @save="handleAddCategory"
      @clear-error-message="createCategory.reset()"
    >
      <template #icon
        ><UIcon name="i-heroicons-tag-20-solid" class="size-6 text-primary-600"
      /></template>
      <template #content>
        <UFormField label="Nama">
          <UInput
            v-model="name"
            placeholder="Masukkan nama"
            size="md"
            class="w-full"
          />
        </UFormField>
      </template>
    </DialogModal>

    <DialogModal
      v-model="editModal"
      title="Edit Nama Kategori"
      subtitle="Masukkan nama kategori"
      :loading="updateCategory.isPending.value"
      :error-message="mutationError"
      :disable="!name"
      @save="handleEdit"
    >
      <template #icon
        ><UIcon name="i-heroicons-tag-20-solid" class="size-6 text-primary-600"
      /></template>
      <template #content>
        <UFormField label="Nama">
          <UInput
            v-model="name"
            placeholder="Masukkan nama"
            size="md"
            class="w-full"
          />
        </UFormField>
      </template>
    </DialogModal>

    <DialogDelete
      v-model="deleteModal"
      :loading="deleteCategory.isPending.value"
      @ok="handleDelete"
    />
  </div>
</template>

<script setup lang="ts">
import { refDebounced } from '@vueuse/core'
import PageHeader from '~/components/Layout/PageHeader.vue'
import DialogModal from '~/components/Dialog/Modal.vue'
import DialogDelete from '~/components/Dialog/Delete.vue'
import {
  useCategories,
  useCategoryMutations,
} from '@/composables/queries/useCategories'

definePageMeta({ layout: 'dashboard', title: 'Kategori' })
useHead({ title: 'Gendut Grosir | Category' })

const search = ref('')
const debouncedSearch = refDebounced(search, 500)
const page = ref(1)
const modal = ref(false)
const editModal = ref(false)
const deleteModal = ref(false)
const name = ref('')
const id = ref('')

const params = computed(() => ({
  q: debouncedSearch.value,
  page: page.value,
  limit: 25,
}))
const { data, isPending } = useCategories(params)
const items = computed(() => data.value?.items ?? [])
const paginator = computed(() => data.value?.paginator ?? {})

const { createCategory, updateCategory, deleteCategory } =
  useCategoryMutations()
const toast = useToast()
const mutationError = computed(() => {
  const e: any = createCategory.error.value ?? updateCategory.error.value
  return e?.data?.message ?? e?.message ?? ''
})

const columns = [
  { accessorKey: 'name', header: 'Nama' },
  { accessorKey: 'totalProducts', header: 'Total Produk' },
  { id: 'action', header: 'Aksi' },
]

watch([search], () => {
  page.value = 1
})

async function handleAddCategory() {
  try {
    await createCategory.mutateAsync(name.value)
    toast.add({ title: 'Kategori ditambahkan', color: 'success' })
    modal.value = false
    name.value = ''
  } catch {}
}

function openDeleteModal(categoryId: string) {
  id.value = categoryId
  deleteModal.value = true
}

async function handleDelete() {
  try {
    await deleteCategory.mutateAsync(id.value)
    toast.add({ title: 'Kategori dihapus', color: 'success' })
    deleteModal.value = false
  } catch {
    toast.add({ title: 'Gagal menghapus', color: 'error' })
  }
}

function openEditModal(item: any) {
  editModal.value = true
  id.value = item?._id
  name.value = item?.name
}

async function handleEdit() {
  try {
    await updateCategory.mutateAsync({ id: id.value, name: name.value })
    toast.add({ title: 'Kategori diperbarui', color: 'success' })
    editModal.value = false
    name.value = ''
  } catch {}
}
</script>
