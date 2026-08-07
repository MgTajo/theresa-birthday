import BlurText from '@/components/BlurText'

export interface StageHeaderProps {
  step: string
  title: string
  subtitle: string
}

export default function StageHeader({ step, title, subtitle }: StageHeaderProps) {
  return (
    <header className="text-center">
      <p className="text-[0.65rem] font-light uppercase tracking-[0.4em] text-white/40">{step}</p>
      <h2 className="mt-3 font-serif text-4xl italic leading-tight text-white sm:text-5xl">
        {title}
      </h2>
      <BlurText
        text={subtitle}
        delay={40}
        animateBy="words"
        direction="bottom"
        className="mx-auto mt-3 max-w-xs justify-center text-balance text-sm font-light leading-relaxed text-white/55"
      />
    </header>
  )
}
