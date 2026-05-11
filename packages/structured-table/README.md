# structured-table

**Type-safe, headless, SSR-friendly table engine for React, Vue, and Svelte.**

This is the **core package** of the Structured Table project. It provides:

- An **STL parser** that converts a Structured Table Language string into a typed `SanityTable` object
- A **stringifier** that converts a `SanityTable` back into STL
- A **renderer registry** (`registerRenderer` / `getRenderer`) used by framework renderers to plug in without coupling to the core

> **Full documentation & playground**: [stl-table.vercel.app](https://stl-table.vercel.app/)

## Installation

```bash
npm install structured-table
# or
pnpm add structured-table
# or
yarn add structured-table
```

## Quick Start

```typescript
import { STL } from "structured-table";

const stl = `
#table
name: Product Catalog
cols: 3

[header]
Product | Price | In Stock

[body]
Laptop | $999 | Yes
Mouse | $29 | Yes

[footer]
Total {colSpan=2} | 2 items

#endtable
`;

const table = STL.parse(stl);
// → SanityTable { header, body, footer, ... }
```

## API

### `STL.parse(stlString)`

Parses an STL string into a `SanityTable` object.

```typescript
import { STL } from "structured-table";

const table = STL.parse(stlString);
```

### `STL.stringify(table)`

Converts a `SanityTable` object back into an STL string.

```typescript
import { STL } from "structured-table";

const stlString = STL.stringify(tableObject);
```

### `registerRenderer(kind, renderer)` / `getRenderer(kind)`

Used by framework renderers (React, Vue, Svelte) to register themselves. You typically call this once in your renderer's `register.ts` file and then call `getRenderer` inside your table component.

```typescript
import { registerRenderer, getRenderer } from "structured-table";

// In your renderer's register file
registerRenderer("react", { Table: MyTableComponent });

// In a component that needs to render
const { Table } = getRenderer("react");
```

## STL Format

STL (Structured Table Language) is a concise, human-readable syntax for defining tables.

### Basic Structure

```
#table

[header]
Column 1 | Column 2 | Column 3

[body]
Row 1, Cell 1 | Row 1, Cell 2 | Row 1, Cell 3
Row 2, Cell 1 | Row 2, Cell 2 | Row 2, Cell 3

[footer]
Footer Cell 1 | Footer Cell 2 | Footer Cell 3

#endtable
```

Sections are optional — you can have `[body]` only, or any combination of `[header]`, `[body]`, `[footer]`.

### Table-Level Options

Place these at the top before any section:

```
name: My Table
cols: 3
showSerialIndex: true

[header]
...
```

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `name` | string | `""` | Table name / accessible label |
| `cols` | number | auto | Expected column count |
| `showSerialIndex` | boolean | `false` | Prepend a row-number column |

### Cell Attributes

Add attributes to any cell using `{key=value}` or `{key="value"}` syntax:

```
[body]
Merged Cell {colSpan=2} | Third Column
Centered {align="center"} | Left | Right {align="right"}
Row header {cellType="header"} | Data | Data
Styled cell {class="highlight"} | Normal | Normal
```

| Attribute | Values | Description |
|-----------|--------|-------------|
| `colSpan` | number | Span N columns horizontally |
| `rowSpan` | number | Span N rows vertically |
| `align` | `left` \| `center` \| `right` | Text alignment |
| `cellType` | `header` \| `data` | Semantic rendering hint (`<th>` vs `<td>`) |
| `class` | string | CSS class(es) passed to the rendered cell element |

### Inline Content

Text cells support inline HTML nodes inside the cell value. Currently supported:

**Line break (`[br]`)**

```
[body]
Line one[br]Line two | Normal cell
First paragraph[br]Second paragraph | Another cell
```

The parser converts `[br]` into an `InlineHtmlNode` (`{ type: "html", tag: "br" }`). Renderers are expected to convert inline nodes to their HTML equivalents.

### Rich Cells (Links & Buttons)

```
[body]
User Name | [link text="View Profile" href="/users/1"]
Document  | [link text="Open" href="https://example.com" newTab="true"]
Order #42 | [button text="Cancel" targetId="order-42" action="cancel-order" variant="ghost"]
Product   | [button text="Buy Now" url="/checkout" variant="default"]
```

**Link attributes**: `text`, `href`, `newTab`

**Button attributes**: `text`, `url`, `action`, `targetId`, `variant` (`default` | `outline` | `ghost`)

## TypeScript Types

All types are exported from the package root:

```typescript
import type {
  SanityTable,
  TableRow,
  TableCell,
  TextCellProps,
  LinkCellProps,
  ButtonCellProps,
  InlineNode,
  InlineTextNode,
  InlineHtmlNode,
  SanityTableProps,
} from "structured-table";
```

### Key types

```typescript
interface SanityTable {
  name: string;
  caption?: string;
  cols: number;
  showSerialIndex: boolean;
  header?: TableRow;
  body: TableRow[];
  footer?: TableRow;
}

interface TableRow {
  cells: TableCell[];
  uid: string;
}

// TableCell = TextCellProps | LinkCellProps | ButtonCellProps

interface TextCellProps extends TableCellBase {
  type: "text";
  value: string | InlineNode[]; // InlineNode[] when inline elements like [br] are present
}

// InlineNode = InlineTextNode | InlineHtmlNode
interface InlineHtmlNode {
  uid: string;
  type: "html";
  data: string;
  tag: string; // e.g. "br"
}
```

## Framework Renderers

The core package has no UI. Framework renderers are installed via the CLI:

```bash
npx stl-cli add react    # React renderer
npx stl-cli add vue      # Vue renderer
npx stl-cli add svelte   # Svelte renderer
```

Each renderer scaffolds component files into your project and exports a `register.ts` that calls `registerRenderer`. See the [renderer docs](https://stl-table.vercel.app/docs/stl-renderer/overview) for full setup instructions.

## License

MIT © [Yashraj Yadav](https://github.com/ameghcoder)
