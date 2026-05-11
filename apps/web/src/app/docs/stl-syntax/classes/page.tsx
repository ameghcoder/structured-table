import { TypographyBlockCode, TypographyH1, TypographyH2, TypographyP, TypographyLarge, TypographyInlineCode } from "@/components/ui/typography";
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: "Cell Classes",
    description: "Add custom CSS classes to table cells for advanced styling.",
};

export default function ClassesPage() {
    return (
        <div className="prose prose-slate dark:prose-invert max-w-none">
            <TypographyH1>Cell Classes</TypographyH1>
            <TypographyP>
                You can apply custom CSS classes directly to any cell using the <TypographyInlineCode>class</TypographyInlineCode> attribute. This is highly useful for applying targeted styles to specific cells without having to write complex CSS selectors.
            </TypographyP>

            <TypographyH2 className="mt-6">Syntax</TypographyH2>
            <TypographyBlockCode lang="STL">
                {`{class="my-custom-class"} Content`}
            </TypographyBlockCode>

            <TypographyLarge className="border-b mt-10">Example</TypographyLarge>
            <TypographyBlockCode lang="STL">
                {`#table
cols: 3

[body]
Product | Price | Status
Apple | $1.00 | {class="text-green-500 font-bold bg-green-50"} In Stock
Banana | $0.50 | {class="text-red-500 font-bold bg-red-50"} Out of Stock`}
            </TypographyBlockCode>

            <TypographyH2>How Classes Work</TypographyH2>
            <TypographyP>
                The class attribute is passed down by STL renderers and applied to the outer wrapper element (usually the <TypographyInlineCode>&lt;td&gt;</TypographyInlineCode> or <TypographyInlineCode>&lt;th&gt;</TypographyInlineCode> equivalent) of the cell. If you are using frameworks like Tailwind CSS, this allows you to rapidly style individual cells directly from your STL code.
            </TypographyP>
        </div>
    )
}
