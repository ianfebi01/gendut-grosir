import EasyAccess, { defaultMutations } from 'vuex-easy-access'

export const state = () => ({
  cart: [],
  modalCart: false,
  errorMessage: '',
  detailOrder: {},
  order: [],
  paginator: {},
  invoice: '',
})

export const mutations = { ...defaultMutations(state()) }

export const plugins = [EasyAccess()]

export const actions = {
  addCart({ dispatch, state }, payload) {
    const tmp = JSON.parse(JSON.stringify(state.cart))
    const index = tmp.findIndex((item) => item._id === payload._id)

    const product = JSON.parse(JSON.stringify(this.get('product/product')))
    const productIndex = product.findIndex((item) => item._id === payload._id)

    if (index != -1) {
      if (product[productIndex].stock > tmp[index].qty) {
        tmp[index].qty = tmp[index].qty + 1
        dispatch('set/cart', tmp)
      } else {
        dispatch(
          'set/errorMessage',
          `Tidak bisa menambahkan lebih dari ${product[productIndex].stock} ${product[productIndex].name}`
        )
      }
    } else {
      dispatch('set/cart.push', payload)
    }
  },
  plus({ dispatch, state }, id) {
    const tmp = JSON.parse(JSON.stringify(state.cart))
    const index = tmp.findIndex((item) => item._id === id)

    const product = JSON.parse(JSON.stringify(this.get('product/product')))
    const productIndex = product.findIndex((item) => item._id === id)

    if (index != -1) {
      if (product[productIndex].stock > tmp[index].qty) {
        tmp[index].qty = tmp[index].qty + 1
        dispatch('set/cart', tmp)
      } else {
        dispatch(
          'set/errorMessage',
          `Tidak bisa menambahkan lebih dari ${product[productIndex].stock} ${product[productIndex].name}`
        )
      }
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
  changeStatusOrder({ dispatch, state }, params) {
    return this.$axios
      .put(`api/changeStatusOrder/${params}`)
      .then((res) => {
        const tmp = JSON.parse(JSON.stringify(state.order))
        const index = tmp.findIndex((item) => item._id === res?.data?.data?._id)
        console.log(res.data.data)
        if (index != -1) {
          tmp[index] = res?.data?.data
        }
        dispatch('set/order', tmp)

        return true
      })
      .catch((err) => {
        console.log(err)
        dispatch('set/errorMessage', err?.response?.data?.message)
        return false
      })
  },
  cancelOrder({ dispatch, state }, params) {
    return this.$axios
      .put(`api/cancelOrder/${params}`)
      .then((res) => {
        const tmp = JSON.parse(JSON.stringify(state.order))
        const index = tmp.findIndex((item) => item._id === res?.data?.data?._id)

        if (index != -1) {
          tmp[index] = res?.data?.data
        }
        dispatch('set/order', tmp)

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
  downloadInvoice({ dispatch }, params) {
    return this.$axios
      .get(`api/order/download`, {
        params: {
          ...params,
        },
        responseType: 'blob',
      })
      .then((response) => {
        var FILE = window.URL.createObjectURL(new Blob([response.data]))
        var docUrl = document.createElement('a')
        docUrl.href = FILE
        docUrl.setAttribute(
          'download',
          response.headers['content-disposition'].match(/[a-zA-Z]*\.pdf/)[0]
        )

        document.body.appendChild(docUrl)
        docUrl.click()
        return true
        // dispatch('set/invoice', res.data)

        // return res.data
      })
      .catch((err) => {
        console.log(err)
        dispatch('set/errorMessage', err)
        return false
      })
  },
}
