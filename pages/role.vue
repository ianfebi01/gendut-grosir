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
          <template v-for="item in roles" :key="item?._id || item?.id">
            <p class="font-medium">{{ item.title }}</p>
            <div
              class="mb-4 mt-2 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5"
            >
              <UCheckbox
                v-model="roleMap[item.roleName]"
                label="Point Of Sales"
                value="pos"
                disabled
                @change="updateRole(item?._id, roleMap[item.roleName])"
              />
              <UCheckbox
                v-model="roleMap[item.roleName]"
                label="Library"
                value="library"
                :disabled="item.roleName === 'super_admin' || updatePending"
                @change="updateRole(item?._id, roleMap[item.roleName])"
              />
              <UCheckbox
                v-model="roleMap[item.roleName]"
                label="Orders"
                value="orders"
                :disabled="item.roleName === 'super_admin' || updatePending"
                @change="updateRole(item?._id, roleMap[item.roleName])"
              />
              <UCheckbox
                v-model="roleMap[item.roleName]"
                label="Dashboard"
                value="dashboard"
                :disabled="item.roleName === 'super_admin' || updatePending"
                @change="updateRole(item?._id, roleMap[item.roleName])"
              />
              <UCheckbox
                v-model="roleMap[item.roleName]"
                label="Role Management"
                value="role"
                :disabled="item.roleName === 'super_admin' || updatePending"
                @change="updateRole(item?._id, roleMap[item.roleName])"
              />
              <UCheckbox
                v-model="roleMap[item.roleName]"
                label="Customers"
                value="customers"
                :disabled="item.roleName === 'super_admin' || updatePending"
                @change="updateRole(item?._id, roleMap[item.roleName])"
              />
              <UCheckbox
                v-model="roleMap[item.roleName]"
                label="Product"
                value="product"
                :disabled="item.roleName === 'super_admin' || updatePending"
                @change="updateRole(item?._id, roleMap[item.roleName])"
              />
              <UCheckbox
                v-model="roleMap[item.roleName]"
                label="Category"
                value="category"
                :disabled="item.roleName === 'super_admin' || updatePending"
                @change="updateRole(item?._id, roleMap[item.roleName])"
              />
              <UCheckbox
                v-model="roleMap[item.roleName]"
                label="Stock Opname"
                value="stockOpname"
                :disabled="item.roleName === 'super_admin' || updatePending"
                @change="updateRole(item?._id, roleMap[item.roleName])"
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

definePageMeta({ layout: 'dashboard', title: 'Role' })

const { data, isPending } = useRoles({})
const { updateRole: updateRoleMutation } = useRoleMutations()
const updatePending = computed(() => updateRoleMutation.isPending.value)

const roles = computed<any[]>(() => (data.value as any[]) ?? [])
const roleMap = ref<Record<string, any[]>>({ super_admin: [] })

watch(
  roles,
  (list) => {
    for (const item of list) roleMap.value[item.roleName] = item.allows ?? []
  },
  { immediate: true },
)

async function updateRole(id: string, allows: any[]) {
  await updateRoleMutation.mutateAsync({ id, allows })
}
</script>
