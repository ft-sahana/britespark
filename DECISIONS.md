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

  #### Why these four pages

Chose pages 1, 3, 4, and 5, ranked by abandonment rate from the data
pack: Household Composition (page 3, 36% abandonment, 383 session
timeouts — by far the worst), Income (page 4, 31%), Capital and
Resources (page 5, 20%), and Applicant Details (page 1, 11% — lower
abandonment but the very first page, so it sets whether an applicant
trusts the rest of the form at all). Page 2 (11%) was close to page 1
but page 1 was prioritized as the first-impression page, and the persona
notes call out "Client Identifier" on page 1 specifically as a point
where Denise assumes she's in the wrong place entirely. Pages 2, 6, 7,
8 were left unchanged — out of scope given the time available, and
none scored as badly as the four chosen.

## Changes made specifically for the screen-reader persona

Distinguishing what was done for Raymond specifically, separate from
changes aimed at general usability or at Denise's phone/time-pressure
situation:

- Every field has a real `<label for>` and every radio/checkbox group
  a `<fieldset>/<legend>` — without this, a screen reader announces
  loose, ungrouped controls with no relationship between them.
- The error summary gets programmatic focus (`tabindex="-1"` +
  `.focus()`) on submit, so it's announced immediately rather than
  requiring Raymond to hunt for what went wrong. Each error links to
  and focuses its field directly.
- The original "Continue" control was an unfocusable `<span
  onclick>`— replaced with a real `<button>` on every page, since a
  non-native control isn't reachable by keyboard/screen reader
  navigation at all.
- Conditional reveals (the "no ID document" reason field, the
  age-gated identity fields on page 3) keep new content in normal DOM
  order and never move focus — this matches the documented accessible
  pattern (e.g. GOV.UK's reveal component) rather than an assumption
  that it would work.
- `aria-required="true"` on every required field, not just a visual
  red asterisk, which conveys nothing to a screen reader on its own.

Changes made for Denise (mobile, time-pressured, no documents to hand)
rather than for Raymond specifically: the person-card layout replacing
the 6-column table, plain-language rewrites, save-and-resume, and the
landing page's document checklist. These help Raymond too, but they
were not designed around screen-reader use specifically the way the
items above were.

#### Manual screen-reader testing (VoiceOver, Safari, macOS)

pa11y reported zero issues on all four rebuilt pages. Testing with
actual VoiceOver found three real problems it couldn't see:

1. **`role="alert"` on the error summary broke its own links.** ARIA
   guidance is explicit that alert regions shouldn't contain
   interactive content — VoiceOver announced "There's a problem"
   correctly but then read every error link as flat text, not as a
   link. Fixed by switching to `role="region"` with
   `aria-labelledby`, which keeps native link semantics on the error
   list while still being focusable and readable.

2. **Focus moved before the DOM update registered.** `summary.hidden =
   false` immediately followed by `summary.focus()` in the same tick
   sometimes fired before Safari's accessibility tree caught up, so
   nothing was announced. Fixed by deferring the focus call one tick
   with `setTimeout(() => summary.focus(), 0)`.

3. **The error list required manual navigation to hear the count.**
   Not a bug exactly — a screen reader correctly reads interactive
   lists item by item rather than bulk-reading them, which is the
   right behavior. But it meant no immediate sense of "how many
   errors." Added a visually-hidden `aria-live="assertive"` line that
   announces "There are N errors below" the instant the summary
   appears, without changing how the visible list itself works.

Also simplified the error links themselves: removed a custom
`click`-handler-plus-`.focus()` script in favor of plain
`href="#field-id"` — per the HTML spec, navigating to a fragment
matching a focusable element's id moves keyboard focus there natively,
which turned out to be more reliable under VoiceOver than the scripted
version.

None of this would have surfaced from the automated scan alone — this
is the gap between "passes the tool" and "usable by ear" the problem
brief describes.