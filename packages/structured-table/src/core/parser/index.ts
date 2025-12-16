import { parseTableString } from "./parse-table";
import { stringifyTable } from "./stringify-table";

// Data Manipulation/Conversion (String ↔ Object)
export const STL = {
  /**
   * Converts a Structured Table Language (STL) string into a SanityTable object.
   * @param stlString The raw string representation of the table.
   * @returns The structured SanityTable object.
   */
  parse: parseTableString,

  /**
   * Converts a structured SanityTable object into a Structured Table Language (STL) string.
   * @param tableObject The SanityTable object to convert.
   * @returns The raw string representation of the table (STL format).
   */
  stringify: stringifyTable,
};
