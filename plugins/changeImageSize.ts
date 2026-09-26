const imageCompress = (url: string, size?: string): string => {
  switch (size) {
    case 'xs':
      return newStr(url, 50)
    case 'sm':
      return newStr(url, 200)
    case 'md':
      return newStr(url, 300)
    case 'lg':
      return newStr(url, 500)
    default:
      return url
  }
}

const newStr = (str: string, width: number): string => {
  const reg = /upload/
  return str.replace(reg, `upload/c_scale,w_${width}`)
}

export default defineNuxtPlugin(() => {
  const changeImageSize = (url: string, size?: string): string => {
    if (!url) return url
    if (url.slice(-3) === 'svg') {
      return url
    }
    return imageCompress(url, size)
  }

  return {
    provide: { changeImageSize },
  }
})
