# Clyveris analytics plan

## Principles

Instrument only product behavior needed to measure the approved KPIs. Do not send source URLs, article titles, editorial text, free-form user input, IP addresses, or persistent personal identifiers. Analytics stays disabled until a provider and consent approach are approved.

## Event taxonomy

| Event | When it fires | Properties |
| --- | --- | --- |
| `desk_viewed` | Desk route becomes visible | `desk_date`, `item_count` |
| `signal_opened` | Reader opens a detail route | `signal_id`, `category`, `position` |
| `source_opened` | Reader opens the original source | `signal_id`, `publisher` |
| `signal_saved` | Reader saves a signal | `signal_id`, `category` |
| `signal_unsaved` | Reader removes a save | `signal_id`, `category` |
| `filter_applied` | Reader changes a desk filter | `filter_type`, `filter_value`, `visible_count` |
| `empty_state_seen` | A filter produces zero signals | `filter_type` |

`signal_id` is an internal opaque content ID, not a user identifier. Session IDs, if ever used, must be short-lived and consented to.

## KPI definitions

| KPI | Definition | Source event |
| --- | --- | --- |
| Weekly active readers | Distinct consented sessions with `desk_viewed` in a seven-day window | `desk_viewed` |
| Signal open rate | `signal_opened` divided by `desk_viewed` | `signal_opened`, `desk_viewed` |
| Saves per active reader | `signal_saved` divided by weekly active readers | `signal_saved`, `desk_viewed` |
| Verified-source coverage | Published signals with valid source URL divided by all published signals | editorial content validation |
| Discovery-to-publication time | `published_at - discovered_at` per signal | future editor workflow |

## Dashboard specification

The internal dashboard, deferred with the analytics vendor, has three sections:

1. Engagement, weekly active readers, open rate, saves per reader.
2. Content, opens and saves by category and publisher.
3. Quality, verified-source coverage and discovery-to-publication time.

Daily aggregates are sufficient for MVP. No onchain metrics apply because Clyveris has no blockchain feature.
