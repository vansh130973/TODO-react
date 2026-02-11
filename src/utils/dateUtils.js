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

/**
 * Check if a UTC date string has passed (is in the past).
 */
export function isDatePassed(utcDate) {
  if (!utcDate) return false
  const d = new Date(utcDate)
  return !Number.isNaN(d.getTime()) && d.getTime() < Date.now()
}

/**
 * Get current UTC time formatted for datetime-local input (YYYY-MM-DDTHH:mm)
 */
export function utcNowForInput() {
  const now = new Date()
  const y = now.getUTCFullYear()
  const m = String(now.getUTCMonth() + 1).padStart(2, '0')
  const d = String(now.getUTCDate()).padStart(2, '0')
  const h = String(now.getUTCHours()).padStart(2, '0')
  const min = String(now.getUTCMinutes()).padStart(2, '0')
  return `${y}-${m}-${d}T${h}:${min}`
}

/**
 * Convert datetime-local input value to UTC Date object
 */
export function toUtcDate(value) {
  return new Date(value + ':00Z')
}

/**
 * Convert UTC ISO string to datetime-local input format (YYYY-MM-DDTHH:mm)
 */
export function utcToDateTimeInput(utcDate) {
  if (!utcDate) return ''
  try {
    const d = new Date(utcDate)
    if (Number.isNaN(d.getTime())) return ''
    const y = d.getUTCFullYear()
    const m = String(d.getUTCMonth() + 1).padStart(2, '0')
    const day = String(d.getUTCDate()).padStart(2, '0')
    const h = String(d.getUTCHours()).padStart(2, '0')
    const min = String(d.getUTCMinutes()).padStart(2, '0')
    return `${y}-${m}-${day}T${h}:${min}`
  } catch {
    return ''
  }
}

export const DATE_FORMAT_STORAGE_KEY = 'todo-date-format'