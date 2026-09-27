import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query'

async function fetchOrders(params: any) {
  const { api } = useApi()
  const result: any = await api('order', { params })
  return {
    items: result?.data?.data ?? [],
    paginator: result?.data?.paginator ?? {},
  }
}

export function useOrders(params: MaybeRefOrGetter<any>) {
  return useQuery({
    queryKey: ['orders', params],
    queryFn: () => fetchOrders(toValue(params)),
  })
}

export function useOrderMutations() {
  const { api } = useApi()
  const qc = useQueryClient()

  const createOrder = useMutation({
    mutationFn: async (body: any) => {
      const result: any = await api('order', { method: 'POST', body: { ...body } })
      return result?.data
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['orders'] })
      qc.invalidateQueries({ queryKey: ['products'] })
    },
  })

  const changeStatus = useMutation({
    mutationFn: async (id: string) => {
      const result: any = await api(`changeStatusOrder/${id}`, { method: 'PUT' })
      return result?.data
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['orders'] }),
  })

  const cancelOrder = useMutation({
    mutationFn: async (id: string) => {
      const result: any = await api(`cancelOrder/${id}`, { method: 'PUT' })
      return result?.data
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['orders'] }),
  })

  const downloadInvoice = useMutation({
    mutationFn: async (params: any) => {
      const response: any = await api('order/download', { params: { ...params } })
      if (response instanceof Blob) {
        const FILE = window.URL.createObjectURL(response)
        const docUrl = document.createElement('a')
        docUrl.href = FILE
        docUrl.setAttribute('download', 'invoice.pdf')
        document.body.appendChild(docUrl)
        docUrl.click()
      }
      return true
    },
  })

  return { createOrder, changeStatus, cancelOrder, downloadInvoice }
}
