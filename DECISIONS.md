## Stack: plain HTML/CSS/JS, no framework

Going with plain HTML/CSS/JS instead of React. Accessibility depends on
correct HTML, not on the framework — so React adds setup risk (build step,
npm install) without an accessibility payoff. Field definitions live in a
JS config object rather than hardcoded per page, so the day-two change can
be handled by editing data instead of rewriting markup.

## Page 3
I simplified the "if yes, give details" field to always-visible-but-optional rather than conditionally showing/hiding it — a hide/show toggle done wrong is an accessibility risk of its own (content appearing with no announcement), and getting it right needs more time than this page currently has budget for. Worth flagging as a "would fix next" item rather than silently deciding it.