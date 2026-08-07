/* -------------------------------------------------------------------------
 *  THE ONLY FILE YOU NEED TO EDIT WHEN THE GIFTS ARE FIXED.
 *  Everything else on the site reads from here.
 * ---------------------------------------------------------------------- */

export type Accent = 'swim' | 'bike' | 'run'

export interface MainGift {
  /** Stable id — shows up in the email, so keep it short and readable. */
  id: string
  /** Big headline on the card. */
  title: string
  /** One-line teaser under the title. */
  tagline: string
  /** The longer pitch, shown once the card is selected. */
  description: string
  /** Emoji shown on the card. */
  emoji: string
  /** Colour family: swim = cyan, bike = amber, run = magenta. */
  accent: Accent
}

export interface BonusGift {
  id: string
  /** Short label — this is what gets painted onto the wheel segment, so
   *  keep it to ~18 characters or it will be squeezed on an iPhone. */
  label: string
  /** Longer text revealed after the wheel stops. */
  description: string
  emoji: string
  /** Relative chance. Omit for equal odds. 2 = twice as likely as a 1. */
  weight?: number
}

export const RECIPIENT = 'Theresa'

/** Shown in the hero. Set to null to hide the age counter entirely. */
export const AGE: number | null = null

/* --- The three gifts she picks from ------------------------------------ */

export const MAIN_GIFTS: MainGift[] = [
  {
    id: 'gift-1',
    title: 'Geschenk Nummer eins',
    tagline: 'Platzhalter — wird noch ersetzt',
    description:
      'Hier kommt die Beschreibung des ersten Geschenks hin. Ein, zwei Sätze reichen völlig — genug, damit die Wahl schwerfällt.',
    emoji: '🏊',
    accent: 'swim',
  },
  {
    id: 'gift-2',
    title: 'Geschenk Nummer zwei',
    tagline: 'Platzhalter — wird noch ersetzt',
    description:
      'Hier kommt die Beschreibung des zweiten Geschenks hin. Ein, zwei Sätze reichen völlig — genug, damit die Wahl schwerfällt.',
    emoji: '🚴',
    accent: 'bike',
  },
  {
    id: 'gift-3',
    title: 'Geschenk Nummer drei',
    tagline: 'Platzhalter — wird noch ersetzt',
    description:
      'Hier kommt die Beschreibung des dritten Geschenks hin. Ein, zwei Sätze reichen völlig — genug, damit die Wahl schwerfällt.',
    emoji: '🏃',
    accent: 'run',
  },
]

/* --- The small bonus gifts on the wheel --------------------------------
 * Any number from 4 to 10 works and the wheel lays itself out. Six or
 * eight looks best on a phone.
 * -------------------------------------------------------------------- */

export const BONUS_GIFTS: BonusGift[] = [
  {
    id: 'bonus-1',
    label: 'Bonus 1',
    description: 'Beschreibung des ersten kleinen Bonusgeschenks.',
    emoji: '🧦',
  },
  {
    id: 'bonus-2',
    label: 'Bonus 2',
    description: 'Beschreibung des zweiten kleinen Bonusgeschenks.',
    emoji: '🥤',
  },
  {
    id: 'bonus-3',
    label: 'Bonus 3',
    description: 'Beschreibung des dritten kleinen Bonusgeschenks.',
    emoji: '🧢',
  },
  {
    id: 'bonus-4',
    label: 'Bonus 4',
    description: 'Beschreibung des vierten kleinen Bonusgeschenks.',
    emoji: '⛑️',
  },
  {
    id: 'bonus-5',
    label: 'Bonus 5',
    description: 'Beschreibung des fünften kleinen Bonusgeschenks.',
    emoji: '🍫',
  },
  {
    id: 'bonus-6',
    label: 'Bonus 6',
    description: 'Beschreibung des sechsten kleinen Bonusgeschenks.',
    emoji: '🕶️',
  },
]

/* --- Where the notification email goes ---------------------------------
 * Formspree form, delivering to hornstein.magnus@gmail.com. Submitted as
 * JSON via fetch (see src/lib/notify.ts) rather than a real <form>, because
 * nothing here is typed by the visitor. If this is ever emptied or the
 * request fails, the result screen falls back to a mailto: link.
 * -------------------------------------------------------------------- */

export const FORMSPREE_ENDPOINT = 'https://formspree.io/f/mvkpzpjl'

/** Fallback address used for the mailto: link if Formspree is unset/down. */
export const NOTIFY_EMAIL = 'hornstein.magnus@gmail.com'
