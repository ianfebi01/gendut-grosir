import EasyAccess, { defaultMutations } from 'vuex-easy-access'

export const state = () => ({
  stockOpname: [],
  errorMessage: '',
  paginator: {},
})

export const mutations = { ...defaultMutations(state()) }

export const plugins = [EasyAccess()]

export const actions = {
  postStockOpname({ dispatch }, payload) {
    return this.$axios
      .post(`api/stockOpname`, { ...payload })
      .then(() => {
        return true
      })
      .catch((err) => {
        console.log(err)
        dispatch('set/errorMessage', err)
        return false
      })
  },
  getStockOpname({ dispatch }, params) {
    return this.$axios
      .get(`api/stockOpname`, { params })
      .then((res) => {
        dispatch('set/stockOpname', res.data.data.data)
        dispatch('set/paginator', res.data.data.paginator)
        return true
      })
      .catch((err) => {
        console.log(err)
        dispatch('set/errorMessage', err)
        return false
      })
  },
}
