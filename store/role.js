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
  updateRole({ dispatch, state }, params) {
    return this.$axios
      .put(`api/updateRole/${params.id}`, {
        allows: params.allows,
      })
      .then((res) => {
        // dispatch('set/roles', res.data?.data)
        const tmp = JSON.parse(JSON.stringify(state.roles))
        const index = tmp.findIndex((item) => item._id === res.data?.data?._id)
        if (index !== -1) {
          tmp[index] = res.data?.data
          dispatch('set/roles', tmp)
        }
        return true
      })
      .catch((err) => {
        dispatch('set/errorMessage', err)
        return false
      })
  },
}
