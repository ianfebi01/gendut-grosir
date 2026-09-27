<template>
  <div>
    <PageHeader
      title="Tambah Produk"
      subtitle="Tambahkan produk untuk toko anda"
      :actions="false"
      :search-bar="false"
    />

    <div class="pt-6">
      <ProductForm />
    </div>
  </div>
</template>

<script setup lang="ts">
import PageHeader from '~/components/Layout/PageHeader.vue'
import ProductForm from '~/components/Form/ProductForm.vue'

definePageMeta({ layout: 'dashboard', title: 'Tambah Produk' })
useHead({ title: 'Gendut Grosir | Tambah Produk' })
</script>
