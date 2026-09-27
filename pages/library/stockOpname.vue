<template>
  <div>
    <PageHeader
      title="Stock Opname"
      subtitle="Kelola stock opname Anda"
      add-text="Tambah Stock Opname"
      :model-value="search"
      @update:model-value="search = $event"
      @add="openCreateModal"
    />

    <div class="pt-4">
      <StockOpnameDataTable
        :datas="items"
        :paginator="paginator"
        :loading="isPending"
        :loading-apply="applyingId"
        @next="page++"
        @previous="page--"
        @click-product="openDetailModal"
        @apply="openApplyModal"
      />
    </div>

    <!-- Create modal -->
    <UModal
      v-model:open="createModal"
      :ui="{ content: 'rounded-xl max-w-3xl w-full' }"
    >
      <template #content>
        <div class="flex flex-col items-center px-6 pt-6 text-center">
          <div class="icon-default mb-4 mt-2">
            <UIcon
              name="i-heroicons-clipboard-document-list-20-solid"
              class="size-6 text-primary-600"
            />
          </div>
          <h3 class="mb-2 text-[18px] font-bold leading-5 text-gray-900">
            Tambah Stock Opname
          </h3>
          <p class="text-sm font-normal leading-5 text-gray-500">
            {{ dayjs().format('DD/MM/YYYY') }}
          </p>
          <UAlert
            v-if="mutationError"
            color="error"
            variant="soft"
            :title="mutationError"
            class="mt-3 w-full"
          />
        </div>

        <div
          class="grid grid-cols-1 gap-3 px-6 py-4 md:grid-cols-[1fr_140px_160px_auto] md:items-end"
        >
          <div>
            <UFormField
              label="Produk"
              required
              :error="(touched.product && formError.product) || undefined"
            >
              <UInput
                v-model="productSearch"
                placeholder="Cari produk..."
                size="md"
                class="mb-2 w-full"
              />
              <USelect
                v-model="selectedProduct"
                :items="productOptions"
                label-key="label"
                value-key="value"
                placeholder="Pilih Produk"
                size="md"
                class="w-full"
              />
            </UFormField>
          </div>
          <UFormField label="Stok Sistem">
            <UInput
              :model-value="systemQty ?? ''"
              type="number"
              placeholder="-"
              size="md"
              class="w-full"
              disabled
            />
          </UFormField>
          <UFormField
            label="Stok Sesungguhnya"
            required
            :error="(touched.realQty && formError.realQty) || undefined"
          >
            <UInput
              v-model="realQty"
              type="number"
              placeholder="Stok nyata"
              size="md"
              class="w-full"
              :disabled="!selectedProduct"
              @blur="touched.realQty = true"
            />
          </UFormField>
          <UButton
            color="primary"
            size="md"
            :disabled="!canAdd"
            @click="addProduct"
            >Tambahkan</UButton
          >
        </div>

        <div class="px-6 pb-2">
          <ProductTable :datas="staged" @delete-product="deleteProduct" />
        </div>

        <div class="flex gap-2 px-6 pb-6 pt-2">
          <UButton
            block
            variant="outline"
            color="neutral"
            size="lg"
            :disabled="createStockOpname.isPending.value"
            @click="closeCreateModal"
            >Batal</UButton
          >
          <UButton
            block
            color="primary"
            size="lg"
            :loading="createStockOpname.isPending.value"
            :disabled="staged.length === 0"
            @click="saveStockOpname"
            >Simpan Stock Opname</UButton
          >
        </div>
      </template>
    </UModal>

    <!-- Detail modal -->
    <UModal
      v-model:open="detailModal"
      :ui="{ content: 'rounded-xl max-w-3xl w-full' }"
    >
      <template #content>
        <div class="flex flex-col items-center px-6 pt-6 text-center">
          <h3 class="mb-1 text-[18px] font-bold leading-5 text-gray-900">
            Produk
          </h3>
          <p class="text-sm font-normal leading-5 text-gray-500">
            Detail produk stock opname
          </p>
        </div>
        <div class="px-6 py-4">
          <ProductTable :datas="detailProducts" read-only />
        </div>
        <div class="flex justify-end px-6 pb-6">
          <UButton
            variant="outline"
            color="neutral"
            size="lg"
            @click="detailModal = false"
            >Tutup</UButton
          >
        </div>
      </template>
    </UModal>

    <!-- Apply confirm -->
    <UModal
      v-model:open="applyModal"
      :ui="{ content: 'rounded-xl max-w-[408px] w-full' }"
    >
      <template #content>
        <div class="flex flex-col items-center px-6 pt-6 text-center">
          <div class="icon-oke mb-4 mt-2">
            <UIcon
              name="i-heroicons-check-20-solid"
              class="size-6 text-green-600"
            />
          </div>
          <h3 class="mb-2 text-[18px] font-bold leading-5 text-gray-900">
            Sesuaikan Stok?
          </h3>
          <p class="text-sm font-normal leading-5 text-gray-500">
            Stok produk akan disesuaikan dengan hasil stock opname. Lanjutkan?
          </p>
        </div>
        <div class="flex gap-2 px-6 pb-6 pt-4">
          <UButton
            block
            variant="outline"
            color="neutral"
            size="lg"
            :disabled="applyStockOpname.isPending.value"
            @click="applyModal = false"
            >Batal</UButton
          >
          <UButton
            block
            color="primary"
            size="lg"
            :loading="applyStockOpname.isPending.value"
            @click="confirmApply"
            >Sesuaikan</UButton
          >
        </div>
      </template>
    </UModal>
  </div>
