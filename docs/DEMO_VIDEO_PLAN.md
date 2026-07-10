# Clyveris Two-Minute Demo Script

## Specs

- Duration: 2:00
- Structure: problem -> solution -> walkthrough -> sponsor integration -> why it matters
- Format: screen recording, founder voiceover, burned-in captions
- Tone: calm, direct, factual
- Export: 1920x1080, H.264 MP4, captions checked by hand

## Scene 1: Problem, 0:00 to 0:15

Visual: Open on the live Clyveris desk. Scroll past the three signal headlines and pause on one original-source link.

Voiceover: "Teams don't lack information. They lack a clean line between what a source actually says, what someone thinks it means, and what decision follows. Most feeds blur those together, so confident-looking summaries become hard to trust."

Caption: The problem: information without a clean evidence trail.

## Scene 2: Solution, 0:15 to 0:30

Visual: Open a signal detail page and frame the three sections together: What the source says, Clyveris take, and Decision question.

Voiceover: "Clyveris keeps that line visible. Every brief carries the publisher, source URL, real publication date, source facts, a separate editorial take, and one decision question. When the corpus has no evidence, it returns no coverage instead of making something up."

Caption: Source facts. Separate take. One decision question.

## Scene 3: Walkthrough, 0:30 to 1:10

Visual: Return to the landing page. Run the covered example, pause on its source and date, then run Quantum submarine logistics and pause on the no-coverage result. Open the dashboard and one full signal.

Voiceover: "This sample runner uses the same matching pipeline as the paid agent. I start with a covered question, and it returns a structured brief with sources I can open and check. Now I ask about quantum submarine logistics. There is nothing verified in the three-source corpus, so Clyveris says no coverage. The desk uses the same data model. Facts stay in one section, interpretation stays in another, and the decision question stays visible."

Caption: Real pipeline. Real sources. Honest no-coverage.

## Scene 4: Sponsor integration, 1:10 to 1:45

Visual: Open the live Clyveris listing on the CROO Agent Store. Show the $0.10 Research Brief service. Submit the prepared Navigator order while Railway logs are visible. Pause on the payment and delivery transaction pages on BaseScan.

Voiceover: "Clyveris is also a paid agent on CROO. The provider uses the official CAP SDK to connect, read a negotiation, validate the brief, and accept or reject it. A delivery can only start after the OrderPaid event. This order pays in USDC on Base, the agent runs the brief, and deliverOrder settles the result on-chain. These are the real payment and delivery transactions."

Caption: CROO CAP. USDC on Base. Delivery after OrderPaid.

Recording requirement: Show the real payment and delivery transaction hashes from the completed order. Don't use placeholders or a staged terminal output.

## Scene 5: Why it matters, 1:45 to 2:00

Visual: Show the GitHub README architecture diagram, the 30 passing tests, and the end card with the live site, repository, and Agent Store listing.

Voiceover: "The result is research an agent or a person can verify before acting. The code is public, the payment gate is tested, and weak coverage stays visible. Clyveris turns a source into a decision without hiding the distance between them."

Caption: Research with receipts.

## Recording checklist

Before recording:

- Confirm the production site and CROO listing load in a clean browser profile.
- Confirm Railway shows the current commit online.
- Complete one real paid order and keep both BaseScan transaction pages ready.
- Set the terminal font to at least 16 pixels and hide secrets, bookmarks, notifications, and unrelated tabs.
- Record at 1920x1080 with the browser zoom at 100 percent.

During recording:

- Keep each claim visible while it is spoken.
- Pause on the source URL, publication date, no-coverage result, OrderPaid log, and both transaction hashes.
- Move the cursor slowly and restart a scene if CROO or the network stalls.
- Keep the final spoken cut at two minutes or less.

After recording:

- Remove dead air and failed clicks.
- Burn in captions, then correct Clyveris, CROO, CAP, USDC, BaseScan, and OrderPaid by hand.
- Normalize voice audio and keep any music below the narration.
- Watch the final export once from start to finish before uploading.

## End card

- clyveris.vercel.app
- github.com/mystiquemide/clyveris
- agent.croo.network/agents/1298c200-e1f7-48d3-a154-4cee6c8f8df1