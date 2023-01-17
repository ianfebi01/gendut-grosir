import EasyAccess, { defaultMutations } from 'vuex-easy-access'

export const state = () => ({
  profile: {},
  user: [],
  paginator: {},
  errorMessage: '',
})

export const mutations = { ...defaultMutations(state()) }

export const plugins = [EasyAccess()]

export const actions = {
  getMe({ dispatch }) {
    return this.$axios
      .get(`api/me`)
      .then((res) => {
        dispatch('set/profile', res.data)
        return true
      })
      .catch((err) => {
        console.log(err)
        dispatch('set/errorMessage', err)
        return false
      })
  },
  getAllUser({ dispatch }, params) {
    return this.$axios
      .get(`api/getAllUser`, {
        params,
      })
      .then((res) => {
        dispatch('set/user', res.data?.data?.data)
        dispatch('set/paginator', res?.data?.data?.paginator)
        return true
      })
      .catch((err) => {
        console.log(err)
        dispatch('set/errorMessage', err)
        return false
      })
  },
  register({ dispatch }, body) {
    return this.$axios
      .post(`api/register`, {
        ...body,
      })
      .then((res) => {
        dispatch('set/profile', res.data)
        return true
      })
      .catch((err) => {
        console.log(err)
        dispatch('set/errorMessage', err)
        return false
      })
  },
  login({ dispatch }, body) {
    return this.$axios
      .post(`api/login`, {
        ...body,
      })
      .then((res) => {
        dispatch('set/profile', res.data?.data)
        this.$cookiz.set('access_token', res.data?.data?.accessToken)

        return true
      })
      .catch((err) => {
        console.log(err)
        dispatch('set/errorMessage', err)
        return false
      })
  },
  deleteUser({ dispatch, state }, id) {
    return this.$axios
      .delete(`api/deleteUser/${id}`)
      .then(() => {
        const tmp = JSON.parse(JSON.stringify(state.user))
        const tmp2 = tmp.filter((item) => item._id != id)
        dispatch('set/user', tmp2)
        return true
      })
      .catch((err) => {
        console.log(err)
        dispatch('set/errorMessage', err)
        return false
      })
  },
}
