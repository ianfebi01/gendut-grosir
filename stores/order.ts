import { defineStore } from 'pinia'

// UI-only store: cart state. Products/orders are fetched via Vue Query.
export const useOrderStore = defineStore('order', {
  state: () => ({
    cart: [] as any[],
    modalCart: false,
    cartError: '' as string,
    detailOrder: {} as Record<string, any>,
  }),
  getters: {
    cartCount: (state) => state.cart.reduce((sum: number, i: any) => sum + (i.qty || 0), 0),
    cartTotal: (state) =>
      state.cart.reduce((sum: number, i: any) => sum + (i.qty || 0) * (i.price || 0), 0),
  },
  actions: {
    setCart(cart: any[]) {
      this.cart = cart
    },
    clearCart() {
      this.cart = []
    },
    setModalCart(value: boolean) {
      this.modalCart = value
    },
    setDetailOrder(order: Record<string, any>) {
      this.detailOrder = order
    },
    clearCartError() {
      this.cartError = ''
    },
    addCart(payload: any, stock?: number) {
      const tmp = JSON.parse(JSON.stringify(this.cart))
      const index = tmp.findIndex((item: any) => item._id === payload._id)
      const maxStock = stock ?? payload.stock ?? Infinity
      if (index !== -1) {
        if (maxStock > tmp[index].qty) {
          tmp[index].qty = tmp[index].qty + 1
          this.cart = tmp
          this.cartError = ''
        } else {
          this.cartError = `Tidak bisa menambahkan lebih dari ${maxStock} ${payload.name ?? ''}`
        }
      } else {
        tmp.push(payload)
        this.cart = tmp
        this.cartError = ''
      }
    },
    plus(id: string, stock?: number) {
      const tmp = JSON.parse(JSON.stringify(this.cart))
      const index = tmp.findIndex((item: any) => item._id === id)
      if (index !== -1) {
        const maxStock = stock ?? tmp[index].stock ?? Infinity
        if (maxStock > tmp[index].qty) {
          tmp[index].qty = tmp[index].qty + 1
          this.cart = tmp
          this.cartError = ''
        } else {
          this.cartError = `Tidak bisa menambahkan lebih dari ${maxStock} ${tmp[index].name ?? ''}`
        }
      }
    },
    minus(id: string) {
      const tmp = JSON.parse(JSON.stringify(this.cart))
      const index = tmp.findIndex((item: any) => item._id === id)
      if (index !== -1) {
        if (tmp[index].qty > 1) {
          tmp[index].qty = tmp[index].qty - 1
          this.cart = tmp
        } else {
          this.cart = tmp.filter((item: any) => item._id !== id)
        }
      }
    },
    remove(id: string) {
      this.cart = this.cart.filter((item: any) => item._id !== id)
    },
    applyOrderSuccess(payload: any[]) {
      const product = JSON.parse(JSON.stringify(this.cart))
      void product
      void payload
    },
  },
})
