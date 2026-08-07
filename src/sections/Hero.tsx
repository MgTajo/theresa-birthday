import { useEffect } from 'react'
import BlurText from '@/components/BlurText'
import CountUp from '@/components/CountUp'
import GradientText from '@/components/GradientText'
import ShinyText from '@/components/ShinyText'
import SplitText from '@/components/SplitText'
import StarBorder from '@/components/StarBorder'
import { AGE, RECIPIENT } from '@/config/gifts'
import { burst } from '@/lib/celebrate'

export default function Hero({ onStart }: { onStart: () => void }) {
  useEffect(() => {
    const id = window.setTimeout(burst, 900)
    return () => window.clearTimeout(id)
  }, [])

  return (
    <section className="screen-h safe-bottom flex flex-col items-center justify-center px-6 pt-16 text-center">
      <p className="mb-6 text-[0.7rem] font-light uppercase tracking-[0.42em] text-white/45">
        Heute · nur für dich
      </p>

      <SplitText
        text="Alles Gute"
        tag="h1"
        /* SplitText forces overflow-hidden on the wrapper, so the line needs
           slack or the descenders get sheared off. */
        className="font-display text-5xl font-extralight leading-[1.15] tracking-tight text-white sm:text-7xl"
        delay={55}
        duration={0.9}
        splitType="chars"
        immediate
        from={{ opacity: 0, y: 46, filter: 'blur(8px)' }}
        to={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      />

      <div className="my-1">
        <GradientText
          colors={['#22d3ee', '#a78bfa', '#f43f5e', '#f59e0b', '#22d3ee']}
          animationSpeed={7}
          className="font-serif text-6xl italic leading-[1.05] sm:text-8xl"
        >
          {RECIPIENT}
        </GradientText>
      </div>

      <ShinyText
        text="zum Geburtstag"
        speed={4}
        className="font-display text-2xl font-light tracking-wide sm:text-4xl"
      />

      {AGE !== null && (
        <div className="mt-7 flex items-baseline gap-2 text-white/70">
          <CountUp
            to={AGE}
            duration={2.2}
            delay={0.8}
            className="font-display text-4xl font-semibold text-white"
          />
          <span className="text-sm uppercase tracking-[0.3em]">Jahre</span>
        </div>
      )}

      <BlurText
        text="Ein Geschenk suchst du dir selbst aus. Das zweite sucht sich das Glück."
        delay={70}
        animateBy="words"
        direction="bottom"
        className="mt-9 max-w-sm justify-center text-balance text-base font-light leading-relaxed text-white/65"
      />

      <StarBorder
        as="button"
        onClick={onStart}
        color="#22d3ee"
        speed="5s"
        thickness={2}
        className="mt-11 cursor-pointer"
      >
        <span className="px-2 text-base font-semibold tracking-wide">Los geht&apos;s</span>
      </StarBorder>

      <div className="mt-10 animate-bounce text-xl text-white/25" aria-hidden>
        ↓
      </div>
    </section>
  )
}
