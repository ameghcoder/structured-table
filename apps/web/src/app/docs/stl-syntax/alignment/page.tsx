import { TypographyBlockCode, TypographyH1, TypographyH2, TypographyH3, TypographyLarge, TypographyList, TypographyP } from "@/components/ui/typography";

export default function AlignmentPage() {
    return (
        <div className="prose prose-slate dark:prose-invert max-w-none">
            <TypographyH1>Text Alignment</TypographyH1>
            <p className="leading-7 not-first:mt-6">
                Control the horizontal alignment of content within any cell using the `align` attribute.
            </p>

            <TypographyH2 className="mt-6">Syntax</TypographyH2>
            <TypographyBlockCode lang="STL">
                {`{align="center"} Content`}
            </TypographyBlockCode>

            <TypographyH3 className="mt-8">Values</TypographyH3>
            <TypographyList list={[
                '`left` (default): Aligns content to the left.',
                '`center`: Centers the content horizontally.',
                '`right`: Aligns content to the right.'
            ]} />

            <TypographyLarge className="border-b mt-10">Example</TypographyLarge>
            <TypographyBlockCode lang="STL">
                {`#table
cols: 3

[header]
Item | {align="center"} Qty | {align="right"} Price

[body]
Apple | {align="center"} 10 | {align="right"} $1.00
Banana | {align="center"} 5 | {align="right"} $0.50`}
            </TypographyBlockCode>

            <TypographyH2>How Alignment Works</TypographyH2>
            <TypographyP>
                The alignment attribute is applied to individual cells, giving you precise control over content placement.
            </TypographyP>

            <TypographyList list={[
                <p key="1"><strong className="text-primary">Per-Cell Control</strong>: Each cell can have its own alignment, independent of other cells in the same column.</p>,
                <p key="2"><strong className="text-primary">Header & Body</strong>: Alignment works the same in both header and body sections.</p>,
            ]} />

        </div>
    )
}

