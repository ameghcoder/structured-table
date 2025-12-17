import { TypographyBlockCode, TypographyH1, TypographyH2, TypographyH3, TypographyLarge, TypographyList, TypographyP } from "@/components/ui/typography";

export default function SpanningPage() {
    return (
        <div className="prose prose-slate dark:prose-invert max-w-none">
            <TypographyH1>Row &amp; Column Spanning</TypographyH1>
            <p className="leading-7 not-first:mt-6">
                Just like HTML tables, STL supports `rowSpan` and `colSpan` to create complex layouts.
            </p>

            <TypographyH2 className="mt-6">Syntax</TypographyH2>
            <TypographyP>
                Attributes are added in curly braces `{"{ }"}` before the cell content.
            </TypographyP>
            <TypographyBlockCode lang="STL">
                {`{colSpan="2"} Cell Content`}
            </TypographyBlockCode>
            <TypographyBlockCode lang="STL">
                {`{rowSpan="3"} Cell Content`}
            </TypographyBlockCode>

            <TypographyH3 className="mt-8">Attributes</TypographyH3>
            <TypographyList list={[
                '`colSpan`: Number of columns the cell should span horizontally.',
                '`rowSpan`: Number of rows the cell should span vertically.'
            ]} />

            <TypographyLarge className="border-b mt-10">Column Span Example</TypographyLarge>
            <TypographyBlockCode lang="STL">
                {`#table
cols: 3

[header]
{colSpan="2"} Item Details | Price

[body]
Laptop | 16GB RAM | $1200`}
            </TypographyBlockCode>

            <TypographyLarge className="border-b mt-10">Row Span Example</TypographyLarge>
            <TypographyBlockCode lang="STL">
                {`#table
cols: 2

[body]
{rowSpan="2"} Electronics | TV
Monitor
{rowSpan="2"} Furniture   | Chair
Table`}
            </TypographyBlockCode>

            <TypographyH2>How Spanning Works</TypographyH2>
            <TypographyP>
                When using span attributes, the parser handles the cell layout automatically.
            </TypographyP>

            <TypographyList list={[
                <p key="1"><strong className="text-primary">Column Span</strong>: The cell expands horizontally across the specified number of columns.</p>,
                <p key="2"><strong className="text-primary">Row Span</strong>: The cell expands vertically. Simply omit the cell in subsequent row(s) where the spanned cell would have occupied space.</p>,
            ]} />

            <p className="text-sm text-muted-foreground mt-4">
                Note: When using `rowSpan`, the parser handles cell omission automatically — you just need to skip writing the spanned cell in the following rows.
            </p>

        </div>
    )
}
