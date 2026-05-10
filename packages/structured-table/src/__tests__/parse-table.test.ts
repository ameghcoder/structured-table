import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { parseTableString } from "../core/parser/parse-table";
import { TextCellProps, LinkCellProps, ButtonCellProps } from "../core/types";

// ─── helpers ────────────────────────────────────────────────────────────────

function stl(
  body: string,
  meta = "name: Test\ncols: 2\nshowSerialIndex: false",
) {
  return `#table\n${meta}\n\n[body]\n${body}\n#endtable`;
}

// ─── input validation ────────────────────────────────────────────────────────

describe("parseTableString – input validation", () => {
  it("throws TypeError for null", () => {
    expect(() => parseTableString(null as unknown as string)).toThrow(
      TypeError,
    );
    expect(() => parseTableString(null as unknown as string)).toThrow(
      "parseTableString",
    );
  });

  it("throws TypeError for undefined", () => {
    expect(() => parseTableString(undefined as unknown as string)).toThrow(
      TypeError,
    );
  });

  it("throws TypeError for a number", () => {
    expect(() => parseTableString(42 as unknown as string)).toThrow(TypeError);
  });

  it("throws TypeError for an object", () => {
    expect(() => parseTableString({} as unknown as string)).toThrow(TypeError);
  });

  it("warns and returns empty structure for empty string", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const result = parseTableString("");
    expect(warn).toHaveBeenCalledWith(expect.stringContaining("empty string"));
    expect(result.body).toEqual([]);
    warn.mockRestore();
  });
});

// ─── table metadata ──────────────────────────────────────────────────────────

describe("parseTableString – metadata", () => {
  it("parses table name", () => {
    const result = parseTableString(
      stl("A | B", "name: My Table\ncols: 2\nshowSerialIndex: false"),
    );
    expect(result.name).toBe("My Table");
  });

  it("parses cols count", () => {
    const result = parseTableString(
      stl("A | B", "name: T\ncols: 3\nshowSerialIndex: false"),
    );
    expect(result.cols).toBe(3);
  });

  it("parses showSerialIndex true", () => {
    const result = parseTableString(
      stl("A | B", "name: T\ncols: 2\nshowSerialIndex: true"),
    );
    expect(result.showSerialIndex).toBe(true);
  });

  it("parses showSerialIndex false", () => {
    const result = parseTableString(
      stl("A | B", "name: T\ncols: 2\nshowSerialIndex: false"),
    );
    expect(result.showSerialIndex).toBe(false);
  });

  it("skips comment lines starting with #", () => {
    const input = `#table\nname: T\ncols: 1\nshowSerialIndex: false\n\n[body]\nA\n#endtable`;
    const result = parseTableString(input);
    expect(result.body).toHaveLength(1);
  });
});

// ─── sections ────────────────────────────────────────────────────────────────

describe("parseTableString – sections", () => {
  it("parses header section", () => {
    const input = `#table\nname: T\ncols: 2\nshowSerialIndex: false\n\n[header]\nCol A | Col B\n\n[body]\nA | B\n#endtable`;
    const result = parseTableString(input);
    expect(result.header?.cells).toHaveLength(2);
    expect((result.header!.cells[0] as TextCellProps).value).toBe("Col A");
    expect((result.header!.cells[1] as TextCellProps).value).toBe("Col B");
  });

  it("parses body with multiple rows", () => {
    const input = `#table\nname: T\ncols: 2\nshowSerialIndex: false\n\n[body]\nA | B\nC | D\n#endtable`;
    const result = parseTableString(input);
    expect(result.body).toHaveLength(2);
    expect((result.body[0].cells[0] as TextCellProps).value).toBe("A");
    expect((result.body[1].cells[1] as TextCellProps).value).toBe("D");
  });

  it("parses footer section", () => {
    const input = `#table\nname: T\ncols: 2\nshowSerialIndex: false\n\n[body]\nA | B\n\n[footer]\nTotal | 100\n#endtable`;
    const result = parseTableString(input);
    expect(result.footer?.cells).toHaveLength(2);
    expect((result.footer!.cells[1] as TextCellProps).value).toBe("100");
  });

  it("assigns uid to every row and cell", () => {
    const result = parseTableString(stl("A | B"));
    expect(result.body[0].uid).toBeTruthy();
    expect(result.body[0].cells[0].uid).toBeTruthy();
    expect(result.body[0].cells[0].uid).not.toBe(result.body[0].cells[1].uid);
  });
});

// ─── cell types ──────────────────────────────────────────────────────────────

describe("parseTableString – cell types", () => {
  it("parses plain text cell", () => {
    const result = parseTableString(stl("Hello"));
    const cell = result.body[0].cells[0] as TextCellProps;
    expect(cell.type).toBe("text");
    expect(cell.value).toBe("Hello");
  });

  it("parses link cell", () => {
    const result = parseTableString(
      stl('[link text="Visit" href="https://example.com" newTab="true"]'),
    );
    const cell = result.body[0].cells[0] as LinkCellProps;
    expect(cell.type).toBe("link");
    expect(cell.text).toBe("Visit");
    expect(cell.href).toBe("https://example.com");
    expect(cell.newTab).toBe("true");
  });

  it("parses button cell", () => {
    const result = parseTableString(
      stl('[button text="Click" url="/page" action="open" variant="outline"]'),
    );
    const cell = result.body[0].cells[0] as ButtonCellProps;
    expect(cell.type).toBe("button");
    expect(cell.text).toBe("Click");
    expect(cell.url).toBe("/page");
    expect(cell.action).toBe("open");
    expect(cell.variant).toBe("outline");
  });
});

