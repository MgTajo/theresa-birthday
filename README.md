# Alles Gute, Theresa 🎁

Eine Geburtstagsseite mit Geschenkauswahl und Glücksrad.

**Live:** https://mgtajo.github.io/theresa-birthday/

## Ablauf

1. **Hero** — Geburtstagsgruß.
2. **Schritt 1** — Theresa wählt eins von drei Geschenken.
3. **Schritt 2** — Sie dreht am Rad und gewinnt ein kleines Bonusgeschenk.
4. **Ergebnis** — Beide Geschenke werden angezeigt und per Formspree an
   hornstein.magnus@gmail.com gemailt.

Das Ergebnis liegt in `localStorage`. Ein Reload zeigt es wieder an und
verschickt **keine** zweite Mail.

## Die Geschenke eintragen

Alles Inhaltliche steht in **[`src/config/gifts.ts`](src/config/gifts.ts)** —
das ist die einzige Datei, die du anfassen musst.

- `MAIN_GIFTS` — genau drei Geschenke zur Auswahl (`title`, `tagline`,
  `description`, `emoji`, `accent`). `accent` ist `swim` (Türkis), `bike`
  (Amber) oder `run` (Rosé).
- `BONUS_GIFTS` — die Felder des Glücksrads. Vier bis zehn funktionieren,
  sechs oder acht sehen am besten aus. `label` bitte unter ~18 Zeichen, sonst
  wird es auf dem Rad eng. Mit `weight` lassen sich Chancen gewichten
  (`weight: 2` ist doppelt so wahrscheinlich wie `1`); ohne Angabe sind alle
  gleich wahrscheinlich.
- `AGE` — Zahl setzen, um im Hero einen Alters-Counter zu zeigen, sonst `null`.

Nach dem Bearbeiten committen und pushen — der Deploy läuft automatisch.

## Entwicklung

```bash
npm install
npm run dev
```

Produktions-Build lokal prüfen (die Seite läuft unter dem Unterpfad
`/theresa-birthday/`, deshalb ist `base` in `vite.config.ts` gesetzt):

```bash
npm run build && npm run preview
```

## Stack

- Vite + React 19 + TypeScript + Tailwind v4
- [React Bits](https://reactbits.dev) für Aurora-Hintergrund, SplitText,
  BlurText, GradientText, ShinyText, TextType, SpotlightCard, StarBorder,
  CircularText, AnimatedContent, ClickSpark, CountUp. Die Komponenten liegen
  als eigener Quellcode in `src/components/` — kein Paket-Dependency.
- Das Glücksrad in `src/components/Wheel.tsx` ist selbst gebaut (SVG +
  CSS-Transition), da React Bits kein Lotterierad hat.
- `canvas-confetti` für die Konfetti-Momente.

### Angepasste React-Bits-Komponenten

Zwei Komponenten blenden ihren Inhalt erst ein, wenn ein GSAP-ScrollTrigger
feuert. Da hier jede Stage auf einen Bildschirm passt und die Seite oft gar
nicht scrollbar ist, kann der Trigger ausbleiben — der Inhalt wäre dann
dauerhaft unsichtbar. Deshalb:

- `SplitText` hat eine `immediate`-Prop, die den ScrollTrigger überspringt.
- `AnimatedContent` spielt nach 120 ms selbst ab, wenn das Element ohnehin
  schon im Viewport steht.

## E-Mail

Formspree-Endpoint steht in `src/config/gifts.ts` (`FORMSPREE_ENDPOINT`).
Gesendet wird als JSON per `fetch` aus `src/lib/notify.ts` — kein echtes
Formular, weil Theresa nichts eintippt. Schlägt der Versand fehl, zeigt die
Seite einen Retry-Button und einen `mailto:`-Fallback.

Kostenloses Formspree-Kontingent: 50 Einsendungen pro Monat.
