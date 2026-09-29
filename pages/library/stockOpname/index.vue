<template>
  <div>
    <PageHeader
      title="Stock Opname"
      subtitle="Kelola stock opname Anda"
      add-text="Tambah Stock Opname"
      :model-value="search"
      @update:model-value="search = $event"
      @add="navigateTo('/library/stockOpname/create')"
    />

    <div class="pt-4">
      <StockOpnameDataTable
        :datas="items"
        :paginator="paginator"
        :loading="isPending"
        :loading-apply="applyingId"
        @update:page="page = $event"
        @click-product="openDetailModal"
        @apply="openApplyModal"
      />
    </div>

    <!-- Detail modal -->
    <StockOpnameDetail
      v-model="detailModal"
      :opname="detailOpname"
      :loading-apply="applyStockOpname.isPending.value"
      @apply="openApplyModal"
    />

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
import PageHeader from '~/components/Layout/PageHeader.vue'
import StockOpnameDataTable from '~/components/Table/StockOpname/Datas.vue'
import StockOpnameDetail from '~/components/Dialog/StockOpnameDetail.vue'
import {
  useStockOpnames,
  useStockOpnameMutations,
} from '@/composables/queries/useLibrary'
import type { StockOpname } from '~/api/generated/gendutGrosirAPI.schemas'

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

const { applyStockOpname } = useStockOpnameMutations()

watch([search], () => {
  page.value = 1
})

// ---- Detail modal ----
const detailModal = ref(false)
const detailId = ref('')
// Read from the list so the status updates after "Sesuaikan"
const detailOpname = computed<StockOpname | null>(
  () => items.value.find((o) => o._id === detailId.value) ?? null,
)

function openDetailModal(opname: StockOpname) {
  detailId.value = opname?._id ?? ''
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
