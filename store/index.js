import EasyAccess, { defaultMutations } from 'vuex-easy-access'

export const state = () => ({
  drawer: false,
  modal: false,
  deleteModal: false,
  accessToken: '',
})

export const mutations = { ...defaultMutations(state()) }

export const plugins = [EasyAccess()]

export const actions = {
  async nuxtServerInit({ dispatch }) {
    const accessToken = this.$cookiz.get('access_token')
    if (accessToken) {
      await dispatch('user/getMe')
    }
  },
}
