import { describe, it, expect, vi } from "vitest";
import { stringifyTable } from "../core/parser/stringify-table";
import { SanityTable, TextCellProps, LinkCellProps, ButtonCellProps, InlineNode } from "../core/types";

// ─── helpers ─────────────────────────────────────────────────────────────────

function textCell(value: string, overrides = {}): TextCellProps {
  return { uid: "c1", type: "text", value, ...overrides };
}

function baseTable(overrides: Partial<SanityTable> = {}): SanityTable {
  return {
    name: "Test",
    cols: 2,
    showSerialIndex: false,
    body: [{ uid: "r1", cells: [textCell("A"), textCell("B")] }],
    ...overrides,
  };
}

// ─── input validation ────────────────────────────────────────────────────────

describe("stringifyTable – input validation", () => {
  it("throws TypeError for null", () => {
    expect(() => stringifyTable(null as unknown as SanityTable)).toThrow(TypeError);
    expect(() => stringifyTable(null as unknown as SanityTable)).toThrow("stringifyTable");
  });

  it("throws TypeError for undefined", () => {
    expect(() => stringifyTable(undefined as unknown as SanityTable)).toThrow(TypeError);
  });

  it("throws TypeError for a primitive", () => {
    expect(() => stringifyTable("stl-string" as unknown as SanityTable)).toThrow(TypeError);
  });

  it("throws TypeError for an array", () => {
    expect(() => stringifyTable([] as unknown as SanityTable)).toThrow(TypeError);
  });

  it("throws TypeError when body is not an array", () => {
    expect(() => stringifyTable({ name: "T", cols: 2, showSerialIndex: false, body: null } as unknown as SanityTable)).toThrow(TypeError);
    expect(() => stringifyTable({ name: "T", cols: 2, showSerialIndex: false, body: null } as unknown as SanityTable)).toThrow("table.body");
  });

  it("warns for empty body", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    stringifyTable(baseTable({ body: [] }));
    expect(warn).toHaveBeenCalledWith(expect.stringContaining("empty"));
    warn.mockRestore();
  });

  it("warns for cols <= 0", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    stringifyTable(baseTable({ cols: 0 }));
    expect(warn).toHaveBeenCalledWith(expect.stringContaining("cols"));
    warn.mockRestore();
  });
});

// ─── structure ───────────────────────────────────────────────────────────────

describe("stringifyTable – structure", () => {
  it("starts with #table and ends with #endtable", () => {
    const result = stringifyTable(baseTable());
    expect(result.startsWith("#table")).toBe(true);
    expect(result.trimEnd().endsWith("#endtable")).toBe(true);
  });

  it("includes name, cols, showSerialIndex", () => {
    const result = stringifyTable(baseTable({ name: "MyTable", cols: 3, showSerialIndex: true }));
    expect(result).toContain("name: MyTable");
    expect(result).toContain("cols: 3");
    expect(result).toContain("showSerialIndex: true");
  });

  it("includes [body] section", () => {
    const result = stringifyTable(baseTable());
    expect(result).toContain("[body]");
  });

  it("omits [header] when header has no cells", () => {
    const result = stringifyTable(baseTable({ header: { uid: "h", cells: [] } }));
    expect(result).not.toContain("[header]");
  });

  it("omits [footer] when footer has no cells", () => {
    const result = stringifyTable(baseTable({ footer: { uid: "f", cells: [] } }));
    expect(result).not.toContain("[footer]");
  });

  it("includes [header] when header has cells", () => {
    const result = stringifyTable(baseTable({ header: { uid: "h", cells: [textCell("Col A"), textCell("Col B")] } }));
    expect(result).toContain("[header]");
    expect(result).toContain("Col A");
  });

  it("includes [footer] when footer has cells", () => {
    const result = stringifyTable(baseTable({ footer: { uid: "f", cells: [textCell("Total"), textCell("100")] } }));
    expect(result).toContain("[footer]");
    expect(result).toContain("Total");
  });

  it("separates cells with | character", () => {
    const result = stringifyTable(baseTable());
    expect(result).toContain("A | B");
  });
});

