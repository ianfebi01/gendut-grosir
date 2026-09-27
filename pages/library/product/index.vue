<template>
  <div>
    <PageHeader
      title="Produk"
      subtitle="Kelola produk anda"
      add-text="Tambah Produk"
      :model-value="search"
      @update:model-value="search = $event"
      @add="openAddModal"
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
              @click="openEditModal(row.original)"
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

    <!-- Add / Edit -->
    <UModal
      v-model:open="modal"
      :ui="{ content: 'rounded-xl max-w-3xl w-full' }"
    >
      <template #content>
        <div class="flex flex-col items-center px-6 pt-6 text-center">
          <div class="icon-default mb-4 mt-2">
            <UIcon
              name="i-heroicons-cube-20-solid"
              class="size-6 text-primary-600"
            />
          </div>
          <h3 class="mb-2 text-[18px] font-bold leading-5 text-gray-900">
            {{ isEdit ? 'Edit Produk' : 'Tambahkan Produk' }}
          </h3>
          <p class="text-sm font-normal leading-5 text-gray-500">
            {{
              isEdit
                ? 'Ubah produk di toko anda'
                : 'Tambahkan produk untuk toko anda'
            }}
          </p>
          <UAlert
            v-if="mutationError"
            color="error"
            variant="soft"
            :title="mutationError"
            class="mt-3 w-full"
          />
        </div>

        <div class="grid grid-cols-1 gap-4 px-6 py-4 md:grid-cols-2">
          <div>
            <label class="mb-1 block text-sm font-medium text-gray-700"
              >Gambar</label
            >
            <div
              class="relative flex h-[201px] w-full cursor-pointer flex-col items-center justify-center overflow-hidden rounded-lg border border-gray-300 bg-white shadow-sm"
              @click="triggerFileInput"
            >
              <UButton
                v-if="imagePreview"
                variant="ghost"
                color="neutral"
                size="xs"
                class="absolute right-1 top-1 z-10"
                @click.stop="clearImage"
              >
                <template #leading
                  ><UIcon name="i-heroicons-x-mark-20-solid" class="size-4"
                /></template>
              </UButton>
              <div
                v-if="!imagePreview"
                class="flex flex-col items-center justify-center px-4 text-center"
              >
                <div
                  class="flex h-10 w-10 items-center justify-center rounded-full border-8 border-gray-50 bg-gray-100"
                >
                  <UIcon
                    name="i-heroicons-arrow-up-tray-20-solid"
                    class="size-4 text-gray-500"
                  />
                </div>
                <span class="mt-2 text-sm font-bold text-primary-600"
                  >Klik untuk upload foto</span
                >
                <span class="text-xs font-normal text-gray-500"
                  >SVG, PNG, JPG or GIF (max. 800x400px)</span
                >
              </div>
              <img
                v-else
                :src="imagePreview"
                alt="preview"
                class="h-full w-full object-contain"
              />
            </div>
            <input
              ref="fileInput"
              type="file"
              accept="image/*"
              class="hidden"
              @change="onImageInput"
            />

            <UFormField
              label="Nama"
              required
              :error="(touched.name && errors.name) || undefined"
            >
              <UInput
                v-model="form.name"
                placeholder="Masukkan nama produk"
                size="md"
                class="w-full"
                @blur="touched.name = true"
              />
            </UFormField>
            <UFormField
              label="Kategori"
              required
              :error="(touched.category && errors.category) || undefined"
              class="mt-2"
            >
              <USelect
                v-model="form.category"
                :items="categoryOptions"
                label-key="label"
                value-key="value"
                placeholder="Pilih Kategori"
                size="md"
                class="w-full"
              />
            </UFormField>
            <UFormField label="Deskripsi" class="mt-2">
              <UTextarea
                v-model="form.description"
                placeholder="Deskripsi produk (opsional)"
                size="md"
                class="w-full"
                :rows="3"
              />
            </UFormField>
          </div>

          <div>
            <UFormField label="Stok" :error="errors.stock || undefined">
              <UInput
                v-model="form.stock"
                type="number"
                placeholder="Masukkan stok"
                size="md"
                class="w-full"
              />
            </UFormField>
            <UFormField
              label="Harga Modal"
              required
              :error="(touched.buyPrice && errors.buyPrice) || undefined"
              class="mt-2"
            >
              <UInput
                v-model="form.buyPrice"
                type="number"
                placeholder="Masukkan harga modal"
                size="md"
                class="w-full"
                @blur="touched.buyPrice = true"
              />
            </UFormField>
            <UFormField
              label="Jual ke Sales"
              required
              :error="
                (touched.wholesalerPrice && errors.wholesalerPrice) || undefined
              "
              class="mt-2"
            >
              <UInput
                v-model="form.wholesalerPrice"
                type="number"
                placeholder="Masukkan harga sales"
                size="md"
                class="w-full"
                @blur="touched.wholesalerPrice = true"
              />
            </UFormField>
            <UFormField
              label="Jual ke Retail"
              required
              :error="(touched.retailPrice && errors.retailPrice) || undefined"
              class="mt-2"
            >
              <UInput
                v-model="form.retailPrice"
                type="number"
                placeholder="Masukkan harga retail"
                size="md"
                class="w-full"
                @blur="touched.retailPrice = true"
              />
            </UFormField>
            <UFormField label="Barcode" class="mt-2">
              <UInput
                v-model="form.barcode"
                placeholder="Masukkan barcode"
                size="md"
                class="w-full"
              />
            </UFormField>
          </div>
        </div>

        <div class="flex gap-2 px-6 pb-6">
          <UButton
            block
            variant="outline"
            color="neutral"
            size="lg"
            :disabled="saving"
            @click="closeModal"
            >Batal</UButton
          >
          <UButton
            block
            color="primary"
            size="lg"
            :loading="saving"
            :disabled="!valid"
            @click="handleSave"
            >Simpan</UButton
          >
        </div>
      </template>
    </UModal>

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
const modal = ref(false)
const deleteModal = ref(false)
const isEdit = ref(false)
const deleteId = ref('')
const deleteImageUrl = ref('')