// ─── cell attributes ─────────────────────────────────────────────────────────

describe("parseTableString – cell attributes", () => {
  it("parses colSpan", () => {
    const result = parseTableString(stl("Merged {colSpan=2}"));
    expect(result.body[0].cells[0].colSpan).toBe(2);
  });

  it("parses rowSpan", () => {
    const result = parseTableString(stl("Top {rowSpan=2}\nBottom"));
    expect(result.body[0].cells[0].rowSpan).toBe(2);
  });

  it("parses align", () => {
    const result = parseTableString(stl('Cell {align="center"}'));
    expect(result.body[0].cells[0].align).toBe("center");
  });

  it("maps textAlign alias to align", () => {
    const result = parseTableString(stl('Cell {textAlign="right"}'));
    expect(result.body[0].cells[0].align).toBe("right");
  });

  it("parses cellType header on body cell", () => {
    const result = parseTableString(
      stl('Row Header {cellType="header"} | Data'),
    );
    expect(result.body[0].cells[0].cellType).toBe("header");
  });

  it("parses class attribute", () => {
    const result = parseTableString(stl('Cell {class="highlight"}'));
    expect(result.body[0].cells[0].class).toBe("highlight");
  });

  it("ignores invalid align value", () => {
    const result = parseTableString(stl('Cell {align="diagonal"}'));
    expect(result.body[0].cells[0].align).toBeUndefined();
  });

  it("ignores non-numeric colSpan", () => {
    const result = parseTableString(stl('Cell {colSpan="wide"}'));
    expect(result.body[0].cells[0].colSpan).toBeUndefined();
  });

  it("ignores unknown attributes", () => {
    const result = parseTableString(stl('Cell {foo="bar"}'));
    expect(
      (result.body[0].cells[0] as unknown as Record<string, unknown>).foo,
    ).toBeUndefined();
  });

  it("strips cellType from header section cells", () => {
    const input = `#table\nname: T\ncols: 1\nshowSerialIndex: false\n\n[header]\nCol {cellType="data"}\n\n[body]\nA\n#endtable`;
    const result = parseTableString(input);
    expect(result.header!.cells[0].cellType).toBeUndefined();
  });
});

// ─── rowSpan normalisation ────────────────────────────────────────────────────

describe("parseTableString – rowSpan normalisation", () => {
  it("removes cells covered by rowSpan in subsequent rows", () => {
    // Row 1 has two cells; normalization removes cells[0] because it is covered
    // by the rowSpan from row 0 col 0, leaving only the second cell (D).
    const input = `#table\nname: T\ncols: 2\nshowSerialIndex: false\n\n[body]\nA {rowSpan=2} | B\nC | D\n#endtable`;
    const result = parseTableString(input);
    expect(result.body[0].cells).toHaveLength(2);
    expect(result.body[1].cells).toHaveLength(1);
    expect((result.body[1].cells[0] as TextCellProps).value).toBe("D");
  });
});

// ─── inline content ([br]) ───────────────────────────────────────────────────

describe("parseTableString – inline content", () => {
  it("returns plain string when no [br] present", () => {
    const result = parseTableString(stl("Hello World"));
    const cell = result.body[0].cells[0] as TextCellProps;
    expect(typeof cell.value).toBe("string");
    expect(cell.value).toBe("Hello World");
  });

  it("splits on [br] into InlineNode array", () => {
    const result = parseTableString(stl("Erick[br]James"));
    const cell = result.body[0].cells[0] as TextCellProps;
    expect(Array.isArray(cell.value)).toBe(true);
    const nodes = cell.value as Array<{
      type: string;
      data?: string;
      tag?: string;
    }>;
    expect(nodes[0]).toMatchObject({ type: "string", data: "Erick" });
    expect(nodes[1]).toMatchObject({ type: "html", tag: "br" });
    expect(nodes[2]).toMatchObject({ type: "string", data: "James" });
  });

  it("handles multiple [br] markers", () => {
    const result = parseTableString(stl("A[br]B[br]C"));
    const cell = result.body[0].cells[0] as TextCellProps;
    const nodes = cell.value as Array<{ type: string }>;
    expect(nodes).toHaveLength(5);
    expect(nodes.filter((n) => n.type === "html")).toHaveLength(2);
    expect(nodes.filter((n) => n.type === "string")).toHaveLength(3);
  });

  it("handles leading [br]", () => {
    const result = parseTableString(stl("[br]James"));
    const cell = result.body[0].cells[0] as TextCellProps;
    const nodes = cell.value as Array<{ type: string; data?: string }>;
    expect(nodes[0]).toMatchObject({ type: "html", tag: "br" });
    expect(nodes[1]).toMatchObject({ type: "string", data: "James" });
  });

  it("assigns uid to every inline node", () => {
    const result = parseTableString(stl("A[br]B"));
    const nodes = (result.body[0].cells[0] as TextCellProps).value as Array<{
      uid: string;
    }>;
    expect(nodes[0].uid).toBeTruthy();
    expect(nodes[1].uid).toBeTruthy();
    expect(nodes[0].uid).not.toBe(nodes[1].uid);
  });
});
