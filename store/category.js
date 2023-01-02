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
        dispatch('set/category', res?.data?.data)
        dispatch('set/paginator', res?.data?.paginator)
        return true
      })
      .catch((err) => {
        console.log(err)
        dispatch('set/errorMessage', err)
        return false
      })
  },
  postCategory({ dispatch }, body) {
    return this.$axios
      .post('api/category', {
        name: body,
      })
      .then((res) => {
        const tmp = res?.data?.data
        tmp.totalProducts = 0
        dispatch('set/category.push', res?.data?.data)
        return true
      })
      .catch((err) => {
        console.log(err)
        dispatch('set/errorMessage', err?.response?.data?.message)
        return false
      })
  },
  editCategory({ dispatch, state }, params) {
    return this.$axios
      .put(`api/category/${params.id}`, {
        name: params?.name,
      })
      .then((res) => {
        const tmp = res?.data?.data
        tmp.totalProducts = 0

        const tmp2 = JSON.parse(JSON.stringify(state.category))
        const index = tmp2.findIndex((item) => item._id === params.id)
        if (index != -1) {
          tmp2[index] = tmp
          dispatch('set/category', tmp2)
        }
        return true
      })
      .catch((err) => {
        console.log(err)
        dispatch('set/errorMessage', err?.response?.data?.message)
        return false
      })
  },
  deleteCategory({ dispatch, state }, id) {
    return this.$axios
      .delete(`api/category/${id}`)
      .then(() => {
        const tmp = JSON.parse(JSON.stringify(state.category))
        const index = tmp.findIndex((item) => item._id === id)

        if (index != -1) {
          tmp.splice(index, 1)
          dispatch('set/category', tmp)
        }
        return true
      })
      .catch((err) => {
        console.log(err)
        dispatch('set/errorMessage', err?.response?.data?.message)
        return false
      })
  },
}
