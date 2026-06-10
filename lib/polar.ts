export function getPolarServerMode() {
  return process.env.POLAR_MODE === "production" ? "production" : "sandbox"
}

export function isPolarConfigured() {
  return Boolean(process.env.POLAR_ACCESS_TOKEN)
}
