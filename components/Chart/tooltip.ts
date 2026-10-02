const escapeHtml = (text: string) =>
  text.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`)

/**
 * Tooltip body shared by the dashboard charts: a date heading, then one row
 * per series - line key, value (strong), series name (muted).
 */
export function tooltipHtml(
  title: string,
  rows: { label: string; color: string; value: string }[],
) {
  const body = rows
    .map(
      (r) =>
        `<div class="viz-tt-row">` +
        `<span class="viz-tt-key" style="background:${r.color}"></span>` +
        `<span class="viz-tt-value">${escapeHtml(r.value)}</span>` +
        `<span class="viz-tt-label">${escapeHtml(r.label)}</span>` +
        `</div>`,
    )
    .join('')
  return `<div class="viz-tt"><div class="viz-tt-title">${escapeHtml(title)}</div>${body}</div>`
}
