<template>
  <div>
    <PageHeader
      title="Edit Kategori"
      subtitle="Ubah nama kategori"
      :actions="false"
      :search-bar="false"
    />

    <div class="pt-6">
      <div v-if="isPending" class="grid gap-4 lg:grid-cols-[240px_1fr]">
        <USkeleton class="h-10 w-full" />
        <USkeleton class="h-14 w-full max-w-md" />
      </div>
      <LayoutEmpty v-else-if="!category" />
      <CategoryForm v-else :category="category" />
    </div>
  </div>
</template>

<script setup lang="ts">
import PageHeader from '~/components/Layout/PageHeader.vue'
import CategoryForm from '~/components/Form/CategoryForm.vue'
import { useCategoryDetail } from '@/composables/queries/useCategories'

definePageMeta({ layout: 'dashboard', title: 'Edit Kategori' })
useHead({ title: 'Gendut Grosir | Edit Kategori' })

const route = useRoute()
const id = computed(() => route.params.id as string)
const { data: category, isPending } = useCategoryDetail(id)
</script>
