import { defineStore } from 'pinia'

export const useUploadImagesStore = defineStore('uploadImages', {
  state: () => ({
    errorMessage: '' as any,
    imageUrl: [] as any[],
  }),
  actions: {
    async uploadImages(formData: FormData) {
      const { api } = useApi()
      try {
        const result: any = await api('uploadImages', {
          method: 'POST',
          body: formData,
        })
        this.imageUrl = result
        return true
      } catch (err: any) {
        this.errorMessage = err?.data?.message ?? err?.message ?? err
        return false
      }
    },
    async deleteImages(publicId: string) {
      const { api } = useApi()
      try {
        await api('deleteImage', {
          method: 'POST',
          body: { publicId },
        })
        return true
      } catch (err: any) {
        this.errorMessage = err?.data?.message ?? err?.message ?? err
        return false
      }
    },
  },
})
