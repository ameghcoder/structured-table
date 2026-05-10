# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

**Structured Table** is a headless, SSR-friendly table engine for React and modern web applications. It defines a **Structured Table Language (STL)** — a string format for declaring tables — and provides a parser, type system, and renderer registration mechanism. Framework-specific renderers (React, Vue) are distributed via a CLI that scaffolds them directly into user projects.

## Monorepo Structure

This is a **pnpm + Turbo** monorepo:

```
packages/
  structured-table/       # Core engine: STL parser, types, renderer registry
  structured-table-cli/   # CLI tool: stl-cli add <renderer>
apps/
  web/                    # Next.js 16 documentation site + playground
registry/
  react/, vue/            # Renderer template files fetched by the CLI
```

## Commands

### Root (run from repo root)

```sh
pnpm install              # Install all workspace dependencies
pnpm dev                  # Run all packages in watch/dev mode via Turbo
pnpm build                # Build all packages via Turbo
pnpm clean                # Remove all node_modules, dist, and lock files
```

### Filtered (target a specific workspace)

```sh
pnpm dev --filter web                      # Start docs site only
pnpm dev --filter structured-table         # Watch-build core package
pnpm build --filter structured-table       # Build core package
pnpm build --filter structured-table-cli   # Build CLI
```

### Inside a package

```sh
# packages/structured-table
pnpm build    # tsup (CJS + ESM output → dist/)
pnpm dev      # tsup --watch
pnpm clean    # rm -rf dist

# packages/structured-table-cli
pnpm build    # tsc
pnpm dev      # tsc && node dist/cli.js
pnpm start    # node dist/cli.js

# apps/web
pnpm dev      # next dev
pnpm build    # next build
pnpm lint     # eslint
```

> There are no test files in the repo currently.

## Architecture

### STL (Structured Table Language)

STL is a string-based format parsed by `packages/structured-table/src/core/parser/parse-table.ts` into a `SanityTable` object. The reverse is `stringify-table.ts`. The regex patterns in `src/core/regex/` define the syntax rules (cell separators, key=value options like `align`, `colspan`, `rowspan`, `type`).

### Core Package (`packages/structured-table`)

- **Entry**: `src/index.ts` — exports `parseTable`, `stringifyTable`, all types, and `registerRenderer`/`getRenderer`
- **Parser** (`src/core/parser/`): STL string ↔ `SanityTable` conversions
- **Types** (`src/core/types/`): `SanityTable`, `TableRow`, `TableCell` (variants: `TextCell`, `LinkCell`, `ButtonCell`), `cellType` ("header" | "data")
- **Register** (`src/core/register/`): A global map for registering framework-specific renderers by `kind` string (e.g., `"react"`)
- **Errors** (`src/core/errors/`): Shared error utilities

Build produces dual CJS/ESM output via **tsup** (`tsup.config.ts`). Source maps and `.d.ts` files are included.

### CLI Package (`packages/structured-table-cli`)

The CLI (`stl-cli add <renderer>`) fetches renderer templates from the GitHub registry and installs them into user projects. Flow in `src/commands/add.ts`:

1. Parse renderer name/version from input
2. Fetch `registry/supported.json` from GitHub
3. Detect the user's project framework and package manager
4. Download renderer files from `registry/<framework>/v<n>/`
5. Run package manager install for renderer dependencies

Registry config in `src/config/registry.ts` points to `ameghcoder/structured-table` on GitHub.

### Registry (`/registry`)

Stores renderer templates for the CLI to fetch. Each renderer has:
- `meta.json` — name, version, file list, dependencies, peer constraints
- Versioned directories (`v1/`, `v2/`) with component files and a `style.css`

### Docs App (`apps/web`)

Next.js 16 App Router site with:
- `src/app/docs/` — MDX/TSX documentation pages organized by topic (stl-syntax, stl-renderer, integration)
- `src/app/playground/` — Interactive STL editor
- `src/components/stl-render-react/` — React renderer used inline in the docs
- Uses **Tailwind CSS 4**, **shadcn/ui** (new-york style), and **React Compiler** (babel plugin in `next.config.ts`)

## Key Conventions

- **Headless design**: The core package has zero UI. Rendering is delegated to registered framework renderers.
- **Dual module output**: Core package ships both `index.cjs` and `index.js` (ESM). Always ensure `tsup.config.ts` keeps both formats.
- **Registry is source of truth for renderers**: CLI fetches from `registry/` on `main` branch. Changes to renderer files in `registry/` are immediately live for CLI users.
- **Turbo task ordering**: `build` tasks declare upstream dependencies in `turbo.json`. The web app depends on both packages being built first.
