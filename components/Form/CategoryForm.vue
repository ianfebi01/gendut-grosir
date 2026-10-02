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
      <section class="form-section">
        <div>
          <h2 class="section-title">Informasi Kategori</h2>
          <p class="section-desc">
            Nama kategori dipakai untuk mengelompokkan produk di katalog.
          </p>
        </div>
        <div class="max-w-md">
          <UFormField
            label="Nama"
            required
            :error="(touched && nameError) || undefined"
          >
            <UInput
              v-model="name"
              variant="outline"
              placeholder="Contoh: Sembako"
              icon="i-lucide-tag"
              class="w-full"
              autofocus
              @blur="touched = true"
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
        to="/library/category"
        >Batal</UButton
      >
      <UButton
        type="submit"
        color="primary"
        size="lg"
        icon="i-lucide-check"
        :loading="saving"
        :disabled="!!nameError"
        >{{ isEdit ? 'Simpan Perubahan' : 'Simpan Kategori' }}</UButton
      >
    </div>
  </form>
</template>

<script setup lang="ts">
import { useCategoryMutations } from '@/composables/queries/useCategories'

defineOptions({ name: 'CategoryForm' })

// Pass `category` to edit; omit it to create
const props = defineProps<{ category?: any }>()

const toast = useToast()
const isEdit = computed(() => !!props.category)

const name = ref('')
const touched = ref(false)

watch(
  () => props.category,
  (item) => {
    if (item) name.value = item.name ?? ''
  },
  { immediate: true },
)

const { createCategory, updateCategory } = useCategoryMutations()

const saving = computed(
  () => createCategory.isPending.value || updateCategory.isPending.value,
)
const mutationError = computed(() => {
  const e: any = createCategory.error.value ?? updateCategory.error.value
  return e?.data?.message ?? e?.message ?? ''
})
const nameError = computed(() => (!name.value.trim() ? 'Nama wajib diisi' : ''))

async function handleSave() {
  touched.value = true
  if (nameError.value) return
  try {
    if (isEdit.value) {
      await updateCategory.mutateAsync({
        id: props.category._id,
        name: name.value,
      })
      toast.add({ title: 'Kategori diperbarui', color: 'success' })
    } else {
      await createCategory.mutateAsync(name.value)
      toast.add({ title: 'Kategori ditambahkan', color: 'success' })
    }
    await navigateTo('/library/category')
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
