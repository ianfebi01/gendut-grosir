<template>
  <div>
    <PageHeader
      title="Edit Produk"
      subtitle="Ubah produk di toko anda"
      :actions="false"
      :search-bar="false"
    />

    <div class="pt-6">
      <div v-if="isPending" class="grid gap-6 lg:grid-cols-[320px_1fr]">
        <USkeleton class="aspect-square w-full" />
        <div class="grid content-start gap-4 md:grid-cols-2">
          <USkeleton v-for="i in 6" :key="i" class="h-14 w-full" />
        </div>
      </div>
      <LayoutEmpty v-else-if="!product" />
      <ProductForm v-else :product="product" />
    </div>
  </div>
</template>

<script setup lang="ts">
import PageHeader from '~/components/Layout/PageHeader.vue'
import ProductForm from '~/components/Form/ProductForm.vue'
import { useProductDetail } from '@/composables/queries/useProducts'

definePageMeta({ layout: 'dashboard', title: 'Edit Produk' })
useHead({ title: 'Gendut Grosir | Edit Produk' })

const route = useRoute()
const id = computed(() => route.params.id as string)
const { data: product, isPending } = useProductDetail(id)
</script>
