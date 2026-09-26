import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    profile: {} as Record<string, any>,
    user: [] as any[],
    userDetail: {} as Record<string, any>,
    paginator: {} as Record<string, any>,
    errorMessage: '' as any,
    selectedUser: {} as Record<string, any>,
  }),
  actions: {
    setProfile(profile: Record<string, any>) {
      this.profile = profile
    },
    clearProfile() {
      this.profile = {}
    },
    async getMe() {
      const { api } = useApi()
      try {
        const result: any = await api('me')
        this.profile = result?._doc ?? result?.data ?? result
        return true
      } catch (err: any) {
        // Store a serializable message only: raw error objects break
        // SSR payload serialization (devalue) since pinia state is serialized.
        this.errorMessage = err?.data?.message ?? err?.message ?? err
        return false
      }
    },
    async getUserbyId(id: string) {
      const { api } = useApi()
      try {
        const result: any = await api(`getUserById/${id}`)
        this.userDetail = result
        return true
      } catch (err) {
        this.errorMessage = err
        return false
      }
    },
    async editUser(body: any) {
      const { api } = useApi()
      try {
        const result: any = await api(`editUser/${body.id}`, {
          method: 'PUT',
          body: { ...body },
        })
        const tmp = JSON.parse(JSON.stringify(this.user))
        const index = tmp.findIndex((item: any) => item._id === body.id)
        if (index != -1) {
          tmp[index] = result
          this.user = tmp
          this.userDetail = {}
        }
        return true
      } catch (err) {
        this.errorMessage = err
        return false
      }
    },
    async getAllUser(params: any) {
      const { api } = useApi()
      try {
        const result: any = await api('getAllUser', { params })
        this.user = result?.data?.data
        this.paginator = result?.data?.paginator
        return true
      } catch (err) {
        this.errorMessage = err
        return false
      }
    },
    async getAllUser2(params: any) {
      const { api } = useApi()
      try {
        const result: any = await api('getAllUser', { params })
        const tmp = result?.data?.data
        tmp.forEach((item: any) => {
          this.user.push(item)
        })
        this.paginator = result?.data?.paginator
        return true
      } catch (err) {
        this.errorMessage = err
        return false
      }
    },
    async register(body: any) {
      const { api } = useApi()
      try {
        const result: any = await api('register', {
          method: 'POST',
          body: { ...body },
        })
        this.profile = result
        return true
      } catch (err) {
        this.errorMessage = err
        return false
      }
    },
    async addUser(body: any) {
      const { api } = useApi()
      try {
        const result: any = await api('register', {
          method: 'POST',
          body: { ...body },
        })
        this.user.push(result?.data)
        return true
      } catch (err: any) {
        this.errorMessage = err?.data?.message ?? err?.message ?? err
        return false
      }
    },
    async login(body: any) {
      const { api } = useApi()
      try {
        const result: any = await api('login', {
          method: 'POST',
          body: { ...body },
        })
        this.profile = result?.data
        const token = useCookie('access_token')
        token.value = result?.data?.accessToken
        const appStore = useAppStore()
        appStore.setAccessToken(result?.data?.accessToken || '')
        return true
      } catch (err: any) {
        this.errorMessage = err?.data?.message ?? err?.message ?? err
        return false
      }
    },
    async deleteUser(id: string) {
      const { api } = useApi()
      try {
        await api(`deleteUser/${id}`, { method: 'DELETE' })
        const tmp = JSON.parse(JSON.stringify(this.user))
        this.user = tmp.filter((item: any) => item._id != id)
        return true
      } catch (err) {
        this.errorMessage = err
        return false
      }
    },
  },
})
