<template>
  <div>
    <PageHeader
      title="Role"
      subtitle="Kelola role akses"
      :actions="false"
      :search-bar="false"
    />

    <div class="pt-4">
      <UCard>
        <h1 class="text-[24px] font-normal text-gray-900">Kelola Hak Akses</h1>
        <div class="mt-6 space-y-6">
          <template v-for="item in roles" :key="item._id">
            <p class="font-medium">{{ item.title }}</p>
            <div
              class="mb-4 mt-2 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5"
            >
              <UCheckbox
                v-for="feature in features"
                :key="feature.value"
                :model-value="
                  roleMap[item.roleName ?? '']?.includes(feature.value)
                "
                :label="feature.label"
                :disabled="
                  feature.value === 'pos' ||
                  item.roleName === 'super_admin' ||
                  updatePending
                "
                @update:model-value="
                  toggleAllow(item, feature.value, $event === true)
                "
              />
            </div>
          </template>
          <div v-if="isPending" class="space-y-2">
            <USkeleton class="h-6 w-full" />
            <USkeleton class="h-6 w-full" />
          </div>
        </div>
      </UCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import PageHeader from '~/components/Layout/PageHeader.vue'
import { useRoles, useRoleMutations } from '@/composables/queries/useLibrary'
import type { Role } from '~/services/generated/gendutGrosirAPI.schemas'

definePageMeta({ layout: 'dashboard', title: 'Role' })

const { data, isPending } = useRoles({})
const { updateRole: updateRoleMutation } = useRoleMutations()
const updatePending = computed(() => updateRoleMutation.isPending.value)

const toast = useToast()

const features = [
  { label: 'Point Of Sales', value: 'pos' },
  { label: 'Library', value: 'library' },
  { label: 'Orders', value: 'orders' },
  { label: 'Dashboard', value: 'dashboard' },
  { label: 'Role Management', value: 'role' },
  { label: 'Customers', value: 'customers' },
  { label: 'Product', value: 'product' },
  { label: 'Category', value: 'category' },
  { label: 'Stock Opname', value: 'stockOpname' },
]

const roles = computed(() => data.value ?? [])
const roleMap = ref<Record<string, string[]>>({ super_admin: [] })

watch(
  roles,
  (list) => {
    for (const item of list) {
      if (item.roleName) roleMap.value[item.roleName] = [...(item.allows ?? [])]
    }
  },
  { immediate: true },
)

async function toggleAllow(item: Role, feature: string, checked: boolean) {
  if (!item._id || !item.roleName) return
  const previous = roleMap.value[item.roleName] ?? []
  const allows = checked
    ? [...new Set([...previous, feature])]
    : previous.filter((allow) => allow !== feature)

  roleMap.value[item.roleName] = allows
  try {
    await updateRoleMutation.mutateAsync({ id: item._id, allows })
  } catch (e: any) {
    roleMap.value[item.roleName] = previous
    toast.add({
      title: 'Gagal memperbarui role',
      description: e?.data?.message ?? e?.message ?? '',
      color: 'error',
    })
  }
}
</script>
