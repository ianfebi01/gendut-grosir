import { defineStore } from 'pinia'

export const useStockOpnameStore = defineStore('stockOpname', {
  state: () => ({
    stockOpname: [] as any[],
    errorMessage: '' as any,
    paginator: {} as any,
  }),
  actions: {
    async postStockOpname(payload: any) {
      const { api } = useApi()
      try {
        const result: any = await api('stockOpname', {
          method: 'POST',
          body: { ...payload },
        })
        this.stockOpname.push(result?.data)
        return true
      } catch (err) {
        console.log(err)
        this.errorMessage = err
        return false
      }
    },
    async getStockOpname(params: any) {
      const { api } = useApi()
      try {
        const result: any = await api('stockOpname', { params })
        this.stockOpname = result?.data?.data
        this.paginator = result?.data?.paginator
        return true
      } catch (err) {
        console.log(err)
        this.errorMessage = err
        return false
      }
    },
    async applyStockOpname(id: string) {
      const { api } = useApi()
      try {
        const result: any = await api(`stockOpname/${id}`, {
          method: 'PUT',
        })
        const tmp = JSON.parse(JSON.stringify(this.stockOpname))
        const index = tmp.findIndex(
          (item: any) => item._id === result?.data?._id
        )
        if (index != -1) {
          tmp[index].apply = true
        }
        this.stockOpname = tmp
        return true
      } catch (err) {
        console.log(err)
        this.errorMessage = err
        return false
      }
    },
  },
})
