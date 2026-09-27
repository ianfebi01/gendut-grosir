<template>
  <div>
    <PageHeader
      title="Tambah Stock Opname"
      subtitle="Catat hasil hitung stok fisik produk"
      :actions="false"
      :search-bar="false"
    />

    <div class="pt-6">
      <StockOpnameForm />
    </div>
  </div>
</template>

<script setup lang="ts">
import PageHeader from '~/components/Layout/PageHeader.vue'
import StockOpnameForm from '~/components/Form/StockOpnameForm.vue'

definePageMeta({ layout: 'dashboard', title: 'Tambah Stock Opname' })
useHead({ title: 'Gendut Grosir | Tambah Stock Opname' })
</script>
