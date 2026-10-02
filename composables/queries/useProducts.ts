import {
  useMutation,
  useQueryClient,
  useInfiniteQuery,
} from '@tanstack/vue-query'
import { apiFetch } from '~/api/http'
import type {
  GetProductParams,
  PostProduct200,
  UpdateProduct200,
} from '~/api/generated/gendutGrosirAPI.schemas'
import {
  deleteProduct as deleteProductRequest,
  getGetProductQueryKey,
  getPostProductUrl,
  getProduct,
  getUpdateProductUrl,
  updateProductStockByBarcode,
  useGetProduct,
  useGetProductByBarcode,
  useGetProductById,
} from '~/api/generated/products/products'

export type ProductParams = GetProductParams

const toPage = (result: Awaited<ReturnType<typeof getProduct>>) => ({
  items: result?.data?.data ?? [],
  paginator: result?.data?.paginator ?? {},
})

export function useProducts(params: MaybeRefOrGetter<ProductParams>) {
  return useGetProduct(params, { query: { select: toPage } })
}

export function useInfiniteProducts(
  baseParams: MaybeRefOrGetter<Omit<ProductParams, 'page'>>,
) {
  return useInfiniteQuery({
    queryKey: [...getGetProductQueryKey(), 'infinite', baseParams],
    queryFn: async ({ pageParam, signal }) =>
      toPage(
        await getProduct(
          { ...toValue(baseParams), page: pageParam },
          { signal },
        ),
      ),
    getNextPageParam: (lastPage, allPages) =>
      lastPage.paginator?.hasNextPage ? allPages.length + 1 : undefined,
    initialPageParam: 1,
  })
}

export function useProductDetail(id: MaybeRefOrGetter<string | undefined>) {
  return useGetProductById(() => toValue(id) ?? '', {
    query: {
      select: (result) => result?.data,
      enabled: () => !!toValue(id),
    },
  })
}

export function useProductByBarcode(
  barcode: MaybeRefOrGetter<string | undefined>,
) {
  return useGetProductByBarcode(() => toValue(barcode) ?? '', {
    query: {
      select: (result) => result?.data,
      enabled: () => !!toValue(barcode),
    },
  })
}

export function useProductMutations() {
  const qc = useQueryClient()

  // ['product'] prefixes the list, infinite list and detail queries
  const invalidate = () =>
    qc.invalidateQueries({ queryKey: getGetProductQueryKey() })

  // The generated postProduct/updateProduct JSON-encode the body; product
  // saves are multipart (optional image), so send the FormData via apiFetch.
  const createProduct = useMutation({
    mutationFn: async (formData: FormData) =>
      (
        await apiFetch<PostProduct200>(getPostProductUrl(), {
          method: 'POST',
          body: formData,
        })
      )?.data,
    onSuccess: invalidate,
  })

  const updateProduct = useMutation({
    mutationFn: async (formData: FormData) =>
      (
        await apiFetch<UpdateProduct200>(
          getUpdateProductUrl(String(formData.get('_id'))),
          { method: 'PUT', body: formData },
        )
      )?.data,
    onSuccess: invalidate,
  })

  const deleteProduct = useMutation({
    mutationFn: (id: string) => deleteProductRequest(id),
    onSuccess: invalidate,
  })

  const addStockByBarcode = useMutation({
    mutationFn: async (barcode: string) =>
      (await updateProductStockByBarcode(barcode))?.data,
    onSuccess: invalidate,
  })

  return { createProduct, updateProduct, deleteProduct, addStockByBarcode }
}
