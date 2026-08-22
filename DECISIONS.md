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