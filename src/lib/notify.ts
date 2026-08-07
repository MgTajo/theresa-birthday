import {
  FORMSPREE_ENDPOINT,
  NOTIFY_EMAIL,
  RECIPIENT,
  type BonusGift,
  type MainGift,
} from '@/config/gifts'

export type NotifyState = 'idle' | 'sending' | 'sent' | 'failed'

export interface Outcome {
  gift: MainGift
  bonus: BonusGift
  /** ISO timestamp of when the wheel stopped. */
  decidedAt: string
}

const formatBody = ({ gift, bonus, decidedAt }: Outcome) =>
  [
    `${RECIPIENT} hat sich entschieden.`,
    '',
    `Hauptgeschenk:  ${gift.emoji} ${gift.title}  (${gift.id})`,
    `Bonus am Rad:   ${bonus.emoji} ${bonus.label}  (${bonus.id})`,
    '',
    `Zeitpunkt: ${new Date(decidedAt).toLocaleString('de-DE')}`,
  ].join('\n')

/**
 * Posts the outcome to Formspree as JSON. Formspree turns each top-level key
 * into a line in the email, so the keys are written to read well there.
 */
export async function sendOutcome(outcome: Outcome): Promise<void> {
  if (!FORMSPREE_ENDPOINT) throw new Error('Kein Formspree-Endpoint konfiguriert')

  const { gift, bonus, decidedAt } = outcome

  const response = await fetch(FORMSPREE_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      _subject: `🎁 ${RECIPIENT} hat gewählt: ${gift.title} + ${bonus.label}`,
      Beschenkte: RECIPIENT,
      Hauptgeschenk: `${gift.emoji} ${gift.title}`,
      Hauptgeschenk_ID: gift.id,
      Bonusgeschenk: `${bonus.emoji} ${bonus.label}`,
      Bonusgeschenk_ID: bonus.id,
      Zeitpunkt: new Date(decidedAt).toLocaleString('de-DE', {
        dateStyle: 'full',
        timeStyle: 'short',
      }),
      Geraet: navigator.userAgent,
    }),
  })

  if (!response.ok) {
    // Formspree replies with {errors:[{message}]} on validation problems.
    let detail = `HTTP ${response.status}`
    try {
      const data = (await response.json()) as { errors?: { message?: string }[] }
      if (data.errors?.length) detail = data.errors.map(e => e.message).join(', ')
    } catch {
      /* non-JSON error body — the status code is enough */
    }
    throw new Error(detail)
  }
}

/** Manual escape hatch shown if the POST fails (e.g. she is offline). */
export function mailtoFallback(outcome: Outcome): string {
  const subject = `Geburtstagsgeschenk: ${outcome.gift.title} + ${outcome.bonus.label}`
  return `mailto:${NOTIFY_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(
    formatBody(outcome),
  )}`
}
