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
  getRoles({ dispatch }) {
    return this.$axios
      .get(`api/getRole`)
      .then((res) => {
        dispatch('set/roles', res.data?.data)
      })
      .catch((err) => {
        dispatch('set/errorMessage', err)
        return false
      })
  },
}
