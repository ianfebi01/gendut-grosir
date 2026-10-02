import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { getGetAnalyticQueryKey } from '~/api/generated/analytics/analytics'
import type {
  GetOrderParams,
  OrderInput,
} from '~/api/generated/gendutGrosirAPI.schemas'
import {
  cancelOrder as cancelOrderRequest,
  changeStatusOrder,
  getGetOrderQueryKey,
  postOrder,
  useGetOrder,
} from '~/api/generated/orders/orders'
import { getGetProductQueryKey } from '~/api/generated/products/products'

export function useOrders(params: MaybeRefOrGetter<GetOrderParams>) {
  return useGetOrder(params, {
    query: {
      select: (result) => ({
        items: result?.data?.data ?? [],
        paginator: result?.data?.paginator ?? {},
      }),
    },
  })
}

export function useOrderMutations() {
  const qc = useQueryClient()
  // The dashboard aggregates orders, so any order change refreshes it too
  const invalidateOrders = () => {
    qc.invalidateQueries({ queryKey: getGetOrderQueryKey() })
    qc.invalidateQueries({ queryKey: getGetAnalyticQueryKey() })
  }

  const createOrder = useMutation({
    mutationFn: async (body: OrderInput) => (await postOrder(body))?.data,
    onSuccess: () => {
      invalidateOrders()
      qc.invalidateQueries({ queryKey: getGetProductQueryKey() })
    },
  })

  const changeStatus = useMutation({
    mutationFn: async (id: string) => (await changeStatusOrder(id))?.data,
    onSuccess: invalidateOrders,
  })

  const cancelOrder = useMutation({
    mutationFn: async (id: string) => (await cancelOrderRequest(id))?.data,
    onSuccess: invalidateOrders,
  })

  return { createOrder, changeStatus, cancelOrder }
}
