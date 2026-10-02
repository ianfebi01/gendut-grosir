import dayjs from 'dayjs'

export default defineNuxtPlugin(() => {
  const formatDate = (date: string | Date, format = 'normal'): string => {
    switch (format) {
      case 'normal':
        return dayjs(date).format('DD MMM YYYY')
      case 'with-clock':
        return dayjs(date).format('DD MMM YYYY HH:mm')
      default:
        return dayjs(date).format('DD MMM YYYY')
    }
  }

  return {
    provide: { formatDate },
  }
})
