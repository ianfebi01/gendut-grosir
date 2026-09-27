<template>
  <form @submit.prevent="saveStockOpname">
    <UAlert
      v-if="mutationError"
      color="error"
      variant="soft"
      icon="i-lucide-circle-alert"
      :title="mutationError"
      class="mb-6"
    />

    <div class="divide-y divide-(--ui-border-muted)">
      <!-- Tambah Item -->
      <section class="form-section">
        <div>
          <h2 class="section-title">Tambah Item</h2>
          <p class="section-desc">
            Pilih produk lalu masukkan jumlah stok hasil hitung fisik.
          </p>
          <div
            class="mt-3 inline-flex items-center gap-1.5 rounded-(--radius-control) bg-ink-50 px-2.5 py-1 text-xs text-ink-600"
          >
            <UIcon name="i-lucide-calendar" class="size-3.5" />
            {{ today }}
          </div>
        </div>
        <div class="grid gap-4 sm:grid-cols-2">
          <UFormField
            label="Produk"
            required
            class="sm:col-span-2"
            :error="(touched.product && formError.product) || undefined"
          >
            <div class="grid gap-2 sm:grid-cols-2">
              <UInput
                v-model="productSearch"
                variant="outline"
                placeholder="Cari produk..."
                icon="i-lucide-search"
                class="w-full"
              />
              <USelect
                v-model="selectedProduct"
                :items="productOptions"
                label-key="label"
                value-key="value"
                placeholder="Pilih Produk"
                class="w-full"
                @update:open="
                  (open: boolean) => !open && (touched.product = true)
                "
              />
            </div>
          </UFormField>
          <UFormField label="Stok Sistem">
            <UInput
              variant="outline"
              :model-value="systemQty ?? ''"
              type="number"
              placeholder="-"
              icon="i-lucide-database"
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
              variant="outline"
              type="number"
              placeholder="Stok nyata"
              icon="i-lucide-package"
              class="w-full"
              :disabled="!selectedProduct"
              @blur="touched.realQty = true"
              @keydown.enter.prevent="addProduct"
            />
          </UFormField>
          <div class="flex justify-end sm:col-span-2">
            <UButton
              type="button"
              variant="outline"
              color="neutral"
              icon="i-lucide-plus"
              :disabled="!canAdd"
              @click="addProduct"
              >Tambahkan</UButton
            >
          </div>
        </div>
      </section>

      <!-- Daftar Item -->
      <section class="form-section">
        <div>
          <h2 class="section-title">Daftar Item</h2>
          <p class="section-desc">
            Produk yang akan dicatat. Perbedaan dihitung dari stok sesungguhnya
            dikurangi stok sistem.
          </p>
          <p v-if="staged.length" class="mt-3 text-xs font-medium text-ink-600">
            {{ staged.length }} item
          </p>
        </div>
        <div>
          <div
            v-if="staged.length === 0"
            class="flex w-full flex-col items-center justify-center gap-2 rounded-(--radius-card) border border-dashed border-ink-300 bg-ink-50 px-6 py-10 text-center"
          >
            <span
              class="flex size-10 items-center justify-center rounded-full bg-white shadow-(--shadow-lift)"
            >
              <UIcon
                name="i-lucide-clipboard-list"
                class="size-5 text-ink-600"
              />
            </span>
            <span class="text-sm font-medium text-ink-900">Belum ada item</span>
            <span class="text-xs text-ink-500"
              >Tambahkan produk dari bagian di atas</span
            >
          </div>
          <div
            v-else
            class="overflow-hidden rounded-(--radius-card) border border-(--ui-border-muted)"
          >
            <ProductTable :datas="staged" @delete-product="deleteProduct" />
          </div>
        </div>
      </section>
    </div>

    <!-- Actions stay visible while scrolling -->
    <div
      class="sticky bottom-0 -mx-4 mt-2 flex justify-end gap-2 border-t border-(--ui-border-muted) bg-white/90 px-4 py-4 backdrop-blur md:-mx-6 md:px-6"
    >
      <UButton
        variant="outline"
        color="neutral"
        size="lg"
        :disabled="createStockOpname.isPending.value"
        to="/library/stockOpname"
        >Batal</UButton
      >
      <UButton
        type="submit"
        color="primary"
        size="lg"
        icon="i-lucide-check"
        :loading="createStockOpname.isPending.value"
        :disabled="staged.length === 0"
        >Simpan Stock Opname</UButton
      >
    </div>
  </form>
</template>

<script setup lang="ts">
import { refDebounced } from '@vueuse/core'
import dayjs from 'dayjs'
import ProductTable from '~/components/Table/StockOpname/ProductTable.vue'
import { useStockOpnameMutations } from '@/composables/queries/useLibrary'
import { useProducts } from '@/composables/queries/useProducts'

defineOptions({ name: 'StockOpnameForm' })

const toast = useToast()
const today = dayjs().format('DD/MM/YYYY')

const { createStockOpname } = useStockOpnameMutations()
const mutationError = computed(() => {
  const e: any = createStockOpname.error.value
  return e?.data?.message ?? e?.message ?? ''
})

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
    await navigateTo('/library/stockOpname')
  } catch {
    // surfaced via mutationError
  }
}
</script>

<style scoped>
.form-section {
  display: grid;
  gap: 1rem 2.5rem;
  padding-block: 1.75rem;
}
.form-section:first-child {
  padding-top: 0.5rem;
}
@media (min-width: 1024px) {
  .form-section {
    grid-template-columns: 240px minmax(0, 1fr);
  }
}
.section-title {
  font-size: 0.9375rem;
  font-weight: 600;
  color: var(--color-ink-900);
}
.section-desc {
  margin-top: 0.25rem;
  font-size: 0.8125rem;
  line-height: 1.25rem;
  color: var(--color-ink-500);
}
</style>
