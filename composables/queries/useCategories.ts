import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query'

async function fetchCategories(params: any) {
  const { api } = useApi()
  const result: any = await api('category', { params })
  return { items: result?.data ?? [], paginator: result?.paginator ?? {} }
}

export function useCategories(params: MaybeRefOrGetter<any>) {
  return useQuery({
    queryKey: ['categories', params],
    queryFn: () => fetchCategories(toValue(params)),
  })
}

export function useCategoryMutations() {
  const { api } = useApi()
  const qc = useQueryClient()
  const invalidate = () => qc.invalidateQueries({ queryKey: ['categories'] })

  const createCategory = useMutation({
    mutationFn: async (name: string) => {
      const result: any = await api('category', { method: 'POST', body: { name } })
      return result?.data
    },
    onSuccess: invalidate,
  })

  const updateCategory = useMutation({
    mutationFn: async ({ id, name }: { id: string; name: string }) => {
      const result: any = await api(`category/${id}`, {
        method: 'PUT',
        body: { name },
      })
      return result?.data
    },
    onSuccess: invalidate,
  })

  const deleteCategory = useMutation({
    mutationFn: async (id: string) => api(`category/${id}`, { method: 'DELETE' }),
    onSuccess: invalidate,
  })

  return { createCategory, updateCategory, deleteCategory }
}
