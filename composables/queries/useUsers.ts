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
  getUpdateMeUrl,
  login as loginRequest,
  register as registerRequest,
  useGetAllUser,
  useGetMe,
  useGetUserById,
} from '~/api/generated/auth-users/auth-users'
import { apiFetch } from '~/api/http'
import type {
  GetAllUserParams,
  UpdateMe200,
  UpdateMeInput,
  UserWithRole,
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
      select: (result) => (result?._doc ?? result) as UserWithRole,
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

export type UpdateMeVariables = UpdateMeInput & { image?: File | null }

export function useUpdateMe() {
  const qc = useQueryClient()
  return useMutation({
    // The generated updateMe JSON-encodes the body; send multipart so an
    // optional image upload travels with the other fields.
    mutationFn: async ({ image, ...fields }: UpdateMeVariables) => {
      const body = new FormData()
      for (const [key, value] of Object.entries(fields)) {
        if (value !== undefined && value !== '') body.append(key, value)
      }
      if (image) body.append('image', image)
      const result = await apiFetch<UpdateMe200>(getUpdateMeUrl(), {
        method: 'PUT',
        body,
      })
      return result?.data
    },
    onSuccess: (data) => {
      if (!data) return
      const userStore = useUserStore()
      userStore.setProfile({ ...userStore.profile, ...data })
      qc.invalidateQueries({ queryKey: getGetMeQueryKey() })
    },
  })
}
