import { defineStore } from 'pinia'
import { useProductStore } from './product'

export const useOrderStore = defineStore('order', {
  state: () => ({
    cart: [] as any[],
    modalCart: false,
    errorMessage: '' as any,
    detailOrder: {} as Record<string, any>,
    order: [] as any[],
    paginator: {} as Record<string, any>,
    invoice: '',
  }),
  actions: {
    setCart(cart: any[]) {
      this.cart = cart
    },
    setModalCart(value: boolean) {
      this.modalCart = value
    },
    addCart(payload: any) {
      const tmp = JSON.parse(JSON.stringify(this.cart))
      const index = tmp.findIndex((item: any) => item._id === payload._id)
      const productStore = useProductStore()
      const product = JSON.parse(JSON.stringify(productStore.product))
      const productIndex = product.findIndex((item: any) => item._id === payload._id)
      if (index != -1) {
        if (product[productIndex].stock > tmp[index].qty) {
          tmp[index].qty = tmp[index].qty + 1
          this.cart = tmp
        } else {
          this.errorMessage = `Tidak bisa menambahkan lebih dari ${product[productIndex].stock} ${product[productIndex].name}`
        }
      } else {
        this.cart.push(payload)
      }
    },
    plus(id: string) {
      const tmp = JSON.parse(JSON.stringify(this.cart))
      const index = tmp.findIndex((item: any) => item._id === id)
      const productStore = useProductStore()
      const product = JSON.parse(JSON.stringify(productStore.product))
      const productIndex = product.findIndex((item: any) => item._id === id)
      if (index != -1) {
        if (product[productIndex].stock > tmp[index].qty) {
          tmp[index].qty = tmp[index].qty + 1
          this.cart = tmp
        } else {
          this.errorMessage = `Tidak bisa menambahkan lebih dari ${product[productIndex].stock} ${product[productIndex].name}`
        }
      }
    },
    minus(id: string) {
      const tmp = JSON.parse(JSON.stringify(this.cart))
      const index = tmp.findIndex((item: any) => item._id === id)
      if (index != -1) {
        if (tmp[index].qty > 1) {
          tmp[index].qty = tmp[index].qty - 1
          this.cart = tmp
        } else if (tmp[index].qty === 1) {
          this.cart = tmp.filter((item: any) => item._id !== id)
        }
      }
    },
    delete(id: string) {
      const tmp = JSON.parse(JSON.stringify(this.cart))
      this.cart = tmp.filter((item: any) => item._id !== id)
    },
    async postOrder(body: any) {
      const { api } = useApi()
      try {
        const result: any = await api('order', { method: 'POST', body: { ...body } })
        this.detailOrder = result?.data
        return true
      } catch (err: any) {
        this.errorMessage = err?.data?.message ?? err?.message ?? err
        return false
      }
    },
    async changeStatusOrder(params: string) {
      const { api } = useApi()
      try {
        const result: any = await api(`changeStatusOrder/${params}`, { method: 'PUT' })
        const tmp = JSON.parse(JSON.stringify(this.order))
        const index = tmp.findIndex((item: any) => item._id === result?.data?._id)
        if (index != -1) {
          tmp[index] = result?.data
        }
        this.order = tmp
        return true
      } catch (err: any) {
        this.errorMessage = err?.data?.message ?? err?.message ?? err
        return false
      }
    },
    async cancelOrder(params: string) {
      const { api } = useApi()
      try {
        const result: any = await api(`cancelOrder/${params}`, { method: 'PUT' })
        const tmp = JSON.parse(JSON.stringify(this.order))
        const index = tmp.findIndex((item: any) => item._id === result?.data?._id)
        if (index != -1) {
          tmp[index] = result?.data
        }
        this.order = tmp
        return true
      } catch (err: any) {
        this.errorMessage = err?.data?.message ?? err?.message ?? err
        return false
      }
    },
    async getOrder(params: any) {
      const { api } = useApi()
      try {
        const result: any = await api('order', { params })
        this.order = result?.data?.data
        this.paginator = result?.data?.paginator
        return true
      } catch (err) {
        this.errorMessage = err
        return false
      }
    },
    async downloadInvoice(params: any) {
      const { api } = useApi()
      try {
        const response: any = await api('order/download', {
          params: { ...params },
        })
        // If backend returns binary, handle blob download
        if (response instanceof Blob) {
          const FILE = window.URL.createObjectURL(response)
          const docUrl = document.createElement('a')
          docUrl.href = FILE
          docUrl.setAttribute('download', 'invoice.pdf')
          document.body.appendChild(docUrl)
          docUrl.click()
        }
        return true
      } catch (err) {
        this.errorMessage = err
        return false
      }
    },
  },
})
