<template>
  <div>
    <PageHeader
      title="Tambah Kategori"
      subtitle="Buat kategori baru untuk produk Anda"
      :actions="false"
      :search-bar="false"
    />

    <div class="pt-6">
      <CategoryForm />
    </div>
  </div>
</template>

<script setup lang="ts">
import PageHeader from '~/components/Layout/PageHeader.vue'
import CategoryForm from '~/components/Form/CategoryForm.vue'

definePageMeta({ layout: 'dashboard', title: 'Tambah Kategori' })
useHead({ title: 'Gendut Grosir | Tambah Kategori' })
</script>
