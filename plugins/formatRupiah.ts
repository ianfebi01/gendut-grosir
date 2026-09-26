export default defineNuxtPlugin(() => {
  const formatRupiah = (angka: number | string): string | number => {
    let result: string | number = 0
    if (angka) {
      result = new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
      })
        .format(Number(angka))
        .split(',')[0]
    }
    return result
  }

  return {
    provide: { formatRupiah },
  }
})
