import { useCallback, useEffect, useMemo, useState } from 'react'
import Aurora from '@/components/Aurora'
import ClickSpark from '@/components/ClickSpark'
import Choice from '@/sections/Choice'
import Hero from '@/sections/Hero'
import Result from '@/sections/Result'
import Spin from '@/sections/Spin'
import { BONUS_GIFTS, MAIN_GIFTS, type BonusGift, type MainGift } from '@/config/gifts'
import type { Outcome } from '@/lib/notify'

type Stage = 'hero' | 'choice' | 'spin' | 'result'

const STORAGE_KEY = 'theresa-birthday/outcome'

interface StoredOutcome {
  giftId: string
  bonusId: string
  decidedAt: string
  /** True once Formspree has accepted the submission. */
  notified: boolean
}

const readStored = (): StoredOutcome | null => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as StoredOutcome
    // Ignore anything referencing gifts that have since been edited away.
    if (!MAIN_GIFTS.some(g => g.id === parsed.giftId)) return null
    if (!BONUS_GIFTS.some(b => b.id === parsed.bonusId)) return null
    return parsed
  } catch {
    return null
  }
}

const writeStored = (value: StoredOutcome) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(value))
  } catch {
    /* Private-mode Safari refuses writes — the flow still works in-session. */
  }
}

export default function App() {
  const restored = useMemo(readStored, [])

  const [stage, setStage] = useState<Stage>(restored ? 'result' : 'hero')
  const [gift, setGift] = useState<MainGift | null>(
    restored ? (MAIN_GIFTS.find(g => g.id === restored.giftId) ?? null) : null,
  )
  const [bonus, setBonus] = useState<BonusGift | null>(
    restored ? (BONUS_GIFTS.find(b => b.id === restored.bonusId) ?? null) : null,
  )
  const [decidedAt, setDecidedAt] = useState(restored?.decidedAt ?? '')

  // Only send the email for a decision that hasn't been delivered yet, so a
  // reload of the result screen doesn't fire a second one.
  const [shouldNotify, setShouldNotify] = useState(restored ? !restored.notified : false)

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' })
  }, [stage])

  const handleConfirm = (chosen: MainGift) => {
    setGift(chosen)
    setStage('spin')
  }

  const handleWin = (won: BonusGift) => {
    if (!gift) return
    const now = new Date().toISOString()
    setBonus(won)
    setDecidedAt(now)
    setShouldNotify(true)
    writeStored({ giftId: gift.id, bonusId: won.id, decidedAt: now, notified: false })
    setStage('result')
  }

  const handleNotified = useCallback(() => {
    setShouldNotify(false)
    if (!gift || !bonus) return
    writeStored({ giftId: gift.id, bonusId: bonus.id, decidedAt, notified: true })
  }, [gift, bonus, decidedAt])

  const outcome: Outcome | null = gift && bonus ? { gift, bonus, decidedAt } : null

  return (
    <ClickSpark sparkColor="#ffffff" sparkSize={9} sparkRadius={18} sparkCount={8} duration={420}>
      {/* overflow-x-clip, not -hidden: `hidden` would make this a scroll
          container and break the sticky CTA in the choice stage. */}
      <div className="relative min-h-svh overflow-x-clip">
        {/* Fixed WebGL backdrop — one full-screen shader, cheap enough for a phone. */}
        <div className="pointer-events-none fixed inset-0 -z-10">
          <div className="absolute inset-0 bg-[radial-gradient(120%_80%_at_50%_0%,#131a33_0%,#05070f_60%)]" />
          <div className="absolute inset-x-0 top-0 h-[70svh] opacity-70">
            <Aurora colorStops={['#22d3ee', '#a78bfa', '#f43f5e']} amplitude={0.9} blend={0.55} speed={0.7} />
          </div>
          <div className="absolute inset-x-0 bottom-0 h-[55svh] rotate-180 opacity-40">
            <Aurora colorStops={['#f59e0b', '#f43f5e', '#22d3ee']} amplitude={0.7} blend={0.5} speed={0.5} />
          </div>
        </div>

        {/* Keyed remount gives each stage a clean fade-in. */}
        <main key={stage} className="animate-[stage-in_600ms_ease-out_both]">
          {stage === 'hero' && <Hero onStart={() => setStage('choice')} />}
          {stage === 'choice' && <Choice onConfirm={handleConfirm} />}
          {stage === 'spin' && gift && <Spin gift={gift} onWin={handleWin} />}
          {stage === 'result' && outcome && (
            <Result outcome={outcome} shouldNotify={shouldNotify} onNotified={handleNotified} />
          )}
        </main>
      </div>
    </ClickSpark>
  )
}
