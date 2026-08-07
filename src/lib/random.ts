import type { BonusGift } from '@/config/gifts'

/**
 * Picks a bonus gift honouring the optional `weight` field. Returns the index
 * so the wheel knows which segment to stop on.
 */
export function pickWeightedIndex(gifts: BonusGift[]): number {
  const weights = gifts.map(g => Math.max(g.weight ?? 1, 0))
  const total = weights.reduce((a, b) => a + b, 0)

  // All weights zero (or an empty list) — fall back to a uniform draw.
  if (total <= 0) return Math.floor(Math.random() * gifts.length)

  let roll = Math.random() * total
  for (let i = 0; i < weights.length; i++) {
    roll -= weights[i]
    if (roll < 0) return i
  }
  return weights.length - 1
}
