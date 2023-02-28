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
      const res = await dispatch('user/getMe')
      // const rus = await this.$axios.get('/api2/test')
      console.log(res)
      // console.log('rus', rus)
    }
    // console.log(state.user.profile)
  },
}
