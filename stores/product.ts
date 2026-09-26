import { defineStore } from 'pinia'

export const useProductStore = defineStore('product', {
  state: () => ({
    product: [] as any[],
    productDetails: {} as any,
    errorMessage: '' as any,
    paginator: {} as any,
    uploadProgress: null as number | null,
  }),
  actions: {
    async getProduct(params: any) {
      const { api } = useApi()
      this.errorMessage = ''
      try {
        const result: any = await api('product', { params })
        this.product = result?.data?.data
        this.paginator = result?.data?.paginator
        return true
      } catch (err) {
        console.log(err)
        this.errorMessage = err
        return false
      }
    },
    async getProductIntersect(params: any) {
      const { api } = useApi()
      this.errorMessage = ''
      try {
        const result: any = await api('product', { params })
        const tmp = result?.data?.data
        tmp.forEach((item: any) => {
          this.product.push(item)
        })
        this.paginator = result?.data?.paginator
        return true
      } catch (err) {
        console.log(err)
        this.errorMessage = err
        return false
      }
    },
    async deleteProduct(id: string) {
      const { api } = useApi()
      this.errorMessage = ''
      try {
        await api(`product/${id}`, { method: 'DELETE' })
        const tmp = JSON.parse(JSON.stringify(this.product))
        const index = tmp.findIndex((item: any) => item._id === id)
        if (index != -1) {
          tmp.splice(index, 1)
          this.product = tmp
        }
        return true
      } catch (err) {
        console.log(err)
        this.errorMessage = err
        return false
      }
    },
    async addProduct(formData: FormData) {
      const { api } = useApi()
      this.errorMessage = ''
      // NOTE: $fetch has no onUploadProgress; progress resets to null on completion.
      try {
        const result: any = await api('product', {
          method: 'POST',
          body: formData,
        })
        this.product.push(result?.data)
        this.uploadProgress = null
        return true
      } catch (err) {
        console.log(err)
        this.errorMessage = err
        return false
      }
    },
    async editProduct(formData: FormData) {
      const { api } = useApi()
      this.errorMessage = ''
      // NOTE: $fetch has no onUploadProgress; progress resets to null on completion.
      try {
        const result: any = await api(`product/${formData.get('_id')}`, {
          method: 'PUT',
          body: formData,
        })
        const tmp = JSON.parse(JSON.stringify(this.product))
        const index = tmp.findIndex(
          (item: any) => item._id === formData.get('_id')
        )
        if (index != -1) {
          tmp[index] = {
            ...result?.data,
          }
        }
        this.product = tmp
        this.uploadProgress = null
        return true
      } catch (err) {
        console.log(err)
        this.errorMessage = err
        this.uploadProgress = null
        return false
      }
    },
    async addStockById(id: string) {
      const { api } = useApi()
      this.errorMessage = ''
      try {
        const result: any = await api(`product/stockbarcode/${id}`, {
          method: 'PUT',
        })
        const tmp = JSON.parse(JSON.stringify(this.product))
        const index = tmp.findIndex(
          (item: any) => item._id === result?.data?._id
        )
        if (index != -1) {
          tmp[index].stock = result?.data?.stock
        }
        this.product = tmp
        return result?.data?.name
      } catch (err: any) {
        console.log(err)
        this.errorMessage = err?.data?.message ?? err?.message ?? err
        return false
      }
    },
    async getProductById(id: string) {
      const { api } = useApi()
      this.errorMessage = ''
      try {
        const result: any = await api(`product/${id}`)
        this.productDetails = result?.data
        return true
      } catch (err) {
        console.log(err)
        this.errorMessage = err
        return false
      }
    },
    async getProductByBarcode(barcode: string) {
      const { api } = useApi()
      this.errorMessage = ''
      try {
        const result: any = await api(`productByBarcode/${barcode}`)
        this.productDetails = result?.data
        return true
      } catch (err: any) {
        console.log(err)
        this.errorMessage = err?.data?.message ?? err?.message ?? err
        return false
      }
    },
    async orderSuccess(payload: any[]) {
      const product = JSON.parse(JSON.stringify(this.product))
      await payload.forEach((item: any) => {
        const index = product.findIndex((i: any) => i._id == item.product._id)
        if (index != -1) {
          product[index].stock = item?.product?.stock
        }
      })
      this.product = product
    },
    onUploadProgress(progressEvent: any) {
      const { loaded, total } = progressEvent
      const percent = Math.floor((loaded * 100) / total)
      this.uploadProgress = percent
    },
  },
})
