import { defineStore } from 'pinia'

export const useAnalyticStore = defineStore('analytic', {
  state: () => ({
    analytic: [] as any[],
    errorMessage: '' as any,
  }),
  actions: {
    async getAnalytic(params: any) {
      const { api } = useApi()
      try {
        const result: any = await api('analytic', { params })
        this.analytic = result?.data
        return true
      } catch (err) {
        console.log(err)
        this.errorMessage = err
        return false
      }
    },
  },
})
