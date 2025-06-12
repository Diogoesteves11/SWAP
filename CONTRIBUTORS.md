# SWAP Developers Guide

This guide should help get you started developing with Vue 3 in Vite.

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Type Support for `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) to make the TypeScript language service aware of `.vue` types.

## Project Setup

### Clone the repository

```bash
git clone https://github.com/UMinho-ENGINF-IPM/trabalho-pr-tico-gp25_01.git
cd trabalho-pr-tico-gp25_01
```

### Install dependencies

Make sure you have [Node.js](https://nodejs.org/) installed (v22+ only).

```bash
npm install
```

### Available scripts

| Script               | Description                                                                                                                            |
| -------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| `npm run dev`        | Starts the Vite development server and runs your app at `localhost:5173`. Auto-reloads on changes.                                     |
| `npm run dev:server` | Starts `json-server` and watches `data/db.json`, serving API data at `localhost:3001`.                                                 |
| `npm run build`      | Runs type-checking (`vue-tsc`) and then builds the app using Vite. This ensures both code correctness and optimized production output. |
| `npm run preview`    | Serves the production build locally, great for testing the final app before deployment.                                                |
| `npm run build-only` | Runs only the Vite build process (without type-checking). Used internally by `build`.                                                  |
| `npm run type-check` | Uses `vue-tsc` to perform TypeScript type checking based on your `tsconfig.json`.                                                      |
| `npm run lint`       | Runs ESLint on the entire project and auto-fixes any issues it can.                                                                    |
| `npm run format`     | Formats your code using Prettier, specifically all files under `src/`.                                                                 |

> NOTE: Always use `npm run lint && npm run format` before submitting a Pull Request. PR checks are enabled and will fail if not used.

## Project Structure

This project follows the **Atomic Design** methodology to organize Vue components and promote scalability and maintainability.

```
src/
│
├── assets/                # Static assets like images or global styles
├── components/            # Atomic Design components
│   ├── atoms/             # Basic UI elements (buttons, inputs, icons)
│   ├── molecules/         # Combinations of atoms (form fields, cards)
│   ├── organisms/         # Complex reusable sections (navbars, modals)
│   └── templates/         # Layout structures with slots
│
├── pages/                 # Route-level views (uses templates + logic)
├── router/                # Vue Router setup (if used)
├── services/              # API logic, e.g. Axios calls
├── store/                 # Global state (Pinia)
├── composables/           # Reusable logic (custom hooks)
├── types/                 # TypeScript interfaces/types
├── utils/                 # Utility functions/helpers
├── App.vue                # Root component
└── main.ts                # Entry point
```

## Atomic Design Principles

- **Atoms**: Basic building blocks (e.g. form labels, inputs, buttons)
- **Molecules**: Simple groups of UI elements (e.g. search forms)
- **Organisms**: Complex components made of molecules/atoms (e.g. headers)
- **Templates**: Define layout and structure, use `<slot>`s for flexibility.
- **Pages**: Fetch data, use logic/composables, and inject content into templates.

For more detailed information about the atomic design, read this [guide](https://medium.com/@kevinkurniawan97/atomic-design-with-vue-fa1b50a1251e).

## Making changes

Everytime you want to make changes, create a new branch with. Make your changes, then commit them using git. Push your branch and open a PR to be reviewd.
