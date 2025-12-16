# Structured Table

**type-safe, parser-agnostic, and themeable structured table engine.**

This package is the **core engine** of the Structured Table Project. It provides the logic for parsing, validating, and converting structured table data (STL) into a format that UI components can render.

It is designed to be used with the **Structured Table CLI** (to generate the UI components) or as a standalone utility for parsing STL in any JavaScript/TypeScript environment.

## Installation

```bash
npm install structured-table
```

## Features

- **STL Parser**: specific custom parser to parse the raw string into a structured JSON Object.
- **SSR Friendly**: logic is decoupled from rendering, making it perfect for Next.js or other SSR frameworks.
- **Type-Safe**: Written in TypeScript with full type definitions.
- **Sanity Ready**: Designed to work seamlessly with Sanity CMS or any markdown-based content.

## Usage

### 1. Parsing STL (String -> Object)

The primary use case is parsing a "Structured Table Language" (STL) string into a usable object.

```typescript
import { STL } from "structured-table";

const rawSTL = `
#table
# This is the STL - stands for (Structured Table Format)
name: Comparison Table
cols: 4
showSerialIndex: true

[header]
Title | Feature | Value | CTA

[body]
Plan A | Fast               | 120ms | [button text="Buy" url="/buy-a"]
Plan B | Medium{colSpan=2}  | [link text="Learn More" href="/plans/b"]
Plan B | Medium             | 200ms | [link text="Learn More" href="/plans/b"]

[footer]
Note | * | * | Data updated weekly

#endtable
`;

const tableData = STL.parse(rawSTL);

console.log(tableData);
/*
Output:
{
  name: "Comparison Table",
  cols: 4,
  header: { ... },
  body: [ ... ],
  footer: { ... },
  ...
}
*/
```

### 2. Stringifying (Object -> STL)

You can also convert the structured object back into an STL string.

```typescript
import { STL } from "structured-table";

const tableObject = {
  name: "My Table",
  cols: 2,
  body: [
    { cells: [{ type: "text", value: "Cell 1" }, { type: "text", value: "Cell 2" }] }
  ]
  // ... rest of the structure
};

const stlString = STL.stringify(tableObject);
console.log(stlString);
```

## The STL Format (Structured Table Language)

STL is a simple, markdown-like syntax designed for readability and ease of editing.

### Basic Structure

```stl
name: Table Name
cols: 3
showSerialIndex: true

[header]
Heading 1 | Heading 2 | Heading 3

[body]
Row 1 Col 1 | Row 1 Col 2 | Row 1 Col 3
Row 2 Col 1 | Row 2 Col 2 | Row 2 Col 3
```

### Attributes (Spanning & Alignment)

You can add attributes to any cell using `{ key="value" }` or `{ key=value }`.

Supported attributes:
- `colSpan`: Number of columns to span.
- `rowSpan`: Number of rows to span.
- `align`: "left" | "center" | "right".

**Example:**
```stl
[body]
Standard Cell | Spanning 2 Columns {colSpan=2} |
Centered Text {align="center"} | Standard Cell | Standard Cell
```

### Interactive Elements (Buttons & Links)

STL supports "Rich Cells" like buttons and links specifically.

**Buttons:** `[button text="..." variant="..."]`
**Links:** `[link text="..." href="..."]`

**Example:**
```stl
[body]
User Name | [button text="Delete" variant="ghost" action="delete-user"]
Project X | [link text="Go to Project" href="https://example.com" newTab="true"]
```
