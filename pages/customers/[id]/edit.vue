<template>
  <div>
    <PageHeader
      title="Edit Customer"
      subtitle="Edit customer pada toko Anda"
      :actions="false"
      :search-bar="false"
    />

    <div class="pt-6">
      <div v-if="isPending" class="grid gap-4 md:grid-cols-2">
        <USkeleton class="h-28 w-full md:col-span-2" />
        <USkeleton v-for="i in 4" :key="i" class="h-14 w-full" />
      </div>
      <LayoutEmpty v-else-if="!customer" />
      <CustomerForm v-else :customer="customer" />
    </div>
  </div>
</template>

<script setup lang="ts">
import PageHeader from '~/components/Layout/PageHeader.vue'
import CustomerForm from '~/components/Form/CustomerForm.vue'
import { useUserDetail } from '@/composables/queries/useUsers'

definePageMeta({ layout: 'dashboard', title: 'Edit Customer' })
useHead({ title: 'Gendut Grosir | Edit Customer' })

const route = useRoute()
const id = computed(() => route.params.id as string)
const { data, isPending } = useUserDetail(id)
// getUserById may return the user directly or wrapped in `data` / `_doc`
const customer = computed(() => {
  const d: any = data.value
  const user = d?.data ?? d
  return user?._doc ?? user
})
</script>
