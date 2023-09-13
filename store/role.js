import EasyAccess, { defaultMutations } from 'vuex-easy-access'

export const state = () => ({
  roles: [],
  errorMessage: '',
})

export const mutations = {
  ...defaultMutations(state()),
}

export const plugins = [EasyAccess()]

export const actions = {
  getRoles({ dispatch }, params) {
    return this.$axios
      .get(`api/getRole`, {
        params,
      })
      .then((res) => {
        dispatch('set/roles', res.data?.data)
        return true
      })
      .catch((err) => {
        dispatch('set/errorMessage', err)
        return false
      })
  },
  updateRole({ dispatch }, params, body) {
    return this.$axios
      .put(`api/getRole`, {
        params,
        ...body,
      })
      .then((res) => {
        // dispatch('set/roles', res.data?.data)
        console.log(res.data.data)
        return true
      })
      .catch((err) => {
        dispatch('set/errorMessage', err)
        return false
      })
  },
}
