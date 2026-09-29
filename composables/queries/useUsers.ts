import {
  useMutation,
  useQueryClient,
  useInfiniteQuery,
} from '@tanstack/vue-query'
import {
  deleteUser as deleteUserRequest,
  editUser,
  getAllUser,
  getGetAllUserQueryKey,
  getGetMeQueryKey,
  login as loginRequest,
  register as registerRequest,
  useGetAllUser,
  useGetMe,
  useGetUserById,
} from '~/api/generated/auth-users/auth-users'
import type {
  GetAllUserParams,
  LoginBody,
  RegisterBody,
  UserInput,
} from '~/api/generated/gendutGrosirAPI.schemas'

const toPage = (result: Awaited<ReturnType<typeof getAllUser>>) => ({
  items: result?.data?.data ?? [],
  paginator: result?.data?.paginator ?? {},
})

export function useUsers(params: MaybeRefOrGetter<GetAllUserParams>) {
  return useGetAllUser(params, { query: { select: toPage } })
}

export function useInfiniteUsers(
  baseParams: MaybeRefOrGetter<Omit<GetAllUserParams, 'page'>>,
) {
  return useInfiniteQuery({
    queryKey: [...getGetAllUserQueryKey(), 'infinite', baseParams],
    queryFn: async ({ pageParam, signal }) =>
      toPage(
        await getAllUser(
          { ...toValue(baseParams), page: pageParam },
          { signal },
        ),
      ),
    getNextPageParam: (lastPage, allPages) =>
      lastPage.paginator?.nextPage ? allPages.length + 1 : undefined,
    initialPageParam: 1,
  })
}

export function useMe(enabled: MaybeRefOrGetter<boolean> = true) {
  return useGetMe({
    query: {
      select: (result) => result?._doc ?? result,
      enabled: () => toValue(enabled),
      staleTime: 5 * 60_000,
    },
  })
}

export function useUserDetail(id: MaybeRefOrGetter<string | undefined>) {
  return useGetUserById(() => toValue(id) ?? '', {
    query: { enabled: () => !!toValue(id) },
  })
}

export function useAuthMutations() {
  const qc = useQueryClient()

  const login = useMutation({
    mutationFn: async (body: LoginBody) => (await loginRequest(body))?.data,
    onSuccess: (data) => {
      const token = useCookie('access_token')
      token.value = data?.accessToken
      const appStore = useAppStore()
      appStore.setAccessToken(data?.accessToken || '')
      const userStore = useUserStore()
      userStore.setProfile(data ?? {})
      qc.setQueryData(getGetMeQueryKey(), data)
    },
  })

  const register = useMutation({
    mutationFn: (body: RegisterBody) => registerRequest(body),
    onSuccess: (data) => {
      const userStore = useUserStore()
      userStore.setProfile(data ?? {})
    },
  })

  return { login, register }
}

export function useUserMutations() {
  const qc = useQueryClient()
  const invalidate = () =>
    qc.invalidateQueries({ queryKey: getGetAllUserQueryKey() })

  const createUser = useMutation({
    mutationFn: async (body: RegisterBody) =>
      (await registerRequest(body))?.data,
    onSuccess: invalidate,
  })

  const updateUser = useMutation({
    mutationFn: (body: UserInput & { id: string; password?: string }) =>
      editUser(body.id, body),
    onSuccess: invalidate,
  })

  const deleteUser = useMutation({
    mutationFn: (id: string) => deleteUserRequest(id),
    onSuccess: invalidate,
  })

  return { createUser, updateUser, deleteUser }
}
