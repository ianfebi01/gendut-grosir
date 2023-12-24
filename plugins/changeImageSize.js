export default ({ app }, inject) => {
  inject('changeImageSize', (url, size) => {
    if (url.slice(-3) === 'svg') {
      return url
    } else return imageCompress(url, size)
  })
}

const imageCompress = (url, size) => {
  switch (size) {
    case 'xs':
      return newStr(url, 50)
    case 'sm':
      return newStr(url, 150)
    case 'md':
      return newStr(url, 300)
    case 'lg':
      return newStr(url, 500)
    default:
      return url
  }
}

const newStr = (str, width) => {
  const reg = /upload/

  return str.replace(reg, `upload/c_scale,w_${width}`)
}