// ─── cell type serialisation ──────────────────────────────────────────────────

describe("stringifyTable – cell type serialisation", () => {
  it("serialises text cell value", () => {
    const result = stringifyTable(baseTable({ body: [{ uid: "r1", cells: [textCell("Hello")] }] }));
    expect(result).toContain("Hello");
  });

  it("serialises link cell", () => {
    const link: LinkCellProps = { uid: "c1", type: "link", text: "Visit", href: "https://example.com" };
    const result = stringifyTable(baseTable({ body: [{ uid: "r1", cells: [link] }] }));
    expect(result).toContain('[link text="Visit" href="https://example.com"]');
  });

  it("serialises button cell", () => {
    const button: ButtonCellProps = { uid: "c1", type: "button", text: "Click", url: "/page", variant: "outline" };
    const result = stringifyTable(baseTable({ body: [{ uid: "r1", cells: [button] }] }));
    expect(result).toContain('[button text="Click" url="/page" variant="outline"]');
  });
});

// ─── attribute serialisation ──────────────────────────────────────────────────

describe("stringifyTable – attribute serialisation", () => {
  it("omits colSpan when equal to 1", () => {
    const result = stringifyTable(baseTable({ body: [{ uid: "r1", cells: [textCell("A", { colSpan: 1 })] }] }));
    expect(result).not.toContain("colSpan");
  });

  it("includes colSpan when greater than 1", () => {
    const result = stringifyTable(baseTable({ body: [{ uid: "r1", cells: [textCell("A", { colSpan: 2 })] }] }));
    expect(result).toContain("colSpan=2");
  });

  it("omits align when left", () => {
    const result = stringifyTable(baseTable({ body: [{ uid: "r1", cells: [textCell("A", { align: "left" })] }] }));
    expect(result).not.toContain("align");
  });

  it("includes align when center or right", () => {
    const result = stringifyTable(baseTable({ body: [{ uid: "r1", cells: [textCell("A", { align: "center" })] }] }));
    expect(result).toContain('align="center"');
  });

  it("includes class attribute", () => {
    const result = stringifyTable(baseTable({ body: [{ uid: "r1", cells: [textCell("A", { class: "highlight" })] }] }));
    expect(result).toContain('class="highlight"');
  });

  it("includes cellType header on body cells", () => {
    const result = stringifyTable(baseTable({ body: [{ uid: "r1", cells: [textCell("A", { cellType: "header" })] }] }));
    expect(result).toContain('cellType="header"');
  });

  it("omits cellType data on body cells", () => {
    const result = stringifyTable(baseTable({ body: [{ uid: "r1", cells: [textCell("A", { cellType: "data" })] }] }));
    expect(result).not.toContain("cellType");
  });

  it("omits cellType on header section cells", () => {
    const result = stringifyTable(baseTable({
      header: { uid: "h", cells: [textCell("Col", { cellType: "header" })] },
    }));
    const headerSection = result.split("[body]")[0];
    expect(headerSection).not.toContain("cellType");
  });
});

// ─── inline content ([br]) ───────────────────────────────────────────────────

describe("stringifyTable – inline content", () => {
  it("serialises InlineNode[] back to [br] tokens", () => {
    const nodes: InlineNode[] = [
      { uid: "n1", type: "string", data: "Erick" },
      { uid: "n2", type: "html", data: "", tag: "br" },
      { uid: "n3", type: "string", data: "James" },
    ];
    const cell: TextCellProps = { uid: "c1", type: "text", value: nodes };
    const result = stringifyTable(baseTable({ body: [{ uid: "r1", cells: [cell] }] }));
    expect(result).toContain("Erick[br]James");
  });

  it("serialises plain string value unchanged", () => {
    const result = stringifyTable(baseTable({ body: [{ uid: "r1", cells: [textCell("Hello")] }] }));
    expect(result).toContain("Hello");
    expect(result).not.toContain("[br]");
  });
});
