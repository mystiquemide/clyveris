> Historical planning document. It describes the pre-CAP desk MVP and isn't the current deployment source of truth. Use [README.md](../README.md), [HANDOFF.md](../HANDOFF.md), and [memory.md](../memory.md) for the live Clyveris architecture and status.

# Clyveris design specification

## Design system

| Token | Value | Use |
| --- | --- | --- |
| Paper | `#f4f3ed` | page background |
| Ink | `#151713` | primary text and controls |
| Muted | `#65685e` | secondary text |
| Line | `#c7c9bc` | borders |
| Croo | `#426b35` | active state and primary action |
| Croo dark | `#25441e` | primary action hover |
| Sans | Geist | headings and body |
| Mono | Geist Mono | labels, metadata, navigation |

Use a 4px spacing base. Main section spacing is 64px on desktop, 40px on tablet, and 24px on mobile. Corners remain square. Shadows are not used. Borders carry structure.

## Components

| Component | Props | States |
| --- | --- | --- |
| `SignalCard` | signal, saved | default, hover, focus-visible, saved |
| `SignalFilter` | categories, selected, onChange | default, active, hover, focus-visible, disabled |
| `SaveButton` | saved, onToggle | unsaved, saved, loading, storage-unavailable |
| `SourceEvidence` | publisher, url, date, facts | default, missing-author |
| `EditorialTake` | take, decisionQuestion | default |
| `EmptyDesk` | filter label | default and reset action |

All buttons must have visible focus rings, 44px minimum touch targets, and text alternatives where an icon stands alone. Icons never carry meaning without an accessible label.

## Screen specs

### Landing page

Keep the existing three-column editorial composition. The primary action opens `/dashboard`. The brief cards use links when content exists, not decorative arrows.

### Desk

Desktop uses the existing sidebar and reading column. The desk header shows date, selected-item count, and filters. Filters are buttons with `aria-pressed`. Cards show category, title, summary, publisher, source date, and save action. A no-results state explains the active filter and provides a reset button.

### Signal detail

The top section shows category, title, source publisher, source date, and outbound original-source link. Then render two explicitly labeled blocks, `What the source says` and `Clyveris take`. Finish with tags and a `Decision question` panel. The source link opens in a new tab with safe link attributes.

## Flows

### Reader flow

1. Open the desk from the landing page.
2. Scan selected cards.
3. Filter by category or saved status.
4. Open a signal detail page.
5. Review source facts before the editorial take.
6. Save the signal for the current browser session.

### Editor flow, deferred

1. Enter a source URL.
2. Record verifiable source facts.
3. Write the editorial take and decision question.
4. Preview and publish to a desk.

## Responsive rules

- Mobile, 320px to 639px: one column, filters wrap, metadata stacks, buttons remain 44px tall.
- Tablet, 640px to 1023px: content max width remains readable and grid cards may use two columns.
- Desktop, 1024px and above: fixed 220px desk sidebar and flexible reading column.
- Respect `prefers-reduced-motion`. Hover transforms become no-motion state changes for reduced motion users.
