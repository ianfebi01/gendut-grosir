import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { getGetAnalyticQueryKey } from '~/services/generated/analytics/analytics'
import type {
  GetOrderParams,
  OrderInput,
} from '~/services/generated/gendutGrosirAPI.schemas'
import {
  cancelOrder as cancelOrderRequest,
  changeStatusOrder,
  getGetOrderQueryKey,
  postOrder,
  useGetOrder,
} from '~/services/generated/orders/orders'
import { getGetProductQueryKey } from '~/services/generated/products/products'

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
