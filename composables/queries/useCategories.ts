import { useMutation, useQueryClient } from '@tanstack/vue-query'
import {
  deleteCategory as deleteCategoryRequest,
  getGetCategoryQueryKey,
  postCategory,
  updateCategory as updateCategoryRequest,
  useGetCategory,
} from '~/api/generated/categories/categories'
import type {
  GetCategory200,
  GetCategory200DataItem,
  GetCategoryParams,
} from '~/api/generated/gendutGrosirAPI.schemas'

export function useCategories(params: MaybeRefOrGetter<GetCategoryParams>) {
  return useGetCategory(params, {
    query: {
      select: (result) => ({
        items: result?.data ?? [],
        paginator: result?.paginator ?? {},
      }),
    },
  })
}

// The API has no GET /category/{id}, so resolve the category from the list.
export function useCategoryDetail(id: MaybeRefOrGetter<string | undefined>) {
  const qc = useQueryClient()
  const findIn = (items?: GetCategory200DataItem[]) =>
    items?.find((c) => c?._id === toValue(id))

  return useGetCategory(
    { limit: 1000 },
    {
      query: {
        select: (result) => findIn(result?.data),
        // Show the row from an already-loaded list while the request runs
        placeholderData: () =>
          ({
            data: qc
              .getQueriesData<GetCategory200>({
                queryKey: getGetCategoryQueryKey(),
              })
              .flatMap(([, d]) => d?.data ?? []),
          }) as GetCategory200,
        enabled: () => !!toValue(id),
      },
    },
  )
}

export function useCategoryMutations() {
  const qc = useQueryClient()
  const invalidate = () =>
    qc.invalidateQueries({ queryKey: getGetCategoryQueryKey() })

  const createCategory = useMutation({
    mutationFn: async (name: string) => (await postCategory({ name }))?.data,
    onSuccess: invalidate,
  })

  const updateCategory = useMutation({
    mutationFn: async ({ id, name }: { id: string; name: string }) =>
      (await updateCategoryRequest(id, { name }))?.data,
    onSuccess: invalidate,
  })

  const deleteCategory = useMutation({
    mutationFn: (id: string) => deleteCategoryRequest(id),
    onSuccess: invalidate,
  })

  return { createCategory, updateCategory, deleteCategory }
}
