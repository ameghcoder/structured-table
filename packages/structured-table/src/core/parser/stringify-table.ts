import {
  SanityTable,
  TableCell,
  TextCellProps,
  LinkCellProps,
  ButtonCellProps,
} from "../types";

/**
 * Converts a SanityTable object to DSL format string
 */
export function stringifyTable(table: SanityTable): string {
  const lines: string[] = [];

  // Start marker
  lines.push("#table");

  // Table metadata
  lines.push(`name: ${table.name || ""}`);
  lines.push(`cols: ${table.cols}`);
  lines.push(`showSerialIndex: ${table.showSerialIndex}`);
  lines.push(""); // Empty line

  // Header section
  if (table.header && table.header.cells.length > 0) {
    lines.push("[header]");
    lines.push(formatRowCells(table.header.cells));
    lines.push(""); // Empty line
  }

  // Body section
  if (table.body.length > 0) {
    lines.push("[body]");
    for (const row of table.body) {
      // Filter out cells that are removed due to rowSpan
      const visibleCells = row.cells.filter((c) => !c._removedDueToRowSpan);
      lines.push(formatRowCells(visibleCells));
    }
    lines.push(""); // Empty line
  }

  // Footer section
  if (table.footer && table.footer.cells.length > 0) {
    lines.push("[footer]");
    lines.push(formatRowCells(table.footer.cells));
    lines.push(""); // Empty line
  }

  // End marker
  lines.push("#endtable");

  return lines.join("\n");
}

/**
 * Formats a row of cells into DSL format
 */
function formatRowCells(cells: TableCell[]): string {
  return cells.map((cell) => formatCell(cell)).join(" | ");
}

/**
 * Formats a single cell into DSL format
 */
function formatCell(cell: TableCell): string {
  let cellContent = "";

  // Format cell content based on type
  if (cell.type === "text") {
    cellContent = (cell as TextCellProps).value || "";
  } else if (cell.type === "link") {
    const linkCell = cell as LinkCellProps;
    const attrs: string[] = [];
    if (linkCell.text) attrs.push(`text="${linkCell.text}"`);
    if (linkCell.href) attrs.push(`href="${linkCell.href}"`);
    if (linkCell.newTab) attrs.push(`newTab="${linkCell.newTab}"`);
    cellContent = `[link ${attrs.join(" ")}]`;
  } else if (cell.type === "button") {
    const buttonCell = cell as ButtonCellProps;
    const attrs: string[] = [];
    if (buttonCell.text) attrs.push(`text="${buttonCell.text}"`);
    if (buttonCell.url) attrs.push(`url="${buttonCell.url}"`);
    if (buttonCell.action) attrs.push(`action="${buttonCell.action}"`);
    if (buttonCell.targetId) attrs.push(`targetId="${buttonCell.targetId}"`);
    if (buttonCell.variant) attrs.push(`variant="${buttonCell.variant}"`);
    cellContent = `[button ${attrs.join(" ")}]`;
  }

  // Add attributes (colSpan, rowSpan, align)
  const attributes: string[] = [];

  if (cell.colSpan && cell.colSpan > 1) {
    attributes.push(`colSpan=${cell.colSpan}`);
  }

  if (cell.rowSpan && cell.rowSpan > 1) {
    attributes.push(`rowSpan=${cell.rowSpan}`);
  }

  // Note: align is not in the DSL format based on the parser, but we can add it if needed
  // The parser only supports colSpan, rowSpan, and textAlign (but textAlign uses different format)

  if (attributes.length > 0) {
    cellContent += `{${attributes.join(", ")}}`;
  }

  return cellContent;
}
