import EasyAccess, { defaultMutations } from 'vuex-easy-access'

export const state = () => ({
  category: [],
  paginator: {},
  errorMessage: '',
})

export const mutations = { ...defaultMutations(state()) }

export const plugins = [EasyAccess()]

export const actions = {
  // Category
  getCategory({ dispatch }, params) {
    return this.$axios
      .get('api/category', {
        params,
      })
      .then((res) => {
        dispatch('set/category', res.data?.data)
        dispatch('set/paginator', res.data?.paginator)
        return true
      })
      .catch((err) => {
        console.log(err)
        dispatch('set/errorMessage', err)
        return false
      })
  },
}
