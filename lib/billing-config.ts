export type BillingActionDefinition = {
  actionKey: string
  label: string
  creditsCost: number
  internalCostCents: number
  markupMultiplier: number
}

export const DEFAULT_BILLING_MARKUP = 2

export const DEFAULT_USAGE_PRICING: BillingActionDefinition[] = [
  {
    actionKey: "chat",
    label: "Sheet Chat",
    creditsCost: 1,
    internalCostCents: 2,
    markupMultiplier: DEFAULT_BILLING_MARKUP,
  },
  {
    actionKey: "agent",
    label: "AI Agent",
    creditsCost: 2,
    internalCostCents: 4,
    markupMultiplier: DEFAULT_BILLING_MARKUP,
  },
  {
    actionKey: "generate_template",
    label: "Template Generator",
    creditsCost: 1,
    internalCostCents: 1,
    markupMultiplier: DEFAULT_BILLING_MARKUP,
  },
  {
    actionKey: "run_column_ai",
    label: "Column AI / Web",
    creditsCost: 1,
    internalCostCents: 3,
    markupMultiplier: DEFAULT_BILLING_MARKUP,
  },
  {
    actionKey: "run_column_scrape",
    label: "Website Scrape",
    creditsCost: 1,
    internalCostCents: 2,
    markupMultiplier: DEFAULT_BILLING_MARKUP,
  },
  {
    actionKey: "run_column_read_file",
    label: "Read File",
    creditsCost: 1,
    internalCostCents: 3,
    markupMultiplier: DEFAULT_BILLING_MARKUP,
  },
  {
    actionKey: "create_table_local_search",
    label: "Create Table: Local Search",
    creditsCost: 1,
    internalCostCents: 2,
    markupMultiplier: DEFAULT_BILLING_MARKUP,
  },
  {
    actionKey: "create_table_google_search",
    label: "Create Table: Google Search",
    creditsCost: 1,
    internalCostCents: 2,
    markupMultiplier: DEFAULT_BILLING_MARKUP,
  },
  {
    actionKey: "generate_context",
    label: "Context Generator",
    creditsCost: 1,
    internalCostCents: 2,
    markupMultiplier: DEFAULT_BILLING_MARKUP,
  },
  {
    actionKey: "generate_email",
    label: "AI Email Generation",
    creditsCost: 2,
    internalCostCents: 2,
    markupMultiplier: DEFAULT_BILLING_MARKUP,
  },
  {
    actionKey: "send_email",
    label: "Email Delivery",
    creditsCost: 1,
    internalCostCents: 1,
    markupMultiplier: DEFAULT_BILLING_MARKUP,
  },
]

export function calculateSalePriceCents(internalCostCents: number, markupMultiplier: number) {
  return Math.max(0, Math.round(internalCostCents * markupMultiplier))
}

export function getEffectiveCreditsCost(input: {
  actionKey?: string
  creditsCost: number
  internalCostCents: number
  markupMultiplier: number
}) {
  const userChargeCents = calculateSalePriceCents(input.internalCostCents, input.markupMultiplier)
  const creditsCost = Math.max(0, Math.round(input.creditsCost))

  // Older pricing records used inflated credit numbers relative to real per-action cost.
  // If a legacy rule is detected, scale it to the newer month-friendly credit model.
  if (creditsCost >= 20 && userChargeCents > 0 && creditsCost / userChargeCents >= 5) {
    const scaled = Math.max(1, Math.ceil(creditsCost / 20))
    return applyActionCreditCap(input.actionKey, scaled)
  }

  return applyActionCreditCap(input.actionKey, creditsCost)
}

function applyActionCreditCap(actionKey: string | undefined, creditsCost: number) {
  // Email pricing is a product contract rather than an adjustable usage estimate:
  // one draft costs 2 credits and each delivered recipient row costs 1 credit.
  const fixedEmailCosts: Record<string, number> = {
    generate_email: 2,
    send_email: 1,
  }
  if (actionKey && fixedEmailCosts[actionKey] !== undefined) {
    return fixedEmailCosts[actionKey]
  }

  const caps: Record<string, number> = {
    chat: 1,
    agent: 2,
    generate_template: 1,
    run_column_ai: 1,
    run_column_scrape: 1,
    run_column_read_file: 1,
    create_table_local_search: 1,
    create_table_google_search: 1,
    generate_context: 1,
  }

  const cap = actionKey ? caps[actionKey] : undefined
  if (!cap) {
    return creditsCost
  }

  return Math.max(1, Math.min(creditsCost, cap))
}
