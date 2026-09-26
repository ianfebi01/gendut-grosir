import { defineStore } from 'pinia'

export const useCategoryStore = defineStore('category', {
  state: () => ({
    category: [] as any[],
    paginator: {} as any,
    errorMessage: '' as any,
  }),
  actions: {
    async getCategory(params: any) {
      const { api } = useApi()
      try {
        const result: any = await api('category', { params })
        this.category = result?.data
        this.paginator = result?.paginator
        return true
      } catch (err) {
        console.log(err)
        this.errorMessage = err
        return false
      }
    },
    async postCategory(body: string) {
      const { api } = useApi()
      try {
        const result: any = await api('category', {
          method: 'POST',
          body: { name: body },
        })
        const tmp = result?.data
        tmp.totalProducts = 0
        this.category.push(result?.data)
        return true
      } catch (err: any) {
        console.log(err)
        this.errorMessage = err?.data?.message ?? err?.message ?? err
        return false
      }
    },
    async editCategory(params: any) {
      const { api } = useApi()
      try {
        const result: any = await api(`category/${params.id}`, {
          method: 'PUT',
          body: { name: params?.name },
        })
        const tmp = result?.data
        tmp.totalProducts = 0
        const tmp2 = JSON.parse(JSON.stringify(this.category))
        const index = tmp2.findIndex((item: any) => item._id === params.id)
        if (index != -1) {
          tmp2[index] = tmp
          this.category = tmp2
        }
        return true
      } catch (err: any) {
        console.log(err)
        this.errorMessage = err?.data?.message ?? err?.message ?? err
        return false
      }
    },
    async deleteCategory(id: string) {
      const { api } = useApi()
      try {
        await api(`category/${id}`, { method: 'DELETE' })
        const tmp = JSON.parse(JSON.stringify(this.category))
        const index = tmp.findIndex((item: any) => item._id === id)
        if (index != -1) {
          tmp.splice(index, 1)
          this.category = tmp
        }
        return true
      } catch (err: any) {
        console.log(err)
        this.errorMessage = err?.data?.message ?? err?.message ?? err
        return false
      }
    },
  },
})
