import { useCallback, useEffect, useRef, useState } from 'react'
import AnimatedContent from '@/components/AnimatedContent'
import CircularText from '@/components/CircularText'
import StageHeader from '@/components/StageHeader'
import StarBorder from '@/components/StarBorder'
import Wheel, { rotationForIndex } from '@/components/Wheel'
import { BONUS_GIFTS, type BonusGift, type MainGift } from '@/config/gifts'
import { shower, tick } from '@/lib/celebrate'
import { pickWeightedIndex } from '@/lib/random'

const SPIN_MS = 5400

export default function Spin({
  gift,
  onWin,
}: {
  gift: MainGift
  onWin: (bonus: BonusGift) => void
}) {
  const [rotation, setRotation] = useState(0)
  const [spinning, setSpinning] = useState(false)
  const [done, setDone] = useState(false)
  const winnerRef = useRef<BonusGift | null>(null)
  const settledRef = useRef(false)
  const timersRef = useRef<number[]>([])

  useEffect(
    () => () => {
      timersRef.current.forEach(window.clearTimeout)
    },
    [],
  )

  // Called by the disc's transitionend, and by a timeout in case that event
  // never arrives — Safari drops it if the tab is backgrounded mid-spin, which
  // would otherwise strand the page on "Dreht…" with no way forward.
  const handleSettle = useCallback(() => {
    if (settledRef.current) return
    settledRef.current = true

    setSpinning(false)
    setDone(true)
    tick([20, 60, 20, 60, 40])
    shower(2400)

    const winner = winnerRef.current
    // Let the confetti land before swapping screens.
    timersRef.current.push(window.setTimeout(() => winner && onWin(winner), 1500))
  }, [onWin])

  const spin = () => {
    if (spinning || done) return
    const index = pickWeightedIndex(BONUS_GIFTS)
    winnerRef.current = BONUS_GIFTS[index]
    settledRef.current = false
    setSpinning(true)
    tick([10, 40, 10])
    setRotation(current => rotationForIndex(current, index, BONUS_GIFTS.length))
    timersRef.current.push(window.setTimeout(handleSettle, SPIN_MS + 600))
  }

  return (
    <section className="screen-h safe-bottom mx-auto flex w-full max-w-lg flex-col justify-center px-5 pt-14">
      <StageHeader
        step="Schritt 2 von 2"
        title="Und jetzt das Glück"
        subtitle="Auf dein Geschenk kommt noch eine Kleinigkeit obendrauf. Welche, entscheidet das Rad."
      />

      <AnimatedContent distance={30} duration={0.7} delay={0.15} threshold={0.05}>
        {/* Two lines: a long gift title would otherwise blow past the screen
            edge once the uppercase letter-spacing is applied. */}
        <div className="mt-4 text-center">
          <p className="text-[0.6rem] font-light uppercase tracking-[0.35em] text-white/35">
            Deine Wahl
          </p>
          <p className="mx-auto mt-1 max-w-[17rem] text-balance text-sm font-medium text-white/75">
            {gift.emoji} {gift.title}
          </p>
        </div>
      </AnimatedContent>

      {/* The word ring sits outside the disc, so the disc is deliberately
          narrower than its container. */}
      <div className="relative mx-auto mt-6 aspect-square w-full max-w-[17rem]">
        <div className="pointer-events-none absolute inset-0 z-20 grid place-items-center">
          <CircularText
            text={spinning ? 'ES·DREHT·SICH·ES·DREHT·SICH·' : 'VIEL·GLÜCK·VIEL·GLÜCK·'}
            spinDuration={spinning ? 6 : 24}
            /* CircularText hard-codes text-2xl on each letter span. */
            className="scale-[1.33] font-semibold tracking-[0.15em] text-white/30 [&>span]:text-[0.62rem]!"
          />
        </div>

        <div className="absolute inset-0 grid place-items-center">
          <div className="w-[13.25rem]">
            <Wheel
              items={BONUS_GIFTS}
              rotation={rotation}
              durationMs={SPIN_MS}
              spinning={spinning}
              onSettle={handleSettle}
            />
          </div>
        </div>
      </div>

      <div className="mt-7 flex min-h-[4.5rem] justify-center">
        {done ? (
          <p className="self-center text-center font-serif text-2xl italic text-white/85">
            {winnerRef.current?.emoji} {winnerRef.current?.label}
          </p>
        ) : (
          <StarBorder
            as="button"
            onClick={spin}
            color="#f59e0b"
            speed="3s"
            thickness={2}
            disabled={spinning}
            className={`cursor-pointer transition-opacity ${spinning ? 'opacity-50' : ''}`}
          >
            <span className="px-4 text-base font-semibold tracking-wide">
              {spinning ? 'Dreht…' : 'Rad drehen'}
            </span>
          </StarBorder>
        )}
      </div>
    </section>
  )
}
