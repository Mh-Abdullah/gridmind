const DELETED_PREFIX_REGEX = /^\[deleted\]\s*/i
const PERIOD_PREFIX_REGEX = /^\[period:(\d+)\]\s*/i

export function parsePackageDescription(rawDescription?: string) {
  let next = rawDescription?.trim() || ""
  const isDeleted = DELETED_PREFIX_REGEX.test(next)

  if (isDeleted) {
    next = next.replace(DELETED_PREFIX_REGEX, "").trim()
  }

  const periodMatch = next.match(PERIOD_PREFIX_REGEX)
  const periodMonths = periodMatch ? Math.max(1, Number(periodMatch[1])) : undefined

  if (periodMatch) {
    next = next.replace(PERIOD_PREFIX_REGEX, "").trim()
  }

  return {
    isDeleted,
    periodMonths,
    description: next || undefined,
  }
}

export function buildPackageDescription(description?: string, periodMonths?: number) {
  const parts: string[] = []

  if (periodMonths && periodMonths > 0) {
    parts.push(`[period:${Math.round(periodMonths)}]`)
  }

  if (description?.trim()) {
    parts.push(description.trim())
  }

  return parts.join(" ").trim() || undefined
}

export function formatPackagePeriod(periodMonths?: number) {
  if (!periodMonths) return "No time limit"
  return `${periodMonths} month${periodMonths === 1 ? "" : "s"}`
}

