<template>
  <form @submit.prevent="handleSave">
    <UAlert
      v-if="mutationError"
      color="error"
      variant="soft"
      icon="i-lucide-circle-alert"
      :title="mutationError"
      class="mb-6"
    />

    <div class="divide-y divide-(--ui-border-muted)">
      <!-- Informasi -->
      <section class="form-section">
        <div>
          <h2 class="section-title">Informasi Produk</h2>
          <p class="section-desc">
            Nama, kategori dan deskripsi yang tampil di katalog.
          </p>
        </div>
        <div class="grid gap-4 sm:grid-cols-2">
          <UFormField
            label="Nama"
            required
            :error="(touched.name && errors.name) || undefined"
          >
            <UInput
              variant="outline"
              v-model="form.name"
              placeholder="Contoh: Beras Pandan Wangi 5kg"
              class="w-full"
              @blur="touched.name = true"
            />
          </UFormField>
          <UFormField
            label="Kategori"
            required
            :error="(touched.category && errors.category) || undefined"
          >
            <USelect
              v-model="form.category"
              :items="categoryOptions"
              label-key="label"
              value-key="value"
              placeholder="Pilih kategori"
              class="w-full"
              @update:open="
                (open: boolean) => !open && (touched.category = true)
              "
            />
          </UFormField>
          <UFormField label="Deskripsi" hint="Opsional" class="sm:col-span-2">
            <UTextarea
              v-model="form.description"
              placeholder="Tulis detail singkat produk"
              class="w-full"
              :rows="4"
              autoresize
            />
          </UFormField>
        </div>
      </section>

      <!-- Foto -->
      <section class="form-section">
        <div>
          <h2 class="section-title">Foto Produk</h2>
          <p class="section-desc">
            SVG, PNG, JPG atau GIF. Ukuran ideal 800×800px.
          </p>
        </div>
        <div>
          <div v-if="imagePreview" class="flex items-center gap-4">
            <img
              :src="imagePreview"
              alt="Foto produk"
              class="size-28 rounded-(--radius-card) border border-(--ui-border-muted) bg-ink-50 object-contain"
            />
            <div class="flex gap-2">
              <UButton
                variant="outline"
                color="neutral"
                icon="i-lucide-refresh-cw"
                @click="triggerFileInput"
                >Ganti</UButton
              >
              <UButton
                variant="ghost"
                color="error"
                icon="i-lucide-trash-2"
                @click="clearImage"
                >Hapus</UButton
              >
            </div>
          </div>
          <button
            v-else
            type="button"
            class="flex w-full flex-col items-center justify-center gap-2 rounded-(--radius-card) border border-dashed border-ink-300 bg-ink-50 px-6 py-10 text-center transition-colors hover:border-ink-400 hover:bg-ink-100"
            @click="triggerFileInput"
          >
            <span
              class="flex size-10 items-center justify-center rounded-full bg-white shadow-(--shadow-lift)"
            >
              <UIcon name="i-lucide-image-plus" class="size-5 text-ink-600" />
            </span>
            <span class="text-sm font-medium text-ink-900"
              >Klik untuk upload foto</span
            >
            <span class="text-xs text-ink-500">Maksimal 1 foto</span>
          </button>
          <input
            ref="fileInput"
            type="file"
            accept="image/*"
            class="hidden"
            @change="onImageInput"
          />
        </div>
      </section>

      <!-- Harga -->
      <section class="form-section">
        <div>
          <h2 class="section-title">Harga</h2>
          <p class="section-desc">
            Harga modal dan harga jual untuk sales maupun retail.
          </p>
        </div>
        <div>
          <div class="grid gap-4 sm:grid-cols-3">
            <UFormField
              label="Harga Modal"
              required
              :error="(touched.buyPrice && errors.buyPrice) || undefined"
            >
              <UInput
                variant="outline"
                v-model="form.buyPrice"
                type="number"
                placeholder="0"
                class="w-full"
                :ui="{ leading: 'text-sm text-ink-500' }"
                @blur="touched.buyPrice = true"
              >
                <template #leading>Rp</template>
              </UInput>
            </UFormField>
            <UFormField
              label="Jual ke Sales"
              required
              :error="
                (touched.wholesalerPrice && errors.wholesalerPrice) || undefined
              "
            >
              <UInput
                variant="outline"
                v-model="form.wholesalerPrice"
                type="number"
                placeholder="0"
                class="w-full"
                :ui="{ leading: 'text-sm text-ink-500' }"
                @blur="touched.wholesalerPrice = true"
              >
                <template #leading>Rp</template>
              </UInput>
            </UFormField>
            <UFormField
              label="Jual ke Retail"
              required
              :error="(touched.retailPrice && errors.retailPrice) || undefined"
            >
              <UInput
                variant="outline"
                v-model="form.retailPrice"
                type="number"
                placeholder="0"
                class="w-full"
                :ui="{ leading: 'text-sm text-ink-500' }"
                @blur="touched.retailPrice = true"
              >
                <template #leading>Rp</template>
              </UInput>
            </UFormField>
          </div>
          <div
            v-if="margins.length"
            class="mt-4 flex flex-wrap gap-x-6 gap-y-1 rounded-(--radius-control) bg-ink-50 px-3 py-2 text-xs text-ink-600"
          >
            <span v-for="m in margins" :key="m.label">
              Margin {{ m.label }}:
              <span
                class="font-medium"
                :class="m.value < 0 ? 'text-error' : 'text-ink-900'"
                >{{ formatRupiah(m.value) || 'Rp 0' }} ({{ m.percent }}%)</span
              >
            </span>
          </div>
        </div>
      </section>

      <!-- Inventaris -->
      <section class="form-section">
        <div>
          <h2 class="section-title">Inventaris</h2>
          <p class="section-desc">Stok awal dan barcode untuk scan di kasir.</p>
        </div>
        <div class="grid gap-4 sm:grid-cols-2">
          <UFormField label="Stok" :error="errors.stock || undefined">
            <UInput
              variant="outline"
              v-model="form.stock"
              type="number"
              placeholder="0"
              icon="i-lucide-package"
              class="w-full"
            />
          </UFormField>
          <UFormField label="Barcode" hint="Opsional">
            <UInput
              variant="outline"
              v-model="form.barcode"
              placeholder="Scan atau ketik barcode"
              icon="i-lucide-scan-barcode"
              class="w-full"
            />
          </UFormField>
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
        :disabled="saving"
        to="/library/product"
        >Batal</UButton
      >
      <UButton
        type="submit"
        color="primary"
        size="lg"
        icon="i-lucide-check"
        :loading="saving"
        :disabled="!valid"
        >{{ isEdit ? 'Simpan Perubahan' : 'Simpan Produk' }}</UButton
      >
    </div>
  </form>
