# eileen-ui

Shared React component library for Eileen's experimental projects — buttons, sliders, inputs, color selectors, etc. One place to design and maintain them instead of duplicating across projects.

## Stack

- React (peer dependency — uses whatever React copy the consuming app already has)
- TypeScript
- Tailwind utility classes, compiled to a standalone `dist/style.css` at build time — consuming apps do **not** need Tailwind configured themselves, and version drift (e.g. Tailwind 3 vs 4) between this package and a consuming app doesn't matter.
- Bundled with [tsup](https://tsup.egoist.dev/) (ESM + CJS + `.d.ts`)

## Developing

```bash
npm install
npm run build       # one-off build (JS + CSS)
npm run dev          # tsup --watch, rebuilds JS on save
npm run typecheck
```

Add a new component under `src/components/<Name>/`, export it from that folder's `index.ts`, then re-export it from `src/index.ts`.

Theming today is minimal: a few CSS variables set on `:root` in `src/styles.css` (`--eileen-accent`, `--eileen-accent-fg`, `--eileen-radius`). Components reference them via Tailwind's arbitrary-value syntax (e.g. `bg-[var(--eileen-accent)]`) so a consuming project can override the look by redefining those variables on its own `:root` after importing the stylesheet.

## Using it in another project

This isn't published to npm — link it locally while iterating:

```bash
# in eileen-ui
npm run build
npm link

# in the consuming project
npm link eileen-ui
```

Then, once per app (e.g. root layout):

```ts
import 'eileen-ui/style.css';
```

And in components:

```tsx
import { Button } from 'eileen-ui';

<Button variant="outline" size="sm">Save</Button>
```

`npm link` only works on this machine, for local dev. Once a project is deployed (Vercel, etc.), swap the dependency for a real install source, e.g. a GitHub reference once this repo has a remote:

```json
"eileen-ui": "github:leeniemb/eileen-ui"
```

Either way, updating the shared library means bumping/reinstalling it in the consuming project — there's no live hot-reload across repos.

## Components

- `Button` — `variant`: `solid` | `outline` | `ghost`, `size`: `sm` | `md` | `lg`
