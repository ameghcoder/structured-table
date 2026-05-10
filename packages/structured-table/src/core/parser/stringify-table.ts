import {
  SanityTable,
  TableCell,
  TextCellProps,
  LinkCellProps,
  ButtonCellProps,
} from "../types";

type CellFormatOpts = { section: "header" | "body" | "footer" };

// Maps each cell type to its STL serialization.
// To support a new cell type, add one entry here.
const CELL_CONTENT_FORMATTERS: Record<string, (cell: TableCell) => string> = {
  text: (cell) => (cell as TextCellProps).value || "",
  link: (cell) => {
    const c = cell as LinkCellProps;
    const attrs = [
      c.text   && `text="${c.text}"`,
      c.href   && `href="${c.href}"`,
      c.newTab && `newTab="${c.newTab}"`,
    ].filter(Boolean);
    return `[link ${attrs.join(" ")}]`;
  },
  button: (cell) => {
    const c = cell as ButtonCellProps;
    const attrs = [
      c.text     && `text="${c.text}"`,
      c.url      && `url="${c.url}"`,
      c.action   && `action="${c.action}"`,
      c.targetId && `targetId="${c.targetId}"`,
      c.variant  && `variant="${c.variant}"`,
    ].filter(Boolean);
    return `[button ${attrs.join(" ")}]`;
  },
};

type AttrSerializer = (cell: TableCell, opts: CellFormatOpts) => string | null;

// Each serializer emits an attribute string or null if the attribute should be omitted.
// To support a new attribute, add one entry here.
const ATTRIBUTE_SERIALIZERS: AttrSerializer[] = [
  (cell) => (cell.colSpan && cell.colSpan > 1 ? `colSpan=${cell.colSpan}` : null),
  (cell) => (cell.rowSpan && cell.rowSpan > 1 ? `rowSpan=${cell.rowSpan}` : null),
  (cell) => (cell.align && cell.align !== "left" ? `align="${cell.align}"` : null),
  (cell) => (cell.class ? `class="${cell.class}"` : null),
  (cell, opts) =>
    opts.section !== "header" && cell.cellType && cell.cellType !== "data"
      ? `cellType="${cell.cellType}"`
      : null,
];

export function stringifyTable(table: SanityTable): string {
  const raw = table as unknown;

  if (raw == null || typeof raw !== "object" || Array.isArray(raw)) {
    throw new TypeError(
      `[structured-table] stringifyTable: expected a SanityTable object, received ${
        raw === null ? "null" : Array.isArray(raw) ? "array" : typeof raw
      }`
    );
  }
  if (!Array.isArray((raw as Record<string, unknown>).body)) {
    throw new TypeError(
      "[structured-table] stringifyTable: table.body must be an array — make sure you are passing a valid SanityTable object"
    );
  }
  if (table.body.length === 0) {
    console.warn("[structured-table] stringifyTable: table.body is empty — the output will contain no body rows");
  }
  if (typeof table.cols !== "number" || table.cols <= 0) {
    console.warn(
      `[structured-table] stringifyTable: table.cols is ${JSON.stringify(table.cols)} — expected a positive number`
    );
  }

  const lines: string[] = [];

  lines.push("#table");
  lines.push(`name: ${table.name || ""}`);
  lines.push(`cols: ${table.cols}`);
  lines.push(`showSerialIndex: ${table.showSerialIndex}`);
  lines.push("");

  if (table.header && table.header.cells.length > 0) {
    lines.push("[header]");
    lines.push(formatRowCells(table.header.cells, { section: "header" }));
    lines.push("");
  }

  if (table.body.length > 0) {
    lines.push("[body]");
    for (const row of table.body) {
      const visibleCells = row.cells.filter((c) => !c._removedDueToRowSpan);
      lines.push(formatRowCells(visibleCells, { section: "body" }));
    }
    lines.push("");
  }

  if (table.footer && table.footer.cells.length > 0) {
    lines.push("[footer]");
    lines.push(formatRowCells(table.footer.cells, { section: "footer" }));
    lines.push("");
  }

  lines.push("#endtable");
  return lines.join("\n");
}

function formatRowCells(cells: TableCell[], opts: CellFormatOpts): string {
  return cells.map((cell) => formatCell(cell, opts)).join(" | ");
}

function formatCell(cell: TableCell, opts: CellFormatOpts): string {
  const formatter = CELL_CONTENT_FORMATTERS[cell.type];
  let cellContent = formatter ? formatter(cell) : "";

  const attributes = ATTRIBUTE_SERIALIZERS
    .map((s) => s(cell, opts))
    .filter((v): v is string => v !== null);

  if (attributes.length > 0) {
    cellContent += `{${attributes.join(", ")}}`;
  }

  return cellContent;
}
