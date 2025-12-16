// Main component props
export interface SanityTableProps {
  data: SanityTable;
  // config?: TableConfig;
}

// Table CONFIG
// export interface TableConfig {
//   width?: "fixed" | "full";
//   fixedWidth?: number; // px
//   striped?: boolean;
//   bordered?: boolean;
//   hover?: boolean;
// }

// CORE TABLE STRUCTURE
export interface SanityTable {
  name: string;
  caption?: string;

  cols: number;
  showSerialIndex: boolean;

  header?: TableRow;
  body: TableRow[];
  footer?: TableRow;
}

// A row is simply an array of cells
export interface TableRow {
  cells: TableCell[];
  uid: string; //unique id to identify exact row
}

export interface TableCellBase {
  uid: string; //unique id to identify exact cell
  colSpan?: number; // defaults to 1
  rowSpan?: number; // defaults to 1
  align?: "left" | "center" | "right";

  // this types only used for normalization, not impact on how table renders
  _removedDueToRowSpan?: boolean;
}

// -----------------------------------------------------------
// STATIC CELL TYPES
// -----------------------------------------------------------
export type TableCell = TextCellProps | LinkCellProps | ButtonCellProps;

// 1. Static text cell
export interface TextCellProps extends TableCellBase {
  type: "text";
  value: string;
}

// 2. Clickable link cell
export interface LinkCellProps extends TableCellBase {
  type: "link";
  text: string;
  href: string;
  newTab?: boolean;
}

// 3. Interactive button cell
export interface ButtonCellProps extends TableCellBase {
  type: "button";
  text: string;
  url?: string;

  // event identifiers so users can hook into events
  action?: string; // e.g. "openModal", "download", "filter"
  targetId?: string; // e.g. "#primary-plan-button"
  variant?: "default" | "outline" | "ghost";
}
