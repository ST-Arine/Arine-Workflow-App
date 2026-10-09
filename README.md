# Arine Workflow App

Internal demo/prototype of the Workflow Assistant. All data is mock.

```bash
npm install
npm run dev      # local dev server
npm run build    # production build into dist/
npm run lint     # static checks
```

## Layout

- `src/theme.js` — design tokens
- `src/data/mock.js` — mock queue, call script, admin data
- `src/components/` — shared UI (icons, buttons, menus, top bar)
- `src/screens/` — one file per workflow step, plus the manager admin shell
- `src/WorkflowAssistant.jsx` — top-level state machine wiring the steps together

## UI conventions

- **Buttons:** when a primary and secondary button appear together, they sit side by side with the secondary on the left and the primary directly to its right. Secondary buttons match the primary's shape but are outline-only with no fill (`<GhostButton large>`). Don't spread them to opposite edges of the page.

## Demo users

The profile menu (bottom-left of the nav) has a **Switch user** list that is identical in every view, including the manager view:

- **Dana - patient flow** — patient, pharmacy and patient-flag engagements (single-patient calls).
- **Jordan - provider flow** — a provider call (Dr. Lee) covering three patients. Observations and follow-ups each belong to a patient, are grouped by patient in Review and Fax, and can be re-assigned before anything is sent. Items the system is unsure about must have their patient confirmed before they can be approved.
- **Sally - manager/lead view** — the admin view. Switching between a caller and the manager keeps the caller's in-progress engagement; switching to a different caller starts fresh.
