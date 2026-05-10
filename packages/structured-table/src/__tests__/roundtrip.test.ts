import { describe, it, expect } from "vitest";
import { parseTableString } from "../core/parser/parse-table";
import { stringifyTable } from "../core/parser/stringify-table";
import { TextCellProps } from "../core/types";

// parse → stringify → parse should produce an equivalent table structure.
// UIDs will differ on re-parse so we compare shape and values, not identity.

function stripUids(obj: unknown): unknown {
  if (Array.isArray(obj)) return obj.map(stripUids);
  if (obj !== null && typeof obj === "object") {
    return Object.fromEntries(
      Object.entries(obj as Record<string, unknown>)
        .filter(([k]) => k !== "uid")
        .map(([k, v]) => [k, stripUids(v)])
    );
  }
  return obj;
}

function roundtrip(stl: string) {
  return stripUids(parseTableString(stringifyTable(parseTableString(stl))));
}

function baseline(stl: string) {
  return stripUids(parseTableString(stl));
}

// ─── basic roundtrip ─────────────────────────────────────────────────────────

describe("roundtrip – basic", () => {
  it("preserves name, cols, showSerialIndex", () => {
    const stl = `#table\nname: Products\ncols: 3\nshowSerialIndex: true\n\n[body]\nA | B | C\n#endtable`;
    expect(roundtrip(stl)).toMatchObject({ name: "Products", cols: 3, showSerialIndex: true });
  });

  it("preserves body rows and text values", () => {
    const stl = `#table\nname: T\ncols: 2\nshowSerialIndex: false\n\n[body]\nHello | World\nFoo | Bar\n#endtable`;
    expect(roundtrip(stl)).toMatchObject(baseline(stl));
  });

  it("preserves header and footer", () => {
    const stl = `#table\nname: T\ncols: 2\nshowSerialIndex: false\n\n[header]\nCol A | Col B\n\n[body]\nA | B\n\n[footer]\nTotal | 100\n#endtable`;
    expect(roundtrip(stl)).toMatchObject(baseline(stl));
  });
});

// ─── cell type roundtrip ─────────────────────────────────────────────────────

describe("roundtrip – cell types", () => {
  it("preserves link cells", () => {
    const stl = `#table\nname: T\ncols: 1\nshowSerialIndex: false\n\n[body]\n[link text="Visit" href="https://example.com"]\n#endtable`;
    expect(roundtrip(stl)).toMatchObject(baseline(stl));
  });

  it("preserves button cells", () => {
    const stl = `#table\nname: T\ncols: 1\nshowSerialIndex: false\n\n[body]\n[button text="Click" url="/page" variant="outline"]\n#endtable`;
    expect(roundtrip(stl)).toMatchObject(baseline(stl));
  });
});

// ─── attribute roundtrip ─────────────────────────────────────────────────────

describe("roundtrip – attributes", () => {
  it("preserves colSpan", () => {
    const stl = `#table\nname: T\ncols: 2\nshowSerialIndex: false\n\n[body]\nMerged {colSpan=2}\n#endtable`;
    expect(roundtrip(stl)).toMatchObject(baseline(stl));
  });

  it("preserves align", () => {
    const stl = `#table\nname: T\ncols: 1\nshowSerialIndex: false\n\n[body]\nCentered {align="center"}\n#endtable`;
    expect(roundtrip(stl)).toMatchObject(baseline(stl));
  });

  it("preserves class attribute", () => {
    const stl = `#table\nname: T\ncols: 1\nshowSerialIndex: false\n\n[body]\nStyled {class="highlight"}\n#endtable`;
    expect(roundtrip(stl)).toMatchObject(baseline(stl));
  });

  it("preserves cellType header on body cell", () => {
    const stl = `#table\nname: T\ncols: 2\nshowSerialIndex: false\n\n[body]\nRow H {cellType="header"} | Data\n#endtable`;
    expect(roundtrip(stl)).toMatchObject(baseline(stl));
  });
});

// ─── inline content roundtrip ─────────────────────────────────────────────────

describe("roundtrip – inline content", () => {
  it("[br] round-trips back to InlineNode[]", () => {
    const stl = `#table\nname: T\ncols: 1\nshowSerialIndex: false\n\n[body]\nErick[br]James\n#endtable`;
    const result = parseTableString(stringifyTable(parseTableString(stl)));
    const value = (result.body[0].cells[0] as TextCellProps).value;
    expect(Array.isArray(value)).toBe(true);
    const nodes = value as Array<{ type: string; data?: string; tag?: string }>;
    expect(nodes[0]).toMatchObject({ type: "string", data: "Erick" });
    expect(nodes[1]).toMatchObject({ type: "html", tag: "br" });
    expect(nodes[2]).toMatchObject({ type: "string", data: "James" });
  });

  it("multiple [br] round-trip correctly", () => {
    const stl = `#table\nname: T\ncols: 1\nshowSerialIndex: false\n\n[body]\nA[br]B[br]C\n#endtable`;
    const result = parseTableString(stringifyTable(parseTableString(stl)));
    const nodes = (result.body[0].cells[0] as TextCellProps).value as Array<{ type: string }>;
    expect(nodes).toHaveLength(5);
  });
});
