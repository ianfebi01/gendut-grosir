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
    dispatch('set/errorMessage', '')
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
  getProductIntersect({ dispatch }, params) {
    dispatch('set/errorMessage', '')
    return this.$axios
      .get(`api/product`, { params })
      .then((res) => {
        const tmp = res.data?.data?.data
        tmp.forEach((item) => {
          dispatch('set/product.push', item)
        })
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
    dispatch('set/errorMessage', '')
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
  addProduct({ dispatch }, formData) {
    dispatch('set/errorMessage', '')
    let config = {
      header: {
        'Content-Type': 'multipart/form-data',
      },
    }
    return this.$axios
      .post(`api/product`, formData, config)
      .then((res) => {
        dispatch('set/product.push', res.data?.data)
        // console.log(res.data)

        return true
      })
      .catch((err) => {
        console.log(err)
        dispatch('set/errorMessage', err)
        return false
      })
  },
  addStockById({ dispatch, state }, id) {
    dispatch('set/errorMessage', '')
    return this.$axios
      .put(`api/product/stockbarcode/${id}`)
      .then((res) => {
        const tmp = JSON.parse(JSON.stringify(state.product))
        const index = tmp.findIndex((item) => item._id === res.data?.data?._id)
        if (index != -1) {
          tmp[index].stock = res.data?.data?.stock
        }

        dispatch('set/product', tmp)
        return res.data?.data?.name
      })
      .catch((err) => {
        console.log(err)
        dispatch('set/errorMessage', err?.response?.data?.message)
        return false
      })
  },
  editProduct({ dispatch, state }, formData) {
    dispatch('set/errorMessage', '')
    let config = {
      header: {
        'Content-Type': 'multipart/form-data',
      },
    }
    return this.$axios
      .put(`api/product/${formData.get('_id')}`, formData, config)
      .then((res) => {
        const tmp = JSON.parse(JSON.stringify(state.product))
        const index = tmp.findIndex((item) => item._id === formData.get('_id'))
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
    dispatch('set/errorMessage', '')
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
  getProductByBarcode({ dispatch }, barcode) {
    dispatch('set/errorMessage', '')
    return this.$axios
      .get(`api/productByBarcode/${barcode}`)
      .then((res) => {
        dispatch('set/productDetails', res.data?.data)
        return true
      })
      .catch((err) => {
        console.log(err)
        dispatch('set/errorMessage', err?.response?.data?.message)
        return false
      })
  },
  async orderSuccess({ dispatch, state }, payload) {
    const product = JSON.parse(JSON.stringify(state.product))
    await payload.forEach((item) => {
      const index = product.findIndex((i) => i._id == item.product._id)
      if (index != -1) {
        product[index].stock = item?.product?.stock
      }
    })

    dispatch('set/product', product)
  },
}
