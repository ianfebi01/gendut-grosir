import EasyAccess, { defaultMutations } from 'vuex-easy-access'

export const state = () => ({
  product: [],
  errorMessage: '',
})

export const mutations = { ...defaultMutations(state()) }

export const plugins = [EasyAccess()]

export const actions = {
  getProduct({ dispatch }) {
    return this.$axios
      .get(`api/product`)
      .then((res) => {
        dispatch('set/product', res.data?.data?.data)
        return true
      })
      .catch((err) => {
        console.log(err)
        dispatch('set/errorMessage', err)
        return false
      })
  },
}
