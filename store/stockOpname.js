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
      .then((res) => {
        dispatch('set/stockOpname.push', res?.data?.data)
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
  applyStockOpname({ dispatch, state }, id) {
    return this.$axios
      .put(`api/stockOpname/${id}`)
      .then((res) => {
        const tmp = JSON.parse(JSON.stringify(state.stockOpname))
        const index = tmp.findIndex((item) => item._id === res.data.data._id)
        console.log(index)
        if (index != -1) {
          tmp[index].apply = true
        }
        dispatch('set/stockOpname', tmp)
        return true
      })
      .catch((err) => {
        console.log(err)
        dispatch('set/errorMessage', err)
        return false
      })
  },
}
