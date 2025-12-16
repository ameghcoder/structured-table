/* eslint-disable @typescript-eslint/no-explicit-any */
import { nanoid } from "nanoid/non-secure";
import {
  ATTRIBUTE_PAIR_REGEX,
  ATTRIBUTE_REGEX,
  CTA_REGEX,
  CURLY_BRACE_REGEX,
} from "../regex/regex";
import { SanityTable, TableCell, TableCellBase, TableRow } from "../types";

export const getInitialStructure = (): SanityTable => ({
  name: "",
  cols: 0,
  showSerialIndex: false,
  header: {
    uid: nanoid(),
    cells: [],
  },
  body: [],
  footer: {
    uid: nanoid(),
    cells: [],
  },
});

// Alway cross-check this with the TableCellBase (./lib/types.ts)
// If you will update the TableCellBase and also update this
// Otherwise it not accepts the new Attribute values
const ALLOWED_KEYS = new Set(["colSpan", "textAlign", "rowSpan"]);

interface ParseAttributeResponse {
  attrObj: Partial<TableCellBase>;
  text: string;
}
function parseSpecificAttributes(trimmed: string): ParseAttributeResponse {
  const matchAttributes = trimmed.match(CURLY_BRACE_REGEX);
  const attrObj: Partial<TableCellBase> = {};

  let cleanText = trimmed; // Starting with the full string

  if (matchAttributes && matchAttributes[1]) {
    const attributeBlock = matchAttributes[0];
    const attributeString = matchAttributes[1];

    // Only replace the attribute block if it exists
    cleanText = trimmed.replace(attributeBlock, "").trim();

    let match;

    // Reset LastIndex for the global regex - it ensure to start the search from 0 every time function calls
    ATTRIBUTE_PAIR_REGEX.lastIndex = 0;

    while ((match = ATTRIBUTE_PAIR_REGEX.exec(attributeString)) !== null) {
      const key = match[1].trim();

      // Check if the key is in our list
      if (!ALLOWED_KEYS.has(key)) {
        continue;
      }

      let value = match[2].trim();

      // Clean up surrounding quotes
      if (value.startsWith('"') && value.endsWith('"')) {
        value = value.slice(1, -1);
      }

      // Type Conversion (eg. converting '2' to 2 for colSpan)
      let finalValue: any = value;
      if (key === "colSpan" || key === "rowSpan") {
        // current we not support rowSpan attri, only include here for the future use
        // check if it's a valid number before converting
        const num = Number(value);
        if (!isNaN(num)) {
          finalValue = num;
        }
      }

      // Assign the value (now safely we can use the keyof TableCellBase)
      attrObj[key as keyof TableCellBase] = finalValue;
    }
  }

  return { attrObj, text: cleanText };
}

// Normalize Rows for rowSpan attribute
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

          // Remove the target column cell because rowSpan covers it
          if (belowRow.cells[c]) {
            belowRow.cells[c]._removedDueToRowSpan = true;
          }
        }
      }
    }
  }

  // final cleanup pass: delete removed cells
  for (const row of matrix) {
    row.cells = row.cells.filter((c) => !c._removedDueToRowSpan);
  }
}

// Parse the Table
export function parseTableString(formatString: string): SanityTable {
  const result: SanityTable = getInitialStructure();

  if (formatString.length == 0) return result;

  const lines = formatString.split("\n");

  let currentSection: "header" | "body" | "footer" | null = null;

  for (const raw of lines) {
    const line = raw.trim();
    if (!line || line.startsWith("#")) continue;

    // section headers
    if (line === "[header]") {
      currentSection = "header";
      continue;
    }
    if (line === "[body]") {
      currentSection = "body";
      continue;
    }
    if (line === "[footer]") {
      currentSection = "footer";
      continue;
    }

    // initial config
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

    // row parsing
    // const rawCells = line.split(/\s*\|\s*/); // I avoid this way because it uses regex, it is faster enough, but we can optimize it more
    const rawCells = line.split("|"); // Simply using the vertical pipe-line, because table raw format uses the vertcal pipe to separate the cells
    const row: TableRow = {
      uid: nanoid(),
      cells: [],
    };

    for (const cell of rawCells) {
      const trimmed = cell.trim();

      const { attrObj, text } = parseSpecificAttributes(trimmed); // if a cell contains attribute value then it parse to an object, empty otherwise

      // --------- CTA (button/link) ---------
      const match = text.match(CTA_REGEX);
      if (match) {
        const tagType = match[1];
        const attrString = match[2].trim();

        // Reset lastIndex 0 to ensure the iteration starts from the beginning
        ATTRIBUTE_REGEX.lastIndex = 0;

        const cellObject: any = { type: tagType };
        let attrMatch;
        while ((attrMatch = ATTRIBUTE_REGEX.exec(attrString)) !== null) {
          cellObject[attrMatch[1]] = attrMatch[2];
        }

        row.cells.push({
          ...cellObject,
          ...attrObj,
          uid: nanoid(),
        } as TableCell);
        continue;
      }

      // --------- Plain text ---------
      row.cells.push({
        uid: nanoid(),
        type: "text",
        value: text,
        ...attrObj,
      });
    }

    if (currentSection === "footer") {
      result.footer = row;
    } else if (currentSection === "header") {
      result.header = row;
    } else if (currentSection === "body") {
      result[currentSection]!.push(row);
    }
  }
  normalizeRowSpan(result);
  return result;
}
