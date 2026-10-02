<template>
  <div class="my-4 flex flex-wrap items-center justify-between gap-3 text-sm">
    <span class="text-ink-600">
      Halaman
      <span class="font-medium text-ink-900">{{ page }}</span>
      dari
      <span class="font-medium text-ink-900">{{ totalPages }}</span>
      <template v-if="paginator?.totalDocs != null">
        · {{ paginator.totalDocs }} data</template
      >
    </span>
    <UPagination
      v-if="totalPages > 1"
      v-model:page="page"
      :total="total"
      :items-per-page="itemsPerPage"
      :sibling-count="1"
      show-edges
      size="sm"
      color="neutral"
      variant="outline"
      active-color="primary"
      active-variant="solid"
    />
  </div>
</template>

<script setup lang="ts">
defineOptions({ name: 'TablePagination' })

// `paginator` is the API's paginator object ({ totalPages, limit, totalDocs, ... })
const props = defineProps<{ paginator?: Record<string, any> }>()
const page = defineModel<number>('page', { default: 1 })

const totalPages = computed(() => Number(props.paginator?.totalPages) || 1)
const itemsPerPage = computed(() => Number(props.paginator?.limit) || 25)
// UPagination derives the page count from total / itemsPerPage
const total = computed(
  () =>
    Number(props.paginator?.totalDocs) || totalPages.value * itemsPerPage.value,
)
</script>
