export default ({ app }, inject) => {
  inject('formatDate', (date, format = 'normal') => {
    switch (format) {
      case 'normal':
        return app.$moment(date).format('DD MMM YYYY')
      case 'with-clock':
        return app.$moment(date).format('DD MMM YYYY HH:mm')
      default:
        return app.$moment(date).format('DD MMM YYYY')
    }
  })
}
