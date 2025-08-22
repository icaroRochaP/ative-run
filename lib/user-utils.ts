export function formatDisplayName(name: string | null | undefined): string | null {
  if (!name) return null
  // Normalize whitespace
  const tokens = name
    .trim()
    .split(/\s+/)
    .filter(Boolean)

  if (tokens.length === 0) return null
  if (tokens.length === 1) return toTitleCase(tokens[0])

  const first = toTitleCase(tokens[0])
  const last = toTitleCase(tokens[tokens.length - 1])
  return `${first} ${last}`
}

export function getInitials(name: string | null | undefined, maxChars = 2): string {
  const display = formatDisplayName(name)
  if (!display) return ""
  const tokens = display.split(/\s+/).filter(Boolean)
  if (tokens.length === 1) {
    return tokens[0].charAt(0).toUpperCase()
  }
  const firstChar = tokens[0].charAt(0).toUpperCase()
  const lastChar = tokens[tokens.length - 1].charAt(0).toUpperCase()
  const initials = `${firstChar}${lastChar}`
  return initials.slice(0, maxChars)
}

function toTitleCase(s: string) {
  if (!s) return s
  return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase()
}
