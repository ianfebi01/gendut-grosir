import { defineStore } from 'pinia'

export const useRoleStore = defineStore('role', {
  state: () => ({
    roles: [] as any[],
    errorMessage: '' as any,
  }),
  actions: {
    async getRoles(params: any) {
      const { api } = useApi()
      try {
        const result: any = await api('getRole', { params })
        this.roles = result?.data
        return true
      } catch (err) {
        this.errorMessage = err
        return false
      }
    },
    async updateRole(params: any) {
      const { api } = useApi()
      try {
        const result: any = await api(`updateRole/${params.id}`, {
          method: 'PUT',
          body: { allows: params.allows },
        })
        const tmp = JSON.parse(JSON.stringify(this.roles))
        const index = tmp.findIndex(
          (item: any) => item._id === result?.data?._id
        )
        if (index !== -1) {
          tmp[index] = result?.data
          this.roles = tmp
        }
        return true
      } catch (err) {
        this.errorMessage = err
        return false
      }
    },
  },
})
