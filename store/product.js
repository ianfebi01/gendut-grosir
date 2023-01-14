import EasyAccess, { defaultMutations } from 'vuex-easy-access'

export const state = () => ({
  product: [],
  productDetails: {},
  errorMessage: '',
  paginator: {},
})

export const mutations = { ...defaultMutations(state()) }

export const plugins = [EasyAccess()]

export const actions = {
  getProduct({ dispatch }, params) {
    return this.$axios
      .get(`api/product`, { params })
      .then((res) => {
        dispatch('set/product', res.data?.data?.data)
        dispatch('set/paginator', res?.data?.data?.paginator)
        return true
      })
      .catch((err) => {
        console.log(err)
        dispatch('set/errorMessage', err)
        return false
      })
  },
  deleteProduct({ dispatch, state }, id) {
    return this.$axios
      .delete(`api/product/${id}`)
      .then(() => {
        const tmp = JSON.parse(JSON.stringify(state.product))
        const index = tmp.findIndex((item) => item._id === id)

        if (index != -1) {
          tmp.splice(index, 1)
          dispatch('set/product', tmp)
        }
        return true
      })
      .catch((err) => {
        console.log(err)
        dispatch('set/errorMessage', err)
        return false
      })
  },
  addProduct({ dispatch }, body) {
    return this.$axios
      .post(`api/product`, { ...body })
      .then((res) => {
        dispatch('set/product.push', res.data?.data)

        return true
      })
      .catch((err) => {
        console.log(err)
        dispatch('set/errorMessage', err)
        return false
      })
  },
  editProduct({ dispatch, state }, body) {
    return this.$axios
      .put(`api/product/${body._id}`, { ...body })
      .then((res) => {
        const tmp = JSON.parse(JSON.stringify(state.product))
        const index = tmp.findIndex((item) => item._id === body._id)
        if (index != -1) {
          tmp[index] = {
            ...res?.data?.data,
          }
        }
        dispatch('set/product', tmp)
        return true
      })
      .catch((err) => {
        console.log(err)
        dispatch('set/errorMessage', err)
        return false
      })
  },
  getProductById({ dispatch }, id) {
    return this.$axios
      .get(`api/product/${id}`)
      .then((res) => {
        dispatch('set/productDetails', res.data?.data)
        return true
      })
      .catch((err) => {
        console.log(err)
        dispatch('set/errorMessage', err)
        return false
      })
  },
}
