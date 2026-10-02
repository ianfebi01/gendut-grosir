<template>
  <div>
    <PageHeader
      title="Tambah Customer"
      subtitle="Tambah customer baru untuk toko Anda"
      :actions="false"
      :search-bar="false"
    />

    <div class="pt-6">
      <CustomerForm />
    </div>
  </div>
</template>

<script setup lang="ts">
import PageHeader from '~/components/Layout/PageHeader.vue'
import CustomerForm from '~/components/Form/CustomerForm.vue'

definePageMeta({ layout: 'dashboard', title: 'Tambah Customer' })
useHead({ title: 'Gendut Grosir | Tambah Customer' })
</script>
