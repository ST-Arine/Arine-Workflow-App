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
