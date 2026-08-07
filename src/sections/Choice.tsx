import { useState } from 'react'
import AnimatedContent from '@/components/AnimatedContent'
import SpotlightCard from '@/components/SpotlightCard'
import StarBorder from '@/components/StarBorder'
import { MAIN_GIFTS, type Accent, type MainGift } from '@/config/gifts'
import { tick } from '@/lib/celebrate'
import StageHeader from '@/components/StageHeader'

const ACCENT: Record<Accent, { hex: string; spotlight: `rgba(${number}, ${number}, ${number}, ${number})` }> = {
  swim: { hex: '#22d3ee', spotlight: 'rgba(34, 211, 238, 0.28)' },
  bike: { hex: '#f59e0b', spotlight: 'rgba(245, 158, 11, 0.28)' },
  run: { hex: '#f43f5e', spotlight: 'rgba(244, 63, 94, 0.28)' },
}

export default function Choice({ onConfirm }: { onConfirm: (gift: MainGift) => void }) {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const selected = MAIN_GIFTS.find(g => g.id === selectedId) ?? null

  return (
    <section className="screen-h mx-auto flex w-full max-w-lg flex-col justify-center px-5 pb-36 pt-20">
      <StageHeader title="Wähle ein Geschenk" />

      <div className="mt-8 flex flex-col gap-4">
        {MAIN_GIFTS.map((gift, i) => {
          const accent = ACCENT[gift.accent]
          const isSelected = selectedId === gift.id
          const isDimmed = selectedId !== null && !isSelected

          return (
            <AnimatedContent key={gift.id} distance={40} duration={0.7} delay={i * 0.12} threshold={0.05}>
              <button
                type="button"
                aria-pressed={isSelected}
                onClick={() => {
                  tick()
                  setSelectedId(isSelected ? null : gift.id)
                }}
                className={`block w-full rounded-3xl text-left transition-all duration-300 ${
                  isDimmed ? 'scale-[0.97] opacity-45' : 'opacity-100'
                }`}
                style={{
                  // Outer glow lives here because SpotlightCard clips overflow.
                  boxShadow: isSelected ? `0 14px 44px -14px ${accent.hex}` : 'none',
                }}
              >
                <SpotlightCard
                  spotlightColor={accent.spotlight}
                  className={`p-5! backdrop-blur-sm transition-all duration-300 ${
                    isSelected
                      ? 'border-transparent! bg-white/[0.07]!'
                      : 'border-white/10! bg-white/[0.03]!'
                  }`}
                >
                  <div
                    className="pointer-events-none absolute inset-0 rounded-3xl transition-opacity duration-300"
                    style={{
                      opacity: isSelected ? 1 : 0,
                      boxShadow: `inset 0 0 0 1.5px ${accent.hex}`,
                    }}
                  />

                  <div className="relative flex items-start gap-4">
                    <span
                      className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl text-3xl transition-transform duration-300"
                      style={{
                        background: `${accent.hex}1f`,
                        transform: isSelected ? 'scale(1.08)' : 'none',
                      }}
                    >
                      {gift.emoji}
                    </span>

                    <div className="min-w-0 flex-1">
                      <h3 className="font-display text-lg font-semibold leading-snug text-white">
                        {gift.title}
                      </h3>
                      <p
                        className="mt-0.5 text-[0.8rem] font-medium tracking-wide"
                        style={{ color: accent.hex }}
                      >
                        {gift.tagline}
                      </p>

                      {/* Grid trick: animates height from 0 without a fixed value. */}
                      <div
                        className="grid transition-all duration-500 ease-out"
                        style={{ gridTemplateRows: isSelected ? '1fr' : '0fr' }}
                      >
                        <div className="overflow-hidden">
                          <p className="pt-2.5 text-sm font-light leading-relaxed text-white/70">
                            {gift.description}
                          </p>
                        </div>
                      </div>
                    </div>

                    <span
                      className="mt-1 grid h-6 w-6 shrink-0 place-items-center rounded-full border text-xs transition-all duration-300"
                      style={{
                        borderColor: isSelected ? accent.hex : 'rgba(255,255,255,0.22)',
                        background: isSelected ? accent.hex : 'transparent',
                        color: '#05070f',
                      }}
                      aria-hidden
                    >
                      {isSelected ? '✓' : ''}
                    </span>
                  </div>
                </SpotlightCard>
              </button>
            </AnimatedContent>
          )
        })}
      </div>

      {/* Fixed rather than sticky: the CTA is the last child of the section, so
          a sticky element would have no slack to slide against. Only one stage
          is mounted at a time, so nothing else competes for the bottom bar. */}
      <div
        className="safe-bottom pointer-events-none fixed inset-x-0 bottom-0 z-30 grid bg-gradient-to-t from-[#05070f] from-40% via-[#05070f]/90 via-75% to-transparent pt-20 transition-opacity duration-500 ease-out"
        style={{ opacity: selected ? 1 : 0 }}
        aria-hidden={!selected}
      >
        <div className="overflow-hidden">
          <div className={`flex justify-center pb-2 ${selected ? 'pointer-events-auto' : ''}`}>
            <StarBorder
              as="button"
              onClick={() => selected && onConfirm(selected)}
              color={selected ? ACCENT[selected.accent].hex : '#22d3ee'}
              speed="4s"
              thickness={2}
              className="cursor-pointer"
              disabled={!selected}
            >
              <span className="px-2 text-base font-semibold tracking-wide">
                Das nehme ich!
              </span>
            </StarBorder>
          </div>
        </div>
      </div>
    </section>
  )
}
