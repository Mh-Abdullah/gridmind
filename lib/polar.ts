export type PolarServerMode = "sandbox" | "production"

export function getPolarServerMode(): PolarServerMode {
  return process.env.POLAR_MODE === "production" ? "production" : "sandbox"
}

export function getPolarProductId(pkg: {
  polarProductId?: string
  polarProductEnvironment?: PolarServerMode
  polarSandboxProductId?: string
  polarProductionProductId?: string
}, mode = getPolarServerMode()) {
  const environmentProductId =
    mode === "production" ? pkg.polarProductionProductId : pkg.polarSandboxProductId

  // Legacy records used one product field. It is safe only after its environment
  // has been recorded by a sync using the new configuration.
  return environmentProductId ||
    (pkg.polarProductEnvironment === mode || (!pkg.polarProductEnvironment && mode === "production")
      ? pkg.polarProductId
      : undefined)
}

export function isPolarConfigured() {
  return Boolean(process.env.POLAR_ACCESS_TOKEN)
}
