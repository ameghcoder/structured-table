import { TypographyBlockCode, TypographyH1, TypographyH2, TypographyP, TypographyLarge, TypographyInlineCode } from "@/components/ui/typography";
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: "Line Breaks",
    description: "Learn how to use inline line breaks within table cells.",
};

export default function LineBreaksPage() {
    return (
        <div className="prose prose-slate dark:prose-invert max-w-none">
            <TypographyH1>Line Breaks</TypographyH1>
            <TypographyP>
                Use the <TypographyInlineCode>[br]</TypographyInlineCode> tag to insert inline line breaks inside any table cell.
            </TypographyP>

            <TypographyH2 className="mt-6">Syntax</TypographyH2>
            <TypographyBlockCode lang="STL">
                {`First Line[br]Second Line`}
            </TypographyBlockCode>

            <TypographyLarge className="border-b mt-10">Example</TypographyLarge>
            <TypographyBlockCode lang="STL">
                {`#table
cols: 2

[body]
Address | 123 Main St[br]Suite 400[br]New York, NY 10001
Contact | Jane Doe[br]jane@example.com`}
            </TypographyBlockCode>

            <TypographyH2>How Line Breaks Work</TypographyH2>
            <TypographyP>
                Line breaks are parsed and converted to proper line break elements by STL renderers, allowing you to have multi-line text content within a single table cell without breaking the row layout.
            </TypographyP>
        </div>
    )
}
