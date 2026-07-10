# Clyveris Demo Video Plan

## Specs

- Duration target: 2:45 to 3:15 (hard cap is 5:00, do not use it all)
- Style: screen recording + voiceover + burned-in captions
- Tone: calm, editorial, founder-showing-a-friend. No hype words.
- Visual direction: the product's own paper-and-ink look does the work. Simple cuts, no flashy transitions.
- Tools: Recordly (recordly.dev) for the screen capture, CapCut Desktop for voiceover, captions, and export.

## Scene-by-scene script

### Scene 1 — The live product (0:00 - 0:20)

- Visual: clyveris.vercel.app loads fresh. Splash plays ("Clearer signals, better rooms."), hero reveals over the morning-paper photo. Slow scroll to the caption bar.
- Voiceover: "This is Clyveris. It's a signal desk with one rule: every claim keeps its receipt. The original source, the editorial take, and one decision question, always kept separate."
- Caption: Research with receipts.

### Scene 2 — A signal up close (0:20 - 0:50)

- Visual: click Open the desk, then open "The cost of waiting has changed shape." Pause on the three sections: what the source says, the Clyveris take, the decision question. Hover the original-source link so the Gartner URL is visible.
- Voiceover: "Here's what that looks like. The source facts are quoted and linked, you can go check them yourself. The take is labelled as opinion. And it ends with a question a team can actually decide on. Facts never blur into opinion."
- Caption: Source facts. Editorial take. One decision question.

### Scene 3 — Try it with no wallet (0:50 - 1:25)

- Visual: back on the landing page, scroll to "Run a research brief right now." Click the example chip "The cost of waiting on a decision", the covered deliverable renders. Then type "quantum submarine logistics", run it, the no-coverage result renders. Pause on the honesty line.
- Voiceover: "You can try the research engine right now, no wallet needed. This runs the agent's real matching code on the real corpus, in the browser. And watch what happens when I ask for something it can't verify. It says so. It never invents a citation. That honesty is the product."
- Caption: Real pipeline. Honest no-coverage.

### Scene 4 — The paid agent, live on CROO (1:25 - 1:50)

- Visual: click "Hire Clyveris on CROO". The Agent Store listing loads: LIVE status, Clyveris Research Brief service, $0.10 price, SLA, schema.
- Voiceover: "The same engine is a paid agent on the CROO Agent Store. Other agents, or people, send it a brief and pay in USDC. It's live right now, listed and callable."
- Caption: Live on the CROO Agent Store.

### Scene 5 — A real order, settled on-chain (1:50 - 2:40)

- Visual: split attention between the Navigator order flow and the agent's terminal. Submit the prepared brief. Terminal shows: negotiation received, order created awaiting payment, then OrderPaid, then "delivered order ... covered". Open BaseScan on the payment tx, pause on it.
- Voiceover: "Here's a real order, end to end. The agent validates the brief and accepts. Payment settles on Base, and only after the chain confirms does it deliver. There it is on BaseScan. No payment, no delivery, the state machine won't allow it."
- Caption: Paid in USDC. Settled on Base. Delivered after confirmation.
- Recording note: this scene needs the funded Navigator balance and the agent online. Capture the terminal at a readable font size (16px+).

### Scene 6 — Under the hood (2:40 - 3:00)

- Visual: the GitHub README, scroll slowly past the architecture diagram, then the "CAP SDK surface used" section so the method names are on screen: connectWebSocket, getNegotiation, acceptNegotiation, rejectNegotiation, getOrder, deliverOrder, rejectOrder.
- Voiceover: "It's all open source, MIT licensed, with CI and twenty-five tests. The CAP integration uses the official SDK: connect, negotiate, accept or reject, then deliver only after OrderPaid."
- Caption: Open source. 25 tests. Full CAP lifecycle.

### Scene 7 — End card (3:00 - 3:10)

- Visual: static end card. Clyveris mark, then three lines: clyveris.vercel.app, github.com/mystiquemide/clyveris, agent.croo.network listing.
- Voiceover: "Clyveris. Research with receipts."
- Caption: clyveris.vercel.app · github.com/mystiquemide/clyveris

## Recording checklist

Before:
- [ ] Fresh Chrome profile, no extensions visible, no bookmarks bar, 1920x1080.
- [ ] Agent running (`npm run agent` locally or Railway logs open) with terminal font at 16px+.
- [ ] Navigator balance funded (done, 0.3 USDC on Base) and the order form ready.
- [ ] BaseScan tab pre-loaded for the payment address so lookup is instant.
- [ ] Mic test, quiet room, phone silenced.
- [ ] Close anything with notifications. Hide the dev "N issues" badge by recording production, not localhost.

During:
- [ ] Move the cursor slowly, pause two beats on anything the voiceover names.
- [ ] Let the splash and reveals finish before talking over them.
- [ ] If the order flow stumbles (CROO outage), stop and re-record the scene, don't narrate around a broken take.

After:
- [ ] Trim dead air, keep total under 3:30.
- [ ] Auto-captions in CapCut, then fix names: Clyveris, CROO, USDC, BaseScan.
- [ ] Normalize voice, duck any background track under the voiceover.
- [ ] Export 1080p MP4, H.264. Watch it once start to finish before uploading.

## Production notes

- Captions: white text on a black 70% pill, bottom center, matching the site's mono-caption feel.
- Transitions: hard cuts only.
- The end card can be made from the lockup SVG (`public/clyveris-lockup.svg`) on the paper background.
- Scene 5 is the judging money-shot. If time runs over, cut Scene 2 to 15 seconds, never cut Scene 5.
