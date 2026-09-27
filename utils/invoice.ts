import { formatRupiah } from '~/utils/formatRupiah'

export interface InvoiceOrder {
  orderId?: string
  createdAt?: string | Date
  total?: number
  user?: { name?: string; email?: string } | string
  details?: {
    qty?: number
    price?: number
    product?: { name?: string } | string
  }[]
}

const STORE_NAME = 'Gendut Grosir'
const STORE_ADDRESS = 'Semuluhkidu, Ngeposari, Semanu, Gunungkidul'

const esc = (v: unknown) =>
  String(v ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')

const rupiah = (n: number) => formatRupiah(n) || 'Rp 0'

const formatDate = (d?: string | Date) =>
  new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(d ? new Date(d) : new Date())

/**
 * Invoice as a standalone HTML document.
 * `customer` fills in the recipient when the order only carries a user id
 * (e.g. the response of POST /order).
 */
export function renderInvoiceHtml(
  order: InvoiceOrder,
  customer?: { name?: string; email?: string },
) {
  const user =
    typeof order.user === 'object' && order.user ? order.user : (customer ?? {})
  const details = order.details ?? []
  const rows = details
    .map((item) => {
      const qty = Number(item.qty) || 0
      const price = Number(item.price) || 0
      const name =
        typeof item.product === 'object' ? item.product?.name : item.product
      return `<tr>
          <td>${esc(name ?? '-')}</td>
          <td class="num">${rupiah(price)}</td>
          <td class="num">${qty}</td>
          <td class="num">${rupiah(qty * price)}</td>
        </tr>`
    })
    .join('')
  const total =
    order.total ??
    details.reduce(
      (sum, i) => sum + (Number(i.price) || 0) * (Number(i.qty) || 0),
      0,
    )
  const logo = `${window.location.origin}/logo.svg`

  return `<!DOCTYPE html>
<html lang="id">
<head>
<meta charset="utf-8" />
<title>Invoice ${esc(order.orderId)}</title>
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Work+Sans:wght@400;500;600&display=swap" rel="stylesheet" />
<style>
  @page { size: A4; margin: 16mm; }
  * { box-sizing: border-box; }
  html, body { margin: 0; padding: 0; }
  body {
    font-family: 'Work Sans', ui-sans-serif, system-ui, sans-serif;
    color: #141414; font-size: 13px; line-height: 1.5;
    -webkit-print-color-adjust: exact; print-color-adjust: exact;
  }
  .page { display: flex; flex-direction: column; min-height: calc(297mm - 32mm); }
  .header {
    display: flex; justify-content: space-between; align-items: center;
    padding: 20px 24px; background: #f5f5f5; border-radius: 10px;
  }
  .header img { height: 40px; }
  .label { font-size: 11px; font-weight: 600; letter-spacing: .06em; text-transform: uppercase; color: #8a8a8a; }
  .value { font-size: 14px; font-weight: 500; }
  .right { text-align: right; }
  .meta { display: flex; justify-content: space-between; gap: 24px; margin: 32px 4px 24px; }
  .meta ul { list-style: none; margin: 4px 0 0; padding: 0; }
  table { width: 100%; border-collapse: collapse; }
  th {
    text-align: left; font-size: 11px; font-weight: 600; letter-spacing: .06em;
    text-transform: uppercase; color: #8a8a8a; padding: 10px 12px; border-bottom: 1px solid #e3e3e3;
  }
  td { padding: 12px; border-bottom: 1px solid #ececec; vertical-align: top; }
  .num { text-align: right; white-space: nowrap; font-variant-numeric: tabular-nums; }
  th.num { text-align: right; }
  .total {
    display: flex; justify-content: flex-end; align-items: baseline; gap: 32px;
    margin-top: 16px; padding: 14px 12px; border-top: 2px solid #0a0a0a;
  }
  .total .value { font-size: 18px; font-weight: 600; }
  .footer { margin-top: auto; padding-top: 48px; }
  .footer .thanks { font-size: 16px; font-weight: 600; margin-bottom: 4px; }
  .muted { color: #666; }
</style>
</head>
<body>
  <div class="page">
    <div class="header">
      <img src="${logo}" alt="${STORE_NAME}" />
      <div class="right">
        <div class="label">Order ID</div>
        <div class="value">${esc(order.orderId ?? '-')}</div>
      </div>
    </div>

    <div class="meta">
      <div>
        <div class="label">Kepada</div>
        <ul>
          <li class="value">${esc(user.name ?? '-')}</li>
          ${user.email ? `<li class="muted">${esc(user.email)}</li>` : ''}
        </ul>
      </div>
      <div class="right">
        <div class="label">Tanggal</div>
        <ul><li class="value">${esc(formatDate(order.createdAt))}</li></ul>
      </div>
    </div>

    <table>
      <thead>
        <tr>
          <th>Nama Barang</th>
          <th class="num">Harga</th>
          <th class="num">Jumlah</th>
          <th class="num">Total</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>

    <div class="total">
      <span class="label">Total</span>
      <span class="value">${rupiah(total)}</span>
    </div>

    <div class="footer">
      <div class="thanks">Terima kasih</div>
      <div>${STORE_NAME}</div>
      <div class="muted">${STORE_ADDRESS}</div>
    </div>
  </div>
</body>
</html>`
}

/**
 * Opens the browser print dialog for the invoice (users can "Save as PDF").
 * Uses a hidden iframe so the app page itself isn't printed.
 */
export function printInvoice(
  order: InvoiceOrder,
  customer?: { name?: string; email?: string },
) {
  return new Promise<void>((resolve, reject) => {
    const iframe = document.createElement('iframe')
    iframe.setAttribute('aria-hidden', 'true')
    Object.assign(iframe.style, {
      position: 'fixed',
      right: '0',
      bottom: '0',
      width: '0',
      height: '0',
      border: '0',
    })

    const cleanup = () => setTimeout(() => iframe.remove(), 1000)

    iframe.onload = async () => {
      const win = iframe.contentWindow
      const doc = iframe.contentDocument
      if (!win || !doc) {
        cleanup()
        return reject(new Error('Gagal membuka invoice'))
      }
      // Wait for the logo and web font so they appear in the print
      const images = Array.from(doc.images).map((img) =>
        img.complete
          ? Promise.resolve()
          : new Promise((r) => {
              img.onload = img.onerror = r
            }),
      )
      await Promise.race([
        Promise.all([...images, doc.fonts?.ready]),
        new Promise((r) => setTimeout(r, 3000)),
      ])
      win.addEventListener('afterprint', cleanup, { once: true })
      win.focus()
      win.print()
      resolve()
    }

    iframe.srcdoc = renderInvoiceHtml(order, customer)
    document.body.appendChild(iframe)
  })
}
