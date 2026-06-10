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
    creditsCost: 40,
    internalCostCents: 2,
    markupMultiplier: DEFAULT_BILLING_MARKUP,
  },
  {
    actionKey: "agent",
    label: "AI Agent",
    creditsCost: 80,
    internalCostCents: 4,
    markupMultiplier: DEFAULT_BILLING_MARKUP,
  },
  {
    actionKey: "generate_template",
    label: "Template Generator",
    creditsCost: 30,
    internalCostCents: 1,
    markupMultiplier: DEFAULT_BILLING_MARKUP,
  },
  {
    actionKey: "run_column_ai",
    label: "Column AI / Web",
    creditsCost: 75,
    internalCostCents: 3,
    markupMultiplier: DEFAULT_BILLING_MARKUP,
  },
  {
    actionKey: "run_column_scrape",
    label: "Website Scrape",
    creditsCost: 50,
    internalCostCents: 2,
    markupMultiplier: DEFAULT_BILLING_MARKUP,
  },
  {
    actionKey: "run_column_read_file",
    label: "Read File",
    creditsCost: 60,
    internalCostCents: 3,
    markupMultiplier: DEFAULT_BILLING_MARKUP,
  },
]

export function calculateSalePriceCents(internalCostCents: number, markupMultiplier: number) {
  return Math.max(0, Math.round(internalCostCents * markupMultiplier))
}
