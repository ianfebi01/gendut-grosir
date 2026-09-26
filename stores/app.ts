import { defineStore } from 'pinia'

export const useAppStore = defineStore('app', {
  state: () => ({
    drawer: false,
    modal: false,
    deleteModal: false,
    accessToken: '',
  }),
  actions: {
    setDrawer(value: boolean) {
      this.drawer = value
    },
    toggleDrawer() {
      this.drawer = !this.drawer
    },
    setModal(value: boolean) {
      this.modal = value
    },
    setDeleteModal(value: boolean) {
      this.deleteModal = value
    },
    setAccessToken(value: string) {
      this.accessToken = value
    },
  },
})
