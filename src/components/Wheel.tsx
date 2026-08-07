import { useId } from 'react'
import type { BonusGift } from '@/config/gifts'

const SIZE = 200
const C = SIZE / 2
const R = 94

/** Alternating segment fills, cycled so any segment count still alternates. */
const FILLS = [
  'rgba(34,211,238,0.20)',
  'rgba(244,63,94,0.20)',
  'rgba(245,158,11,0.20)',
  'rgba(167,139,250,0.20)',
]

const polar = (angleDeg: number, radius: number) => {
  const rad = ((angleDeg - 90) * Math.PI) / 180
  return [C + radius * Math.cos(rad), C + radius * Math.sin(rad)] as const
}

/** Pie slice from `start` to `end`, measured clockwise from 12 o'clock. */
const slice = (start: number, end: number) => {
  const [x1, y1] = polar(start, R)
  const [x2, y2] = polar(end, R)
  const large = end - start > 180 ? 1 : 0
  return `M ${C} ${C} L ${x1} ${y1} A ${R} ${R} 0 ${large} 1 ${x2} ${y2} Z`
}

export interface WheelProps {
  items: BonusGift[]
  /** Absolute rotation in degrees; always increase it to spin forwards. */
  rotation: number
  /** Transition length in ms. 0 makes the rotation snap (used on restore). */
  durationMs: number
  spinning: boolean
  onSettle: () => void
}

export default function Wheel({ items, rotation, durationMs, spinning, onSettle }: WheelProps) {
  const gradientId = useId()
  const seg = 360 / items.length

  return (
    <div className="relative mx-auto aspect-square w-full select-none">
      {/* Pointer, fixed at 12 o'clock. */}
      <div className="absolute -top-1 left-1/2 z-20 -translate-x-1/2">
        <div
          className={`h-0 w-0 border-x-[11px] border-t-[20px] border-x-transparent border-t-white drop-shadow-[0_2px_6px_rgba(0,0,0,0.6)] transition-transform ${
            spinning ? 'animate-pulse' : ''
          }`}
        />
      </div>

      {/* Glow behind the disc. */}
      <div
        aria-hidden
        className={`absolute inset-2 rounded-full blur-2xl transition-opacity duration-700 ${
          spinning ? 'opacity-70' : 'opacity-35'
        }`}
        style={{
          background:
            'conic-gradient(from 0deg, #22d3ee, #a78bfa, #f43f5e, #f59e0b, #22d3ee)',
        }}
      />

      <svg
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        className="relative z-10 h-full w-full"
        style={{
          transform: `rotate(${rotation}deg)`,
          transition: durationMs
            ? `transform ${durationMs}ms cubic-bezier(0.12, 0.78, 0.14, 1)`
            : 'none',
          willChange: 'transform',
        }}
        onTransitionEnd={event => {
          // Only the disc's own rotation counts — ignore bubbled transitions.
          if (event.propertyName === 'transform' && event.target === event.currentTarget) {
            onSettle()
          }
        }}
      >
        <defs>
          <radialGradient id={gradientId}>
            <stop offset="55%" stopColor="#0b1120" />
            <stop offset="100%" stopColor="#1e293b" />
          </radialGradient>
        </defs>

        <circle cx={C} cy={C} r={R + 4} fill={`url(#${gradientId})`} />

        {items.map((item, i) => {
          const start = i * seg
          const mid = start + seg / 2
          return (
            <g key={item.id}>
              <path
                d={slice(start, start + seg)}
                fill={FILLS[i % FILLS.length]}
                stroke="rgba(255,255,255,0.22)"
                strokeWidth={0.7}
              />
              <g transform={`rotate(${mid} ${C} ${C})`}>
                <text
                  x={C}
                  y={26}
                  textAnchor="middle"
                  fontSize={12}
                  style={{ userSelect: 'none' }}
                >
                  {item.emoji}
                </text>
                <text
                  x={C}
                  y={42}
                  textAnchor="middle"
                  fontSize={7.5}
                  fill="rgba(255,255,255,0.94)"
                  fontWeight={600}
                  letterSpacing={0.2}
                  style={{ userSelect: 'none' }}
                >
                  {item.label}
                </text>
              </g>
            </g>
          )
        })}

        <circle
          cx={C}
          cy={C}
          r={R + 4}
          fill="none"
          stroke="rgba(255,255,255,0.5)"
          strokeWidth={1.4}
        />
        <circle cx={C} cy={C} r={13} fill="#0b1120" stroke="rgba(255,255,255,0.6)" strokeWidth={1.4} />
        <text x={C} y={C + 4.5} textAnchor="middle" fontSize={11}>
          🎁
        </text>
      </svg>
    </div>
  )
}

/**
 * Rotation that parks `index` under the pointer, always spinning forwards.
 * A little jitter keeps it from stopping dead-centre every time.
 */
export function rotationForIndex(current: number, index: number, count: number): number {
  const seg = 360 / count
  const jitter = (Math.random() - 0.5) * seg * 0.7
  const desired = -(index * seg + seg / 2) - jitter

  // Advance to the next multiple of 360 above `current`, then add full turns.
  const turns = 5 + Math.floor(Math.random() * 2)
  const base = current - (((current % 360) + 360) % 360)
  let target = base + desired
  while (target <= current) target += 360
  return target + turns * 360
}
