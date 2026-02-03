/**
 * Format a UTC date string for display (converts to local timezone).
 * use24hr: true = 24-hour format, false = 12-hour (AM/PM).
 */
export function formatUtcForDisplay(utcDate, use24hr = false) {
  if (!utcDate) return '-'
  try {
    const d = new Date(utcDate)
    if (Number.isNaN(d.getTime())) return utcDate
    return d.toLocaleString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: !use24hr
    })
  } catch {
    return utcDate
  }
}

/**
 * Get current date/time as UTC ISO string.
 */
export function nowUtc() {
  return new Date().toISOString()
}

export const DATE_FORMAT_STORAGE_KEY = 'todo-date-format'

/**
 * Convert a date input value (YYYY-MM-DD) to UTC ISO string.
 */
export function dateInputToUtc(dateInput) {
  if (!dateInput) return null
  const d = new Date(dateInput + 'T00:00:00.000Z')
  return Number.isNaN(d.getTime()) ? null : d.toISOString()
}
