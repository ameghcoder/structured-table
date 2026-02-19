import {
  TypographyBlockCode,
  TypographyH1,
  TypographyH2,
  TypographyH3,
  TypographyList,
  TypographyP,
} from "@/components/ui/typography";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "cellType (Header vs Data Cells)",
  description:
    "Use the cellType attribute to control whether a body cell renders as <th> or <td>.",
};

export default function CellTypePage() {
  return (
    <div className="prose prose-slate dark:prose-invert max-w-none">
      <TypographyH1>cellType</TypographyH1>
      <TypographyP>
        <code>cellType</code> controls the semantic HTML tag used by renderers
        for a cell.
      </TypographyP>

      <TypographyH2 className="mt-6">Values</TypographyH2>
      <TypographyList
        list={[
          <p key="1">
            <code>header</code>: Render as a table header cell (
            <code>&lt;th&gt;</code>).
          </p>,
          <p key="2">
            <code>data</code> (default): Render as a standard data cell (
            <code>&lt;td&gt;</code>).
          </p>,
        ]}
      />

      <TypographyH2 className="mt-10">Syntax</TypographyH2>
      <TypographyP>
        Add <code>cellType</code> inside curly braces on the cell you want to
        affect.
      </TypographyP>
      <TypographyBlockCode lang="STL">
        {`Plan A{cellType="header"} | $10
Plan B | $20`}
      </TypographyBlockCode>

      <TypographyH3 className="mt-10">Notes</TypographyH3>
      <TypographyList
        list={[
          <p key="1">
            In the <code>[header]</code> section, cells are already rendered as{" "}
            <code>&lt;th&gt;</code>. The parser ignores <code>cellType</code>{" "}
            there to keep STL clean.
          </p>,
          <p key="2">
            If <code>cellType</code> is omitted, renderers default to{" "}
            <code>&lt;td&gt;</code>.
          </p>,
        ]}
      />

      <TypographyH2 className="mt-10">Full Example</TypographyH2>
      <TypographyBlockCode lang="STL">
        {`#table
cols: 2

[header]
Plan | Price

[body]
Plan A{cellType="header"} | $10
Plan B{cellType="header"} | $20

#endtable`}
      </TypographyBlockCode>
    </div>
  );
}

