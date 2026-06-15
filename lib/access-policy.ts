export const FREE_TIER_CREDITS = 100
export const FREE_TIER_MAX_FILES = 1
export const FREE_TIER_MAX_ROWS = 10

export function hasPremiumAccessFromAccount(account?: {
  totalPurchasedCredits?: number
  totalAdminGrantedCredits?: number
} | null) {
  return Boolean((account?.totalPurchasedCredits ?? 0) > 0 || (account?.totalAdminGrantedCredits ?? 0) > 0)
}

export function getPlanLabel(hasPremiumAccess: boolean) {
  return hasPremiumAccess ? "premium" : "free"
}
