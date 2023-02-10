import EasyAccess, { defaultMutations } from 'vuex-easy-access'

export const state = () => ({
  analytic: [],
  errorMessage: '',
})

export const mutations = { ...defaultMutations(state()) }

export const plugin = [EasyAccess()]

export const actions = {
  getAnalytic({ dispatch }, params) {
    return this.$axios
      .get('api/analytic', {
        params,
      })
      .then((res) => {
        dispatch('set/analytic', res?.data?.data)
        return true
      })
      .catch((err) => {
        console.log(err)
        dispatch('set/errorMessage', err)
        return false
      })
  },
}
