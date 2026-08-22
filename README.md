# HSP-1 Rebuild — The Form Nobody Can Finish

Brite Spark 2026 · Problem 4 · Product / Accessibility

A rebuild of the four worst-abandoning pages of the Calder County
Household Support application (form HSP-1), chosen from the abandonment
data and rebuilt for two applicant personas — one on a phone with no
saved documents to hand, one using a screen reader with no mouse.

## Run it

No build step, no dependencies to run the form itself.

1. Clone this repository.
2. Open `index.html` in a browser — either double-click the file, or
   serve the folder locally (e.g. VS Code's "Live Server" extension,
   or `python3 -m http.server` from the project root).
3. Click **Start application** and go through the flow.

That's it. Everything runs client-side; there is no backend and nothing
is submitted anywhere.

## What's here

- `index.html` — landing page: what to expect, what documents to have
  ready, and resume detection if you've started before.
- `pages/page-1.html` — Applicant details (rebuilt: original step 1)
- `pages/page-3.html` — Household composition (rebuilt: original step 3)
- `pages/page-4.html` — Income (rebuilt: original step 4)
- `pages/page-5.html` — Capital and resources (rebuilt: original step 5)
- `storage.js` — save-and-resume logic (`localStorage`, no backend)
- `styles.css` — shared styling for all pages
- `accessibility-reports/` — pa11y (WCAG 2.2 AA) scan output for all
  four rebuilt pages, zero issues
- `PLAIN-LANGUAGE.md` — five worst questions from the original form,
  original vs. rewrite, with reasoning
- `DECISIONS.md` — what was chosen, cut, and why

## Why these four pages

Pages 3, 4, 5, and 1 were rebuilt, in that order of severity — see
`DECISIONS.md` for the full reasoning against the abandonment data.
Pages 2, 6, 7, and 8 are unchanged from the original and out of scope.

## Testing accessibility

Automated: pa11y, WCAG 2.2 AA ruleset, run against all four pages —
reports in `accessibility-reports/`. Zero issues found. As the brief
notes, automated tooling catches roughly a third of real problems;
manual screen-reader testing is noted as a next step in `DECISIONS.md`.

## What this doesn't do

- No backend — save/resume is local to the browser via `localStorage`,
  not synced to a server. This is explicitly allowed by the brief.
- Pages 2, 6, 7, 8 are untouched — not chosen as the worst pages,
  rebuilding them was out of scope for the time available.
- No authentication, per the brief's "not required" list.