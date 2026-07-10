# Clyveris Design System

Extracted from the live site at clyveris.vercel.app. The system is editorial-premium: full-bleed photography, one grotesk family at two extremes (display and mono microcopy), a paper-and-ink palette with a single green accent, and soft 24 to 40px radii on every surface.

## Design strategy

Photography carries the emotion, type carries the hierarchy, and color stays out of the way. Light paper sections alternate with dark ink panels for rhythm. Motion is calm and one-directional: things fade up once and stay put.

## Color system

| Token | Value | Usage |
| --- | --- | --- |
| `--paper` / `--background` | `#f0efe9` | Page background, splash overlay |
| `--ink` / `--foreground` | `#151713` | Body text, dark panels, footer card, primary buttons |
| `--card` | `#e4e3da` | Method feature cards |
| `--line` | `#c7c9bc` | All borders and dividers |
| `--muted` | `#65685e` | Secondary text, card copy |
| `--ghost` | `#d3d2c6` | Oversized footer ghost headline |
| `--croo` | `#426b35` | Accent: kickers, hover states, selection, take bar |
| `--croo-dark` | `#25441e` | Accent hover depth |
| White / overlays | `#fff`, `black/20-55`, `white/5-25` | Photo scrims, glass cards, pill nav |

Rules: never more than one accent hue. Scrims are flat translucent black, no gradients anywhere. Dark panels use white text at 100/70/60/40 opacity steps.

## Typography

| Role | Font | Size | Weight | Tracking |
| --- | --- | --- | --- | --- |
| Hero display | Geist Sans | `clamp(3.2rem, 8.5vw, 7.5rem)`, leading 0.9 | 600 | -0.05em |
| Section display | Geist Sans | `clamp(2.6rem, 6vw, 5.5rem)`, leading 0.95 | 600 | -0.05em |
| H2 | Geist Sans | 2.25 to 3.75rem | 600 | -0.045em |
| Card title | Geist Sans | 1.25rem | 600 | -0.03em |
| Body | Geist Sans | 1rem to 1.125rem, leading 6 to 7 | 400 | normal |
| Kicker / label | Geist Mono | 10 to 11px uppercase | 400 to 700 | +0.12 to +0.2em |
| Wordmark | Geist Mono | 0.875 to 1.125rem | 700 | -0.08em |

The tension between huge tight-tracked display type and tiny wide-tracked mono labels is the identity. No serifs, no italics.

## Layout and spacing

- Max content width `1440px`, page gutter `px-4` to `px-8`.
- Full-bleed hero at `min-h-[94vh]`, content justified to the bottom.
- Sections breathe with `py-16` to `py-28`. Card interiors use `p-6` to `p-8` with a deliberate `mt-24` gap between icon and title.
- Grids: 3-column method cards (`md:grid-cols-3`), 1.1fr/1fr split in the agent panel, 1.4fr/1fr/1fr footer columns.

## Radii

| Element | Radius |
| --- | --- |
| Photo and dark section shells | `rounded-[40px]` |
| Footer card | `rounded-[32px]` |
| Feature and glass cards | `rounded-3xl` (24px) |
| Overlay bars | `rounded-2xl` (16px) |
| Nav, buttons, caption bar | `rounded-full` |

## Components

| Component | Recipe |
| --- | --- |
| Pill nav | Fixed top-center, `bg-white/90 backdrop-blur rounded-full shadow-lg shadow-black/5`, mono links, ink pill CTA |
| Primary CTA | `rounded-full px-5 py-3` mono 11px uppercase, `hover:scale-[1.04] active:scale-95`, ink-on-white or white-on-ink, hover flips to `--croo` |
| Secondary CTA | Same shape, `border border-white/25` ghost on dark |
| Feature card | `bg-[var(--card)] rounded-3xl p-8`, Lucide icon 26px, `mt-24` before title, muted copy |
| Glass card | `bg-white/5 border border-white/15 backdrop-blur rounded-3xl`, mono 12px content |
| Caption bar | `rounded-full bg-black/55 backdrop-blur` strip pinned to hero bottom with inline white CTA |
| Signal row | `grid md:grid-cols-[80px_1fr_auto] py-8 divide-y`, mono index, hover underline + arrow translate |
| 404 / empty states | Centered kicker + display headline + one action |

## Motion

| Pattern | Spec |
| --- | --- |
| Reveal | opacity 0 / translateY(28px) to rest, 0.9s `cubic-bezier(0.22,1,0.36,1)`, staggered 100 to 150ms, fires once via IntersectionObserver at 0.15 threshold |
| Word reveal | Children at opacity 0.16, fade to 1 with 60ms per-word delay when the block reveals |
| Bar fill | scaleX(0) to 1, 1.4s same easing, 0.3s delay |
| Splash | Paper overlay, text fades in 1.8s, panel exits upward 0.7s `cubic-bezier(0.76,0,0.24,1)` at 1.9s |
| Hover | Buttons scale 1.04, arrows translate diagonally, colors flip to accent, all 300ms |
| Accessibility | Everything collapses to static under `prefers-reduced-motion` |

## Tailwind theme snippet

```js
colors: {
  paper: "#f0efe9",
  ink: "#151713",
  card: "#e4e3da",
  line: "#c7c9bc",
  muted: "#65685e",
  ghost: "#d3d2c6",
  croo: { DEFAULT: "#426b35", dark: "#25441e" },
}
```

## Do not

- Add a second accent color or any gradient.
- Use serif or italic type.
- Put content on the open canvas without a radius language: everything sits in pills, cards, or full-bleed rounded shells.
- Animate anything twice. Reveals fire once and rest.
