import EasyAccess, { defaultMutations } from 'vuex-easy-access'

export const state = () => ({
  errorMessage: '',
  imageUrl: [],
})

export const mutations = { ...defaultMutations(state()) }

export const plugins = [EasyAccess()]

export const actions = {
  uploadImages({ dispatch }, formData) {
    let config = {
      header: {
        'Content-Type': 'multipart/form-data',
      },
    }
    return this.$axios
      .post(`api/uploadImages`, formData, config)
      .then((res) => {
        dispatch('set/imageUrl', res?.data)
        return true
      })
      .catch((err) => {
        dispatch('set/errorMessage', err?.response?.data?.message)
        return false
      })
  },
  deleteImages({ dispatch }, publicId) {
    return this.$axios
      .post(`api/deleteImage`, { publicId })
      .then(() => {
        return true
      })
      .catch((err) => {
        dispatch('set/errorMessage', err?.response?.data?.message)
        return false
      })
  },
}