</template>

<script setup lang="ts">
import { useProductMutations } from '@/composables/queries/useProducts'
import { useCategories } from '@/composables/queries/useCategories'
import { formatRupiah } from '~/utils/formatRupiah'

defineOptions({ name: 'ProductForm' })

// Pass `product` to edit; omit it to create
const props = defineProps<{ product?: any }>()

const toast = useToast()
const isEdit = computed(() => !!props.product)

const form = reactive({
  _id: '' as string,
  name: '',
  category: undefined as string | undefined,
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

// Fill the form when the product (edit mode) arrives
watch(
  () => props.product,
  (item) => {
    if (!item) return
    form._id = item._id ?? ''
    form.name = item.name ?? ''
    form.category = item.category?._id ?? item.category ?? undefined
    form.stock = item.stock ?? null
    form.buyPrice = item.buyPrice ?? null
    form.wholesalerPrice = item.wholesalerPrice ?? null
    form.retailPrice = item.retailPrice ?? null
    form.barcode = item.barcode ?? ''
    form.description = item.description ?? ''
    imagePreview.value = item.image ?? ''
  },
  { immediate: true },
)

const { data: categoryData } = useCategories(computed(() => ({ limit: 100 })))
const categoryOptions = computed(() =>
  ((categoryData.value as any)?.items ?? []).map((c: any) => ({
    label: c.name,
    value: c._id,
  })),
)

const { createProduct, updateProduct } = useProductMutations()

const saving = computed(
  () => createProduct.isPending.value || updateProduct.isPending.value,
)
const mutationError = computed(() => {
  const e: any = createProduct.error.value ?? updateProduct.error.value
  return e?.data?.message ?? e?.message ?? ''
})

const isEmpty = (v: unknown) => v === null || v === undefined || v === ''

const errors = computed(() => ({
  name: !form.name
    ? 'Nama wajib diisi'
    : form.name.length < 2
      ? 'Minimal 2 karakter'
      : '',
  category: !form.category ? 'Kategori wajib diisi' : '',
  buyPrice: isEmpty(form.buyPrice)
    ? 'Harga modal wajib diisi'
    : isNaN(Number(form.buyPrice))
      ? 'Harus angka'
      : '',
  wholesalerPrice: isEmpty(form.wholesalerPrice)
    ? 'Harga sales wajib diisi'
    : isNaN(Number(form.wholesalerPrice))
      ? 'Harus angka'
      : '',
  retailPrice: isEmpty(form.retailPrice)
    ? 'Harga retail wajib diisi'
    : isNaN(Number(form.retailPrice))
      ? 'Harus angka'
      : '',
  stock: !isEmpty(form.stock) && isNaN(Number(form.stock)) ? 'Harus angka' : '',
}))
// Live margin hint vs. harga modal
const margins = computed(() => {
  const buy = Number(form.buyPrice)
  if (isEmpty(form.buyPrice) || !buy) return []
  return [
    { label: 'sales', price: form.wholesalerPrice },
    { label: 'retail', price: form.retailPrice },
  ]
    .filter((m) => !isEmpty(m.price) && !isNaN(Number(m.price)))
    .map((m) => {
      const value = Number(m.price) - buy
      return { label: m.label, value, percent: Math.round((value / buy) * 100) }
    })
})

const valid = computed(() => Object.values(errors.value).every((e) => !e))

function buildFormData() {
  const fd = new FormData()
  if (imageFile.value) fd.append('image', imageFile.value)
  if (isEdit.value && form._id) fd.append('_id', form._id)
  fd.append('name', form.name)
  fd.append('category', form.category ?? '')
  if (!isEmpty(form.stock)) fd.append('stock', String(form.stock))
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
    await navigateTo('/library/product')
  } catch {
    // surfaced via mutationError
  }
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
