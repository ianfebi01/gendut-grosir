import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/vue-query'

export interface ProductParams {
  q?: string
  category?: string
  page?: number
  limit?: number
  [key: string]: any
}

async function fetchProducts(params: ProductParams) {
  const { api } = useApi()
  const result: any = await api('product', { params })
  return {
    items: result?.data?.data ?? [],
    paginator: result?.data?.paginator ?? {},
  }
}

export function useProducts(params: MaybeRefOrGetter<ProductParams>) {
  return useQuery({
    queryKey: ['products', params],
    queryFn: () => fetchProducts(toValue(params)),
  })
}

export function useInfiniteProducts(baseParams: MaybeRefOrGetter<Omit<ProductParams, 'page'>>) {
  return useInfiniteQuery({
    queryKey: ['products', 'infinite', baseParams],
    queryFn: ({ pageParam = 1 }) =>
      fetchProducts({ ...toValue(baseParams), page: pageParam as number }),
    getNextPageParam: (lastPage, allPages) =>
      lastPage.paginator?.hasNextPage ? allPages.length + 1 : undefined,
    initialPageParam: 1,
  })
}

export function useProductDetail(id: MaybeRefOrGetter<string | undefined>) {
  const { api } = useApi()
  return useQuery({
    queryKey: ['product', id],
    queryFn: async () => {
      const result: any = await api(`product/${toValue(id)}`)
      return result?.data
    },
    enabled: () => !!toValue(id),
  })
}

export function useProductByBarcode(barcode: MaybeRefOrGetter<string | undefined>) {
  const { api } = useApi()
  return useQuery({
    queryKey: ['product-barcode', barcode],
    queryFn: async () => {
      const result: any = await api(`productByBarcode/${toValue(barcode)}`)
      return result?.data
    },
    enabled: () => !!toValue(barcode),
  })
}

export function useProductMutations() {
  const { api } = useApi()
  const qc = useQueryClient()

  const invalidate = () => {
    qc.invalidateQueries({ queryKey: ['products'] })
    qc.invalidateQueries({ queryKey: ['product'] })
  }

  const createProduct = useMutation({
    mutationFn: async (formData: FormData) => {
      const result: any = await api('product', { method: 'POST', body: formData })
      return result?.data
    },
    onSuccess: invalidate,
  })

  const updateProduct = useMutation({
    mutationFn: async (formData: FormData) => {
      const result: any = await api(`product/${formData.get('_id')}`, {
        method: 'PUT',
        body: formData,
      })
      return result?.data
    },
    onSuccess: invalidate,
  })

  const deleteProduct = useMutation({
    mutationFn: async (id: string) => api(`product/${id}`, { method: 'DELETE' }),
    onSuccess: invalidate,
  })

  const addStockByBarcode = useMutation({
    mutationFn: async (id: string) => {
      const result: any = await api(`product/stockbarcode/${id}`, { method: 'PUT' })
      return result?.data
    },
    onSuccess: invalidate,
  })

  return { createProduct, updateProduct, deleteProduct, addStockByBarcode }
}
