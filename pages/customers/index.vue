<template>
  <div>
    <PageHeader
      title="Customer"
      subtitle="Kelola Customer Anda"
      add-text="Tambah Customer"
      :model-value="search"
      @update:model-value="search = $event"
      @add="navigateTo('/customers/create')"
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
              @click="navigateTo(`/customers/${row.original?._id}/edit`)"
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
      <TablePagination v-model:page="page" :paginator="paginator" />
    </div>

    <DialogDelete
      v-model="deleteModal"
      :loading="deleteUser.isPending.value"
      @ok="handleDelete"
    />
  </div>
</template>

<script setup lang="ts">
import TablePagination from '~/components/Table/Pagination.vue'
import { refDebounced } from '@vueuse/core'
import PageHeader from '~/components/Layout/PageHeader.vue'
import DialogDelete from '~/components/Dialog/Delete.vue'
import { useUsers, useUserMutations } from '@/composables/queries/useUsers'

definePageMeta({ layout: 'dashboard', title: 'Customer' })
useHead({ title: 'Gendut Grosir | Customers' })

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
const { data, isPending } = useUsers(params)
const items = computed(() => data.value?.items ?? [])
const paginator = computed(() => data.value?.paginator ?? {})

const { deleteUser } = useUserMutations()
const toast = useToast()

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
