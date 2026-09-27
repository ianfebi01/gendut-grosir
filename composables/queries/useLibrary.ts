import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query'

export function useAnalytics(params: MaybeRefOrGetter<any>) {
  const { api } = useApi()
  return useQuery({
    queryKey: ['analytics', params],
    queryFn: async () => {
      const result: any = await api('analytic', { params: toValue(params) })
      return result?.data ?? []
    },
  })
}

export function useRoles(params: MaybeRefOrGetter<any> = {}) {
  const { api } = useApi()
  return useQuery({
    queryKey: ['roles', params],
    queryFn: async () => {
      const result: any = await api('getRole', { params: toValue(params) })
      return result?.data ?? []
    },
  })
}

export function useRoleMutations() {
  const { api } = useApi()
  const qc = useQueryClient()
  const updateRole = useMutation({
    mutationFn: async ({ id, allows }: { id: string; allows: any }) => {
      const result: any = await api(`updateRole/${id}`, {
        method: 'PUT',
        body: { allows },
      })
      return result?.data
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['roles'] }),
  })
  return { updateRole }
}

export function useStockOpnames(params: MaybeRefOrGetter<any>) {
  const { api } = useApi()
  return useQuery({
    queryKey: ['stockOpnames', params],
    queryFn: async () => {
      const result: any = await api('stockOpname', { params: toValue(params) })
      return {
        items: result?.data?.data ?? [],
        paginator: result?.data?.paginator ?? {},
      }
    },
  })
}

export function useStockOpnameMutations() {
  const { api } = useApi()
  const qc = useQueryClient()
  const invalidate = () => {
    qc.invalidateQueries({ queryKey: ['stockOpnames'] })
    qc.invalidateQueries({ queryKey: ['products'] })
  }
  const createStockOpname = useMutation({
    mutationFn: async (payload: any) => {
      const result: any = await api('stockOpname', {
        method: 'POST',
        body: { ...payload },
      })
      return result?.data
    },
    onSuccess: invalidate,
  })
  const applyStockOpname = useMutation({
    mutationFn: async (id: string) => {
      const result: any = await api(`stockOpname/${id}`, { method: 'PUT' })
      return result?.data
    },
    onSuccess: invalidate,
  })
  return { createStockOpname, applyStockOpname }
}

export function useUploadImageMutations() {
  const { api } = useApi()
  const uploadImages = useMutation({
    mutationFn: async (formData: FormData) => {
      const result: any = await api('uploadImages', { method: 'POST', body: formData })
      return result
    },
  })
  const deleteImage = useMutation({
    mutationFn: async (publicId: string) =>
      api('deleteImage', { method: 'POST', body: { publicId } }),
  })
  return { uploadImages, deleteImage }
}
