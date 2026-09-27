import { defineStore } from 'pinia'

// UI-only store: profile + selected customer. Server data lives in Vue Query cache.
export const useUserStore = defineStore('user', {
  state: () => ({
    profile: {} as Record<string, any>,
    selectedUser: {} as Record<string, any>,
  }),
  actions: {
    setProfile(profile: Record<string, any>) {
      this.profile = profile
    },
    clearProfile() {
      this.profile = {}
    },
    setSelectedUser(user: Record<string, any>) {
      this.selectedUser = user
    },
    clearSelectedUser() {
      this.selectedUser = {}
    },
  },
})
