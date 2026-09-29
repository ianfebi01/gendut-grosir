import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { useGetAnalytic } from '~/api/generated/analytics/analytics'
import type {
  GetAnalyticParams,
  GetRoleParams,
  GetStockOpnameParams,
  StockOpnameInput,
  UploadImagesBody,
} from '~/api/generated/gendutGrosirAPI.schemas'
import { getGetProductQueryKey } from '~/api/generated/products/products'
import {
  getGetRoleQueryKey,
  updateRole as updateRoleRequest,
  useGetRole,
} from '~/api/generated/roles/roles'
import {
  applyStockOpname as applyStockOpnameRequest,
  getGetStockOpnameQueryKey,
  postStockOpname,
  useGetStockOpname,
} from '~/api/generated/stock-opname/stock-opname'
import {
  deleteImage as deleteImageRequest,
  uploadImages as uploadImagesRequest,
} from '~/api/generated/uploads/uploads'

export function useAnalytics(params: MaybeRefOrGetter<GetAnalyticParams>) {
  return useGetAnalytic(params, {
    query: { select: (result) => result?.data ?? [] },
  })
}

export function useRoles(params: MaybeRefOrGetter<GetRoleParams> = {}) {
  return useGetRole(params, {
    query: { select: (result) => result?.data ?? [] },
  })
}

export function useRoleMutations() {
  const qc = useQueryClient()
  const updateRole = useMutation({
    mutationFn: async ({ id, allows }: { id: string; allows: string[] }) =>
      (await updateRoleRequest(id, { allows }))?.data,
    onSuccess: () => qc.invalidateQueries({ queryKey: getGetRoleQueryKey() }),
  })
  return { updateRole }
}

export function useStockOpnames(
  params: MaybeRefOrGetter<GetStockOpnameParams>,
) {
  return useGetStockOpname(params, {
    query: {
      select: (result) => ({
        items: result?.data?.data ?? [],
        paginator: result?.data?.paginator ?? {},
      }),
    },
  })
}

export function useStockOpnameMutations() {
  const qc = useQueryClient()
  const invalidate = () => {
    qc.invalidateQueries({ queryKey: getGetStockOpnameQueryKey() })
    qc.invalidateQueries({ queryKey: getGetProductQueryKey() })
  }
  const createStockOpname = useMutation({
    mutationFn: async (payload: StockOpnameInput) =>
      (await postStockOpname(payload))?.data,
    onSuccess: invalidate,
  })
  const applyStockOpname = useMutation({
    mutationFn: async (id: string) => (await applyStockOpnameRequest(id))?.data,
    onSuccess: invalidate,
  })
  return { createStockOpname, applyStockOpname }
}

export function useUploadImageMutations() {
  const uploadImages = useMutation({
    mutationFn: (body: UploadImagesBody) => uploadImagesRequest(body),
  })
  const deleteImage = useMutation({
    mutationFn: (publicId: string) => deleteImageRequest({ publicId }),
  })
  return { uploadImages, deleteImage }
}
