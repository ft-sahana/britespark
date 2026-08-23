## Stack: plain HTML/CSS/JS, no framework

Going with plain HTML/CSS/JS instead of React. Accessibility depends on
correct HTML, not on the framework — so React adds setup risk (build step,
npm install) without an accessibility payoff. Field definitions live in a
JS config object rather than hardcoded per page, so the day-two change can
be handled by editing data instead of rewriting markup.

## Page 3
I simplified the "if yes, give details" field to always-visible-but-optional rather than conditionally showing/hiding it — a hide/show toggle done wrong is an accessibility risk of its own (content appearing with no announcement), and getting it right needs more time than this page currently has budget for. Worth flagging as a "would fix next" item rather than silently deciding it.

## Accessibility testing

Ran pa11y (WCAG 2.2 AA ruleset) against all 4 rebuilt pages — zero
automated issues on each, saved in accessibility-reports/. This is the
floor, not the finish line: pa11y catches roughly a third of real
problems. Still to do — testing with an actual screen reader (NVDA or
VoiceOver) rather than only the automated checker, since that's where
issues like confusing focus order or unclear reading order actually
surface.

#### Day-two change: Legal Services directive LS-2026/04

Added two mandatory fields: ID verification (applicant + household
members 16+) and prior assistance elsewhere (household-level, last 24
months). Real constraint: any drop in HSP-1's 21.8% completion rate
counts as failed implementation, not an acceptable tradeoff.

- Applicant ID on page-1, household ID + prior-assistance question on
  page-3, extending the existing per-person field structure.
- Reversed an earlier decision to avoid conditional show/hide: ID
  fields now appear only once a person's DOB shows 16+, so children
  never see them and the worst-abandonment page doesn't get longer for
  no reason. Content stays in normal DOM order, no focus stolen.
- Only jurisdiction is required for prior assistance; program name and
  dates stay optional — forcing exact recall of someone else's claim
  risks blocking completion over the hardest-to-answer detail.
- Found and fixed a real bug while wiring this: dynamically added
  person cards on page-3 weren't wired for save/resume at all, so
  Person 2+ was silently not saving. Refactored storage.js to fix it.
- Not implemented: backend routing for "supervisor referral" — no
  backend exists in this rebuild, only the reason is captured.