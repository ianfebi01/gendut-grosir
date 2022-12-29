import EasyAccess, { defaultMutations } from 'vuex-easy-access'

export const state = () => ({
  profile: {},
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
}
