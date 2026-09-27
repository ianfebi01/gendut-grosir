<template>
  <div>
    <PageHeader
      title="Kategori"
      subtitle="Lihat semua kategori untuk produk Anda"
      add-text="Tambah Kategori"
      :model-value="search"
      @update:model-value="search = $event"
      @add="navigateTo('/library/category/create')"
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
              @click="navigateTo(`/library/category/${row.original?._id}/edit`)"
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
const deleteModal = ref(false)
const id = ref('')

const params = computed(() => ({
  q: debouncedSearch.value,
  page: page.value,
  limit: 25,
}))
const { data, isPending } = useCategories(params)
const items = computed(() => data.value?.items ?? [])
const paginator = computed(() => data.value?.paginator ?? {})

const { deleteCategory } = useCategoryMutations()
const toast = useToast()

const columns = [
  { accessorKey: 'name', header: 'Nama' },
  { accessorKey: 'totalProducts', header: 'Total Produk' },
  { id: 'action', header: 'Aksi' },
]

watch([search], () => {
  page.value = 1
})

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
</script>
