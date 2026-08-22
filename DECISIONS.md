## Stack: plain HTML/CSS/JS, no framework

Going with plain HTML/CSS/JS instead of React. Accessibility depends on
correct HTML, not on the framework — so React adds setup risk (build step,
npm install) without an accessibility payoff. Field definitions live in a
JS config object rather than hardcoded per page, so the day-two change can
be handled by editing data instead of rewriting markup.