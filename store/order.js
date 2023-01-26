import EasyAccess, { defaultMutations } from 'vuex-easy-access'

export const state = () => ({
  cart: [],
  modalCart: false,
  errorMessage: '',
  detailOrder: {},
  order: [],
  paginator: {},
})

export const mutations = { ...defaultMutations(state()) }

export const plugins = [EasyAccess()]

export const actions = {
  addCart({ dispatch, state }, payload) {
    const tmp = JSON.parse(JSON.stringify(state.cart))
    const index = tmp.findIndex((item) => item._id === payload._id)
    if (index != -1) {
      tmp[index].qty = tmp[index].qty + 1
      dispatch('set/cart', tmp)
    } else {
      dispatch('set/cart.push', payload)
    }
  },
  plus({ dispatch, state }, id) {
    const tmp = JSON.parse(JSON.stringify(state.cart))
    const index = tmp.findIndex((item) => item._id === id)
    if (index != -1) {
      tmp[index].qty = tmp[index].qty + 1
      dispatch('set/cart', tmp)
    }
  },
  minus({ dispatch, state }, id) {
    const tmp = JSON.parse(JSON.stringify(state.cart))
    const index = tmp.findIndex((item) => item._id === id)
    if (index != -1) {
      if (tmp[index].qty > 1) {
        tmp[index].qty = tmp[index].qty - 1
        dispatch('set/cart', tmp)
      } else if (tmp[index].qty === 1) {
        const tmp2 = tmp.filter((item) => item._id !== id)
        dispatch('set/cart', tmp2)
      }
    }
  },
  delete({ dispatch, state }, id) {
    const tmp = JSON.parse(JSON.stringify(state.cart))
    const tmp2 = tmp.filter((item) => item._id !== id)
    dispatch('set/cart', tmp2)
  },
  postOrder({ dispatch }, body) {
    return this.$axios
      .post(`api/order`, {
        ...body,
      })
      .then((res) => {
        dispatch('set/detailOrder', res?.data?.data)

        return true
      })
      .catch((err) => {
        console.log(err)
        dispatch('set/errorMessage', err?.response?.data?.message)
        return false
      })
  },
  getOrder({ dispatch }, params) {
    return this.$axios
      .get(`api/order`, { params })
      .then((res) => {
        dispatch('set/order', res.data?.data?.data)
        dispatch('set/paginator', res?.data?.data?.paginator)
        return true
      })
      .catch((err) => {
        console.log(err)
        dispatch('set/errorMessage', err)
        return false
      })
  },
}
