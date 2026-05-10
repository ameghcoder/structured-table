/* eslint-disable @typescript-eslint/no-explicit-any */
import { nanoid } from "nanoid/non-secure";
import {
  ATTRIBUTE_PAIR_REGEX,
  ATTRIBUTE_REGEX,
  CTA_REGEX,
  CURLY_BRACE_REGEX,
} from "../regex/regex";
import { InlineNode, SanityTable, TableCell, TableCellBase, TableRow } from "../types";

export const getInitialStructure = (): SanityTable => ({
  name: "",
  cols: 0,
  showSerialIndex: false,
  header: { uid: nanoid(), cells: [] },
  body: [],
  footer: { uid: nanoid(), cells: [] },
});

// Each entry validates and transforms a raw attribute string value.
// Returning undefined signals that the value is invalid and should be skipped.
const ATTRIBUTE_TRANSFORMERS: Record<string, (val: string) => any> = {
  colSpan: (v) => { const n = Number(v); return !isNaN(n) ? n : undefined; },
  rowSpan: (v) => { const n = Number(v); return !isNaN(n) ? n : undefined; },
  align:    (v) => (["left", "center", "right"].includes(v) ? v : undefined),
  textAlign: (v) => (["left", "center", "right"].includes(v) ? v : undefined),
  cellType: (v) => (["header", "data"].includes(v) ? v : undefined),
  class:    (v) => v,
};

// Maps legacy/alias STL keys to their canonical TableCellBase property names
const ATTRIBUTE_KEY_MAP: Record<string, keyof TableCellBase> = {
  textAlign: "align",
};

interface ParseAttributeResponse {
  attrObj: Partial<TableCellBase>;
  text: string;
}

function parseSpecificAttributes(trimmed: string): ParseAttributeResponse {
  const matchAttributes = trimmed.match(CURLY_BRACE_REGEX);
  const attrObj: Partial<TableCellBase> = {};
  let cleanText = trimmed;

  if (matchAttributes && matchAttributes[1]) {
    const attributeBlock = matchAttributes[0];
    const attributeString = matchAttributes[1];
    cleanText = trimmed.replace(attributeBlock, "").trim();
    ATTRIBUTE_PAIR_REGEX.lastIndex = 0;
    let match;

    while ((match = ATTRIBUTE_PAIR_REGEX.exec(attributeString)) !== null) {
      const key = match[1].trim();
      const transformer = ATTRIBUTE_TRANSFORMERS[key];
      if (!transformer) continue;

      let value = match[2].trim();
      if (value.startsWith('"') && value.endsWith('"')) {
        value = value.slice(1, -1);
      }

      const finalValue = transformer(value);
      if (finalValue === undefined) continue;

      const finalKey = (ATTRIBUTE_KEY_MAP[key] ?? key) as keyof TableCellBase;
      attrObj[finalKey] = finalValue;
    }
  }

  return { attrObj, text: cleanText };
}

// Splits cell text on [br] markers into an InlineNode array.
// Returns the original string when no [br] is present (common case, zero overhead).
function parseInlineContent(text: string): string | InlineNode[] {
  if (!text.includes("[br]")) return text;

  const parts = text.split("[br]");
  const nodes: InlineNode[] = [];

  parts.forEach((part, i) => {
    if (part) nodes.push({ uid: nanoid(), type: "string", data: part });
    if (i < parts.length - 1) nodes.push({ uid: nanoid(), type: "html", data: "", tag: "br" });
  });

  return nodes;
}

function normalizeRowSpan(table: SanityTable) {
  const matrix = table.body;

  for (let r = 0; r < matrix.length; r++) {
    const row = matrix[r];
    for (let c = 0; c < row.cells.length; c++) {
      const cell = row.cells[c];
      if (cell.rowSpan && cell.rowSpan > 1) {
        const span = cell.rowSpan;
        for (let i = 1; i < span; i++) {
          const belowRow = matrix[r + i];
          if (!belowRow) break;
          if (belowRow.cells[c]) {
            belowRow.cells[c]._removedDueToRowSpan = true;
          }
        }
      }
    }
  }

  for (const row of matrix) {
    row.cells = row.cells.filter((c) => !c._removedDueToRowSpan);
  }
}

export function parseTableString(formatString: string): SanityTable {
  if (typeof (formatString as unknown) !== "string") {
    throw new TypeError(
      `[structured-table] parseTableString: expected a string, received ${
        (formatString as unknown) === null ? "null" : typeof (formatString as unknown)
      }`
    );
  }

  const result: SanityTable = getInitialStructure();

  if (formatString.length === 0) {
    console.warn("[structured-table] parseTableString: received an empty string — returning empty table structure");
    return result;
  }

  const lines = formatString.split("\n");
  let currentSection: "header" | "body" | "footer" | null = null;

  for (const raw of lines) {
    const line = raw.trim();
    if (!line || line.startsWith("#")) continue;

    if (line === "[header]") { currentSection = "header"; continue; }
    if (line === "[body]")   { currentSection = "body";   continue; }
    if (line === "[footer]") { currentSection = "footer"; continue; }

    if (currentSection === null) {
      if (line.startsWith("name:")) {
        result.name = line.slice(5).trim();
      } else if (line.startsWith("cols:")) {
        result.cols = parseInt(line.slice(5).trim(), 10);
      } else if (line.startsWith("showSerialIndex:")) {
        result.showSerialIndex = line.slice(16).trim() !== "false";
      }
      continue;
    }

    const rawCells = line.split("|");
    const row: TableRow = { uid: nanoid(), cells: [] };

    for (const cell of rawCells) {
      const trimmed = cell.trim();
      const { attrObj, text } = parseSpecificAttributes(trimmed);

      // Header cells always render as <th>; cellType is redundant there
      if (currentSection === "header") delete attrObj.cellType;

      const ctaMatch = text.match(CTA_REGEX);
      if (ctaMatch) {
        const tagType = ctaMatch[1];
        const attrString = ctaMatch[2].trim();
        ATTRIBUTE_REGEX.lastIndex = 0;
        const cellObject: any = { type: tagType };
        let attrMatch;
        while ((attrMatch = ATTRIBUTE_REGEX.exec(attrString)) !== null) {
          cellObject[attrMatch[1]] = attrMatch[2];
        }
        row.cells.push({ ...cellObject, ...attrObj, uid: nanoid() } as TableCell);
        continue;
      }

      row.cells.push({ uid: nanoid(), type: "text", value: parseInlineContent(text), ...attrObj });
    }

    if (currentSection === "footer") {
      result.footer = row;
    } else if (currentSection === "header") {
      result.header = row;
    } else if (currentSection === "body") {
      result.body.push(row);
    }
  }

  normalizeRowSpan(result);
  return result;
}
