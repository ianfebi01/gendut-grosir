import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/vue-query'

async function fetchUsers(params: any) {
  const { api } = useApi()
  const result: any = await api('getAllUser', { params })
  return {
    items: result?.data?.data ?? [],
    paginator: result?.data?.paginator ?? {},
  }
}

export function useUsers(params: MaybeRefOrGetter<any>) {
  return useQuery({
    queryKey: ['users', params],
    queryFn: () => fetchUsers(toValue(params)),
  })
}

export function useInfiniteUsers(baseParams: MaybeRefOrGetter<any>) {
  return useInfiniteQuery({
    queryKey: ['users', 'infinite', baseParams],
    queryFn: ({ pageParam = 1 }) =>
      fetchUsers({ ...toValue(baseParams), page: pageParam as number }),
    getNextPageParam: (lastPage, allPages) =>
      lastPage.paginator?.nextPage ? allPages.length + 1 : undefined,
    initialPageParam: 1,
  })
}

export function useMe(enabled: MaybeRefOrGetter<boolean> = true) {
  const { api } = useApi()
  return useQuery({
    queryKey: ['me'],
    queryFn: async () => {
      const result: any = await api('me')
      return result?._doc ?? result?.data ?? result
    },
    enabled: () => toValue(enabled),
    staleTime: 5 * 60_000,
  })
}

export function useUserDetail(id: MaybeRefOrGetter<string | undefined>) {
  const { api } = useApi()
  return useQuery({
    queryKey: ['user', id],
    queryFn: async () => {
      const result: any = await api(`getUserById/${toValue(id)}`)
      return result
    },
    enabled: () => !!toValue(id),
  })
}

export function useAuthMutations() {
  const { api } = useApi()
  const qc = useQueryClient()

  const login = useMutation({
    mutationFn: async (body: any) => {
      const result: any = await api('login', { method: 'POST', body: { ...body } })
      return result?.data
    },
    onSuccess: (data: any) => {
      const token = useCookie('access_token')
      token.value = data?.accessToken
      const appStore = useAppStore()
      appStore.setAccessToken(data?.accessToken || '')
      const userStore = useUserStore()
      userStore.setProfile(data ?? {})
      qc.setQueryData(['me'], data)
    },
  })

  const register = useMutation({
    mutationFn: async (body: any) => {
      const result: any = await api('register', { method: 'POST', body: { ...body } })
      return result
    },
    onSuccess: (data: any) => {
      const userStore = useUserStore()
      userStore.setProfile(data ?? {})
    },
  })

  return { login, register }
}

export function useUserMutations() {
  const { api } = useApi()
  const qc = useQueryClient()
  const invalidate = () => qc.invalidateQueries({ queryKey: ['users'] })

  const createUser = useMutation({
    mutationFn: async (body: any) => {
      const result: any = await api('register', { method: 'POST', body: { ...body } })
      return result?.data
    },
    onSuccess: invalidate,
  })

  const updateUser = useMutation({
    mutationFn: async (body: any) => {
      const result: any = await api(`editUser/${body.id}`, {
        method: 'PUT',
        body: { ...body },
      })
      return result
    },
    onSuccess: invalidate,
  })

  const deleteUser = useMutation({
    mutationFn: async (id: string) => api(`deleteUser/${id}`, { method: 'DELETE' }),
    onSuccess: invalidate,
  })

  return { createUser, updateUser, deleteUser }
}
