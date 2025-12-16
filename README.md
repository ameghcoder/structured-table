# Structured Table Project

![STL Banner](./apps/web/public/assets/banner/STL.webp "STL Banner")

> **Structured, themeable, SSR-friendly tables for React and modern web applications.**

## Overview

**Structured Table** is a powerful toolkit designed to revolutionize how tables are built and managed in modern web development. Unlike traditional table libraries that lock you into specific styles or heavy dependencies, Structured Table separates the **core data logic** from the **visual presentation**. It provides a robust "Structured Table Language" (STL) to define data, while allowing you to render pixel-perfect, themeable UIs.

Designed with **Server-Side Rendering (SSR)** and **CMS integration** (specifically Sanity) in mind, it ensures that your tables are not only beautiful but also performant and SEO-friendly.

## Key Features

- 🧩 **Headless Architecture**: The core logic is decoupled from the UI, giving you complete control over the look and feel.
- 🚀 **CLI-Driven Component System**: Similar to modern UI libraries (like shadcn/ui), use our CLI to scaffold fully customizable table components directly into your codebase. You own the code.
- ⚡ **SSR & Server Components**: Built for the modern web. Fully compatible with Next.js App Router and React Server Components.
- 🎨 **Themeable & Dynamic**: Easily style your tables with CSS variables, Tailwind, or any styling solution you prefer.
- 🔌 **CMS First**: First-class integration with **Sanity**, allowing content editors to build complex tables effortlessly.

## How It Works

The project consists of two main parts:

1.  **`structured-table` (Core)**: The lightweight library that parses your data and manages the table state.
2.  **`structured-table-cli` (CLI)**: A command-line tool that generates the actual components (Renderers) into your project.

### Usage

1.  **Install the Core Package:**
    ```bash
    npm install structured-table
    ```

2.  **Add the Renderer:**
    Use the CLI to add the React renderer to your project. This will create the necessary components in your `src/components` directory.
    ```bash
    npx stl-cli add react
    ```

3.  **Implement in Your App:**
    Import the generated `TableView` component and pass your structured data to it.
    ```tsx
    import { TableView } from "@/components/stl-render-react/latest";

    export default function Page() {
      const data = { ... }; // Your structured table data
      return <TableView data={data} />;
    }
    ```

## Ecosystem

- **`packages/structured-table`**: The core logic and type definitions.
- **`packages/structured-table-cli`**: The CLI tool for managing renderers and scaffolding.
- **`apps/web`**: Documentation and examples.
