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
 * Get current UTC time formatted for datetime-local input (in LOCAL timezone)
 * datetime-local inputs work in the user's local timezone
 */
export function utcNowForInput() {
  const now = new Date()
  const y = now.getFullYear()
  const m = String(now.getMonth() + 1).padStart(2, '0')
  const d = String(now.getDate()).padStart(2, '0')
  const h = String(now.getHours()).padStart(2, '0')
  const min = String(now.getMinutes()).padStart(2, '0')
  return `${y}-${m}-${d}T${h}:${min}`
}

/**
 * Convert datetime-local input value (which is in local time) to UTC Date object
 * The input value is in format YYYY-MM-DDTHH:mm and represents LOCAL time
 */
export function toUtcDate(value) {
  // Create a Date object from the local datetime string
  // This correctly interprets it as local time
  return new Date(value)
}

/**
 * Convert UTC ISO string to datetime-local input format (in LOCAL timezone)
 * datetime-local inputs expect local time, not UTC
 */
export function utcToDateTimeInput(utcDate) {
  if (!utcDate) return ''
  try {
    const d = new Date(utcDate)
    if (Number.isNaN(d.getTime())) return ''
    
    // Get local time components
    const y = d.getFullYear()
    const m = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    const h = String(d.getHours()).padStart(2, '0')
    const min = String(d.getMinutes()).padStart(2, '0')
    
    return `${y}-${m}-${day}T${h}:${min}`
  } catch {
    return ''
  }
}

export const DATE_FORMAT_STORAGE_KEY = 'todo-date-format'