</template>

<script setup lang="ts">
import { refDebounced } from '@vueuse/core'
import dayjs from 'dayjs'
import PageHeader from '~/components/Layout/PageHeader.vue'
import StockOpnameDataTable from '~/components/Table/StockOpname/Datas.vue'
import ProductTable from '~/components/Table/StockOpname/ProductTable.vue'
import {
  useStockOpnames,
  useStockOpnameMutations,
} from '@/composables/queries/useLibrary'
import { useProducts } from '@/composables/queries/useProducts'

definePageMeta({ layout: 'dashboard', title: 'Stock Opname' })
useHead({ title: 'Gendut Grosir | Stock Opname' })

const toast = useToast()

const search = ref('')
const debouncedSearch = refDebounced(search, 500)
const page = ref(1)

const params = computed(() => ({
  q: debouncedSearch.value,
  page: page.value,
  limit: 25,
}))
const { data, isPending } = useStockOpnames(params)
const items = computed(() => data.value?.items ?? [])
const paginator = computed(() => data.value?.paginator ?? {})

const { createStockOpname, applyStockOpname } = useStockOpnameMutations()
const mutationError = computed(() => {
  const e: any = createStockOpname.error.value ?? applyStockOpname.error.value
  return e?.data?.message ?? e?.message ?? ''
})

watch([search], () => {
  page.value = 1
})

// ---- Create stock opname ----
const createModal = ref(false)
const productSearch = ref('')
const debouncedProductSearch = refDebounced(productSearch, 500)
const selectedProduct = ref('')
const realQty = ref<number | null>(null)
const touched = reactive({ product: false, realQty: false })
const staged = ref<any[]>([])

const { data: productData } = useProducts(
  computed(() => ({ q: debouncedProductSearch.value, page: 1, limit: 50 })),
)
const productList = computed(() => productData.value?.items ?? [])
const productOptions = computed(() => {
  const picked = new Set(staged.value.map((s: any) => s.product))
  return productList.value
    .filter((p: any) => !picked.has(p._id))
    .map((p: any) => ({ label: p.name, value: p._id }))
})
const selectedProductDetail = computed(() =>
  productList.value.find((p: any) => p._id === selectedProduct.value),
)
const systemQty = computed(() => selectedProductDetail.value?.stock ?? null)

const formError = computed(() => ({
  product: !selectedProduct.value ? 'Produk wajib dipilih' : '',
  realQty:
    realQty.value === null || realQty.value === ('' as any)
      ? 'Stok sesungguhnya wajib diisi'
      : isNaN(Number(realQty.value))
        ? 'Hanya boleh angka'
        : '',
}))
const canAdd = computed(
  () =>
    !!selectedProduct.value &&
    realQty.value !== null &&
    realQty.value !== ('' as any) &&
    !isNaN(Number(realQty.value)),
)

function openCreateModal() {
  staged.value = []
  selectedProduct.value = ''
  realQty.value = null
  productSearch.value = ''
  touched.product = touched.realQty = false
  createStockOpname.reset()
  createModal.value = true
}

function closeCreateModal() {
  createModal.value = false
}

function addProduct() {
  touched.product = touched.realQty = true
  if (!canAdd.value) return
  const detail = selectedProductDetail.value
  const qty = Number(realQty.value)
  const sys = Number(systemQty.value ?? 0)
  staged.value.push({
    product: selectedProduct.value,
    productName: detail?.name ?? '',
    systemQty: sys,
    realQty: qty,
    difference: qty - sys,
  })
  selectedProduct.value = ''
  realQty.value = null
  touched.product = touched.realQty = false
}

function deleteProduct(productId: any) {
  const id = typeof productId === 'object' ? productId?._id : productId
  const idx = staged.value.findIndex(
    (s: any) => s.product === id || s.product === productId,
  )
  if (idx !== -1) staged.value.splice(idx, 1)
}

async function saveStockOpname() {
  if (staged.value.length === 0) return
  try {
    await createStockOpname.mutateAsync({
      date: new Date(),
      product: staged.value,
    })
    toast.add({ title: 'Stock opname disimpan', color: 'success' })
    createModal.value = false
    staged.value = []
  } catch {}
}

// ---- Detail modal ----
const detailModal = ref(false)
const detailProducts = ref<any[]>([])

function openDetailModal(products: any[]) {
  detailProducts.value = products ?? []
  detailModal.value = true
}

// ---- Apply ----
const applyModal = ref(false)
const applyId = ref('')
const applyingId = computed(() =>
  applyStockOpname.isPending.value ? applyId.value : '',
)

function openApplyModal(id: string) {
  applyId.value = id
  applyStockOpname.reset()
  applyModal.value = true
}

async function confirmApply() {
  try {
    await applyStockOpname.mutateAsync(applyId.value)
    toast.add({ title: 'Stok disesuaikan', color: 'success' })
    applyModal.value = false
    applyId.value = ''
  } catch {
    toast.add({ title: 'Gagal menyesuaikan stok', color: 'error' })
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
.icon-oke {
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: #d1fadf;
  width: 58px;
  height: 58px;
  border: 8px solid #ecfdf3;
}
</style>