const barcode = ref('')
const barcodeSuccess = ref('')
const barcodeError = ref('')

const form = reactive({
  _id: '' as string,
  name: '',
  category: '' as string,
  stock: null as number | null,
  buyPrice: null as number | null,
  wholesalerPrice: null as number | null,
  retailPrice: null as number | null,
  barcode: '',
  description: '',
})
const touched = reactive({
  name: false,
  category: false,
  buyPrice: false,
  wholesalerPrice: false,
  retailPrice: false,
})

const imageFile = ref<File | null>(null)
const imagePreview = ref<string>('')
const fileInput = ref<HTMLInputElement | null>(null)

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

const { createProduct, updateProduct, deleteProduct, addStockByBarcode } =
  useProductMutations()
const { deleteImage } = useUploadImageMutations()

const saving = computed(
  () => createProduct.isPending.value || updateProduct.isPending.value,
)
const mutationError = computed(() => {
  const e: any = createProduct.error.value ?? updateProduct.error.value
  return e?.data?.message ?? e?.message ?? ''
})

const errors = computed(() => ({
  name: !form.name
    ? 'Nama wajib diisi'
    : form.name.length < 2
      ? 'Minimal 2 karakter'
      : '',
  category: !form.category ? 'Kategori wajib diisi' : '',
  buyPrice:
    form.buyPrice === null || form.buyPrice === ('' as any)
      ? 'Harga modal wajib diisi'
      : isNaN(Number(form.buyPrice))
        ? 'Harus angka'
        : '',
  wholesalerPrice:
    form.wholesalerPrice === null || form.wholesalerPrice === ('' as any)
      ? 'Harga sales wajib diisi'
      : isNaN(Number(form.wholesalerPrice))
        ? 'Harus angka'
        : '',
  retailPrice:
    form.retailPrice === null || form.retailPrice === ('' as any)
      ? 'Harga retail wajib diisi'
      : isNaN(Number(form.retailPrice))
        ? 'Harus angka'
        : '',
  stock:
    form.stock !== null &&
    form.stock !== ('' as any) &&
    isNaN(Number(form.stock))
      ? 'Harus angka'
      : '',
}))
const valid = computed(
  () =>
    !errors.value.name &&
    !errors.value.category &&
    !errors.value.buyPrice &&
    !errors.value.wholesalerPrice &&
    !errors.value.retailPrice &&
    !errors.value.stock,
)

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

function resetForm() {
  form._id = ''
  form.name = ''
  form.category = ''
  form.stock = null
  form.buyPrice = null
  form.wholesalerPrice = null
  form.retailPrice = null
  form.barcode = ''
  form.description = ''
  touched.name =
    touched.category =
    touched.buyPrice =
    touched.wholesalerPrice =
    touched.retailPrice =
      false
  clearImage()
  createProduct.reset()
  updateProduct.reset()
}

function closeModal() {
  modal.value = false
  resetForm()
}

function openAddModal() {
  resetForm()
  isEdit.value = false
  modal.value = true
}

function openEditModal(item: any) {
  resetForm()
  isEdit.value = true
  form._id = item?._id ?? ''
  form.name = item?.name ?? ''
  form.category = item?.category?._id ?? item?.category ?? ''
  form.stock = item?.stock ?? null
  form.buyPrice = item?.buyPrice ?? null
  form.wholesalerPrice = item?.wholesalerPrice ?? null
  form.retailPrice = item?.retailPrice ?? null
  form.barcode = item?.barcode ?? ''
  form.description = item?.description ?? ''
  imagePreview.value = item?.image ?? ''
  modal.value = true
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

function buildFormData() {
  const fd = new FormData()
  if (imageFile.value) fd.append('image', imageFile.value)
  if (isEdit.value && form._id) fd.append('_id', form._id)
  fd.append('name', form.name)
  fd.append('category', form.category)
  if (form.stock !== null && form.stock !== '')
    fd.append('stock', String(form.stock))
  fd.append('buyPrice', String(form.buyPrice))
  fd.append('wholesalerPrice', String(form.wholesalerPrice))
  fd.append('retailPrice', String(form.retailPrice))
  if (form.barcode) fd.append('barcode', form.barcode)
  if (form.description) fd.append('description', form.description)
  return fd
}

async function handleSave() {
  touched.name =
    touched.category =
    touched.buyPrice =
    touched.wholesalerPrice =
    touched.retailPrice =
      true
  if (!valid.value) return
  try {
    if (isEdit.value) {
      await updateProduct.mutateAsync(buildFormData())
      toast.add({ title: 'Produk diperbarui', color: 'success' })
    } else {
      await createProduct.mutateAsync(buildFormData())
      toast.add({ title: 'Produk ditambahkan', color: 'success' })
    }
    modal.value = false
    resetForm()
  } catch {}
}

function triggerFileInput() {
  fileInput.value?.click()
}

function onImageInput(event: Event) {
  const file = (event.target as HTMLInputElement)?.files?.[0]
  if (!file) return
  imageFile.value = file
  imagePreview.value = URL.createObjectURL(file)
}

function clearImage() {
  imageFile.value = null
  imagePreview.value = ''
  if (fileInput.value) fileInput.value.value = ''
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

<style scoped>
.icon-default {
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: var(--color-primary-100);
  width: 58px;
  height: 58px;
  border: 8px solid var(--color-primary-50);
}
</style>
