<template>
  <div>
    <PageHeader
      title="Produk"
      subtitle="Kelola produk anda"
      add-text="Tambah Produk"
      :model-value="search"
      @update:model-value="search = $event"
      @add="navigateTo('/library/product/create')"
    />

    <div class="flex flex-wrap items-end gap-3 pt-1">
      <div class="w-56">
        <USelect
          v-model="categoryFilter"
          :items="categoryFilterItems"
          label-key="label"
          value-key="value"
          placeholder="Semua Kategori"
          size="md"
          class="w-full"
        />
      </div>
      <div class="w-64">
        <UInput
          v-model="barcode"
          placeholder="Scan barcode tambah stok"
          icon="i-heroicons-qr-code-20-solid"
          size="md"
          class="w-full"
          :loading="addStockByBarcode.isPending.value"
          @keyup.enter="handleBarcodeInput"
        />
        <p v-if="barcodeSuccess" class="mt-1 text-xs text-green-600">
          {{ barcodeSuccess }}
        </p>
        <p v-if="barcodeError" class="mt-1 text-xs text-red-500">
          {{ barcodeError }}
        </p>
      </div>
    </div>

    <div class="pt-4">
      <UTable
        :data="items"
        :columns="columns"
        :loading="isPending"
        class="data-table"
        :ui="{ th: 'text-ink-900! border-b-0!', td: 'text-ink-900' }"
      >
        <template #image-cell="{ row }">
          <UAvatar
            :src="thumb(row.original?.image)"
            :alt="row.original?.name"
            size="md"
            class="bg-gray-100"
            icon="i-heroicons-photo-20-solid"
          />
        </template>
        <template #category-cell="{ row }">
          <span>{{ row.original?.category?.name ?? '-' }}</span>
        </template>
        <template #buyPrice-cell="{ row }">
          <span>{{ formatRupiah(row.original?.buyPrice) }}</span>
        </template>
        <template #retailPrice-cell="{ row }">
          <span>{{ formatRupiah(row.original?.retailPrice) }}</span>
        </template>
        <template #wholesalerPrice-cell="{ row }">
          <span>{{ formatRupiah(row.original?.wholesalerPrice) }}</span>
        </template>
        <template #action-cell="{ row }">
          <div class="flex gap-1">
            <UButton
              variant="ghost"
              color="neutral"
              size="xs"
              @click="navigateTo(`/library/product/${row.original?._id}/edit`)"
            >
              <template #leading
                ><UIcon name="i-heroicons-pencil-20-solid" class="size-4"
              /></template>
            </UButton>
            <UButton
              variant="ghost"
              color="neutral"
              size="xs"
              @click="openDeleteModal(row.original)"
            >
              <template #leading
                ><UIcon name="i-heroicons-trash-20-solid" class="size-4"
              /></template>
            </UButton>
          </div>
        </template>
      </UTable>
      <div class="my-4 flex items-center text-sm">
        <span class="font-medium text-gray-700"
          >Halaman {{ page }} dari {{ paginator?.totalPages }}</span
        >
        <div class="flex-1" />
        <UButton
          variant="outline"
          color="neutral"
          size="sm"
          :disabled="!paginator?.hasPrevPage"
          @click="page--"
          >Sebelumnya</UButton
        >
        <UButton
          variant="outline"
          color="neutral"
          size="sm"
          class="ml-2"
          :disabled="!paginator?.hasNextPage"
          @click="page++"
          >Selanjutnya</UButton
        >
      </div>
    </div>

    <DialogDelete
      v-model="deleteModal"
      :loading="deleteProduct.isPending.value"
      @ok="handleDelete"
    />
  </div>
</template>

<script setup lang="ts">
import { refDebounced } from '@vueuse/core'
import PageHeader from '~/components/Layout/PageHeader.vue'
import DialogDelete from '~/components/Dialog/Delete.vue'
import {
  useProducts,
  useProductMutations,
} from '@/composables/queries/useProducts'
import { useCategories } from '@/composables/queries/useCategories'
import { useUploadImageMutations } from '@/composables/queries/useLibrary'
import { formatRupiah } from '~/utils/formatRupiah'

definePageMeta({ layout: 'dashboard', title: 'Produk' })
useHead({ title: 'Gendut Grosir | Produk' })

const { $changeImageSize } = useNuxtApp()
const toast = useToast()

const search = ref('')
const debouncedSearch = refDebounced(search, 500)
const page = ref(1)
// 'all' = no filter (Select items can't use an empty-string value)
const categoryFilter = ref('all')
const deleteModal = ref(false)
const deleteId = ref('')
const deleteImageUrl = ref('')

const barcode = ref('')
const barcodeSuccess = ref('')
const barcodeError = ref('')

const params = computed(() => ({
  q: debouncedSearch.value,
  category: categoryFilter.value === 'all' ? undefined : categoryFilter.value,
  page: page.value,
  limit: 25,
}))
const { data, isPending } = useProducts(params)
const items = computed(() => data.value?.items ?? [])
const paginator = computed(() => data.value?.paginator ?? {})

const { data: categoryData } = useCategories(computed(() => ({ limit: 100 })))
const categoryOptions = computed(() =>
  ((categoryData.value as any)?.items ?? []).map((c: any) => ({
    label: c.name,
    value: c._id,
  })),
)
const categoryFilterItems = computed(() => [
  { label: 'Semua Kategori', value: 'all' },
  ...categoryOptions.value,
])

const { deleteProduct, addStockByBarcode } = useProductMutations()
const { deleteImage } = useUploadImageMutations()

const columns = [
  { accessorKey: 'image', header: 'Gambar' },
  { accessorKey: 'name', header: 'Nama' },
  { accessorKey: 'stock', header: 'Stok' },
  { accessorKey: 'category', header: 'Kategori' },
  { accessorKey: 'buyPrice', header: 'Harga Modal' },
  { accessorKey: 'retailPrice', header: 'Harga Retail' },
  { accessorKey: 'wholesalerPrice', header: 'Harga Sales' },
  { accessorKey: 'barcode', header: 'Barcode' },
  { id: 'action', header: 'Aksi' },
]

watch([search, categoryFilter], () => {
  page.value = 1
})

function thumb(url: string) {
  if (!url) return ''
  try {
    return ($changeImageSize as any)?.(url, 'xs') ?? url
  } catch {
    return url
  }
}

function openDeleteModal(item: any) {
  deleteId.value = item?._id ?? ''
  deleteImageUrl.value = item?.image ?? ''
  deleteModal.value = true
}

async function handleDelete() {
  try {
    await deleteProduct.mutateAsync(deleteId.value)
    const publicId = deleteImageUrl.value?.match(
      /(gendut-grosir)\/([a-zA-Z0-9]*)/,
    )?.[0]
    if (publicId) {
      try {
        await deleteImage.mutateAsync(publicId)
      } catch {}
    }
    toast.add({ title: 'Produk dihapus', color: 'success' })
    deleteModal.value = false
  } catch {
    toast.add({ title: 'Gagal menghapus produk', color: 'error' })
  }
}

async function handleBarcodeInput() {
  barcodeSuccess.value = ''
  barcodeError.value = ''
  const code = String(barcode.value ?? '').trim()
  if (!code) return
  try {
    const res: any = await addStockByBarcode.mutateAsync(code)
    const name = res?.name ?? res?.data?.name ?? code
    barcodeSuccess.value = `Stok produk ${name} ditambahkan 1`
    barcode.value = ''
  } catch (e: any) {
    barcodeError.value =
      e?.data?.message ?? e?.message ?? 'Barcode tidak ditemukan'
  }
}
</script>
