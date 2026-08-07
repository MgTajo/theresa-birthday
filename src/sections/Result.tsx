import { useEffect, useRef, useState } from 'react'
import AnimatedContent from '@/components/AnimatedContent'
import GradientText from '@/components/GradientText'
import ShinyText from '@/components/ShinyText'
import SpotlightCard from '@/components/SpotlightCard'
import TextType from '@/components/TextType'
import { RECIPIENT } from '@/config/gifts'
import { shower } from '@/lib/celebrate'
import { mailtoFallback, sendOutcome, type NotifyState, type Outcome } from '@/lib/notify'

interface ResultProps {
  outcome: Outcome
  /** Always true on arrival here: every completed spin sends exactly one
   * notification, since nothing about the run persists across a reload. */
  shouldNotify: boolean
  onNotified: () => void
}

export default function Result({ outcome, shouldNotify, onNotified }: ResultProps) {
  const { gift, bonus } = outcome
  const [state, setState] = useState<NotifyState>(shouldNotify ? 'sending' : 'sent')
  const attempted = useRef(false)

  useEffect(() => {
    shower(2600)
  }, [])

  useEffect(() => {
    if (!shouldNotify || attempted.current) return
    attempted.current = true

    let cancelled = false
    sendOutcome(outcome)
      .then(() => {
        if (cancelled) return
        setState('sent')
        onNotified()
      })
      .catch((error: unknown) => {
        if (cancelled) return
        console.error('Formspree-Benachrichtigung fehlgeschlagen:', error)
        setState('failed')
      })

    return () => {
      cancelled = true
    }
  }, [outcome, shouldNotify, onNotified])

  const retry = () => {
    setState('sending')
    sendOutcome(outcome)
      .then(() => {
        setState('sent')
        onNotified()
      })
      .catch(() => setState('failed'))
  }

  return (
    <section className="screen-h safe-bottom mx-auto flex w-full max-w-lg flex-col justify-center px-5 py-20">
      <header className="text-center">
        <p className="text-[0.65rem] font-light uppercase tracking-[0.4em] text-white/40">
          Fertig
        </p>
        <GradientText
          colors={['#22d3ee', '#a78bfa', '#f43f5e', '#f59e0b', '#22d3ee']}
          animationSpeed={8}
          className="mt-3 font-serif text-4xl italic sm:text-5xl"
        >
          Deine Bescherung
        </GradientText>

        <div className="mx-auto mt-4 max-w-xs">
          <TextType
            as="p"
            text={[`Gut gewählt, ${RECIPIENT}. Beides ist unterwegs.`]}
            typingSpeed={38}
            initialDelay={600}
            showCursor
            cursorCharacter="▍"
            loop={false}
            className="text-sm font-light leading-relaxed text-white/60"
          />
        </div>
      </header>

      <div className="mt-9 flex flex-col gap-4">
        <AnimatedContent distance={40} duration={0.7} delay={0.1} threshold={0.05}>
          <SpotlightCard
            spotlightColor="rgba(34, 211, 238, 0.28)"
            className="border-white/10! bg-white/[0.04]! p-6!"
          >
            <p className="text-[0.6rem] font-semibold uppercase tracking-[0.35em] text-cyan-300/70">
              Dein Geschenk
            </p>
            <div className="mt-3 flex items-start gap-4">
              <span className="text-4xl">{gift.emoji}</span>
              <div className="min-w-0">
                <h3 className="font-display text-xl font-semibold leading-snug text-white">
                  {gift.title}
                </h3>
                <p className="mt-1.5 text-sm font-light leading-relaxed text-white/65">
                  {gift.description}
                </p>
              </div>
            </div>
          </SpotlightCard>
        </AnimatedContent>

        <AnimatedContent distance={40} duration={0.7} delay={0.3} threshold={0.05}>
          <SpotlightCard
            spotlightColor="rgba(245, 158, 11, 0.28)"
            className="border-amber-400/25! bg-amber-400/[0.05]! p-6!"
          >
            <p className="text-[0.6rem] font-semibold uppercase tracking-[0.35em] text-amber-300/80">
              Am Rad gewonnen
            </p>
            <div className="mt-3 flex items-start gap-4">
              <span className="text-4xl">{bonus.emoji}</span>
              <div className="min-w-0">
                <h3 className="font-display text-xl font-semibold leading-snug text-white">
                  {bonus.label}
                </h3>
                <p className="mt-1.5 text-sm font-light leading-relaxed text-white/65">
                  {bonus.description}
                </p>
              </div>
            </div>
          </SpotlightCard>
        </AnimatedContent>
      </div>

      <div className="mt-8 text-center text-sm">
        {state === 'sending' && (
          <p className="text-white/45">
            <span className="mr-2 inline-block animate-spin">◌</span>
            Magnus wird benachrichtigt…
          </p>
        )}

        {state === 'sent' && (
          <p className="text-emerald-300/80">✓ Magnus weiß Bescheid.</p>
        )}

        {state === 'failed' && (
          <div className="space-y-3">
            <p className="text-rose-300/80">
              Die Nachricht ging nicht raus. Kein Drama — probier es nochmal
              oder schick sie direkt.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={retry}
                className="cursor-pointer rounded-full border border-white/20 px-5 py-2 text-sm font-medium text-white/85 transition-colors hover:bg-white/10"
              >
                Nochmal versuchen
              </button>
              <a
                href={mailtoFallback(outcome)}
                className="cursor-pointer rounded-full border border-white/20 px-5 py-2 text-sm font-medium text-white/85 transition-colors hover:bg-white/10"
              >
                Per Mail schicken
              </a>
            </div>
          </div>
        )}
      </div>

      <div className="mt-12 text-center">
        <ShinyText
          text="Hab einen wunderschönen Tag ✨"
          speed={5}
          className="font-serif text-lg italic"
        />
      </div>
    </section>
  )
}
