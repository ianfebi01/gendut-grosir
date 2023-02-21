import EasyAccess, { defaultMutations } from 'vuex-easy-access'

export const state = () => ({
  profile: {},
  user: [],
  userDetail: {},
  paginator: {},
  errorMessage: '',
  selectedUser: {},
})

export const mutations = {
  ...defaultMutations(state()),
  profile(state, value) {
    state.profile = value
  },
  errorMessage(state, value) {
    state.errorMessage = value
  },
}

export const plugins = [EasyAccess()]

export const actions = {
  getMe({ commit }) {
    return this.$axios
      .get(`api/me`)
      .then((res) => {
        commit('profile', res.data)
        return true
      })
      .catch((err) => {
        console.log(err)
        commit('errorMessage', err)
        return false
      })
  },
  getUserbyId({ dispatch }, id) {
    return this.$axios
      .get(`api/getUserById/${id}`)
      .then((res) => {
        dispatch('set/userDetail', res.data)
        return true
      })
      .catch((err) => {
        console.log(err)
        dispatch('set/errorMessage', err)
        return false
      })
  },
  editUser({ dispatch, state }, body) {
    return this.$axios
      .put(`api/editUser/${body.id}`, {
        ...body,
      })
      .then((res) => {
        const tmp = JSON.parse(JSON.stringify(state.user))
        const index = tmp.findIndex((item) => item._id === body.id)
        if (index != -1) {
          tmp[index] = res.data
          dispatch('set/user', tmp)
          dispatch('set/userDetail', {})
        }
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
  getAllUser2({ dispatch }, params) {
    return this.$axios
      .get(`api/getAllUser`, {
        params,
      })
      .then((res) => {
        const tmp = res.data?.data?.data
        tmp.forEach((item) => {
          dispatch('set/user.push', item)
        })

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
  addUser({ dispatch }, body) {
    return this.$axios
      .post(`api/register`, {
        ...body,
      })
      .then((res) => {
        dispatch('set/user.push', res.data?.data)
        return true
      })
      .catch((err) => {
        console.log(err)
        dispatch('set/errorMessage', err?.response?.data?.message)
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
        dispatch('set/errorMessage', err?.response?.data?.message)
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
