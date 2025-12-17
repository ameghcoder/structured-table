import { TypographyBlockCode, TypographyLink, TypographyList, TypographyP } from "@/components/ui/typography";

export default function StlSyntaxPage() {
    return (
        <div className="prose prose-slate dark:prose-invert max-w-none">
            <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">STL Syntax</h1>
            <TypographyP>
                <strong className="text-primary">STL</strong> (Structured Table Language) is a simple, human-readable format for defining tables. It is designed to be easy to write and readable by machines.
            </TypographyP>

            <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors mt-10">Basic Structure</h2>
            <TypographyP>
                A generic table starts with a &#96;#table&#96; declaration followed by configuration properties. Sections are defined by &#96;[header]&#96;, &#96;[body]&#96;, and &#96;[footer]&#96;. And ends with &#96;#endtable&#96;
            </TypographyP>

            <TypographyBlockCode lang="STL">

                {`#table
name: Comparison Table
cols: 4
showSerialIndex: true

[header]
Title | Feature | Value | CTA

[body]
Plan A | Fast | 120ms | [button text="Buy" url="/buy-a" action="action" targetId="target-id"]
Plan B | Medium | 20ms | [link text="Learn More" href="/plans/b" newTab="true"]

[footer]
Note | * | * | Data updated weekly

#endtable`}
            </TypographyBlockCode>

            <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors mt-10">Cell Types</h2>
            <TypographyP>
                STL supports structured cell types like text, links and buttons directly in the syntax.
            </TypographyP>

            <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight mt-8">Links</h3>
            <TypographyP>
                Use `[link]` and html style to add attributes (only a few attribute are supported text, href, newTab).
            </TypographyP>
            <TypographyBlockCode lang="STL">

                {`[body]
Learn More | [link text="Learn More" href="https://example.com" newTab="true" ]`}
            </TypographyBlockCode>

            <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight mt-8">Buttons</h3>
            <TypographyP>
                Use `[button]` to create interactive elements, check this: <TypographyLink className="text-primary" href={"/docs/stl-syntax/buttons/"}>How to add Buttons</TypographyLink>
            </TypographyP>
            <TypographyList list={[
                '`text`: The label displayed on the button.',
                '`url`(optional): if you pass a url it redirects to that url',
                "`action`(optional): A string identifier for the action (e.g., 'edit', 'delete')",
                '`targetId`(optional): Associated ID for the action (e.g., product ID), this will be added as <button id="your-id" ... />',
                "`variant`(default: 'default'): 'default', 'outline', 'ghost' (depends on theme support)."
            ]} />
            <TypographyBlockCode lang="STL">

                {`[body]
Product 1st | ₹ 2,999 | [button text="Buy Now" url="/buy-a" action="action" targetId="target-id"]`}
            </TypographyBlockCode>

            <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors mt-10">Attributes</h2>
            <TypographyP>
                You can apply styling attributes to any cell. Supported attributes include:
            </TypographyP>
            <ul className="my-6 ml-6 list-disc [&>li]:mt-2">
                <li><code>colSpan</code>: Number of columns the cell should span.</li>
                <li><code>rowSpan</code>: Number of rows the cell should span.</li>
                <li><code>align</code>: &apos;left&apos;, &apos;center&apos;, or &apos;right&apos;.</li>
            </ul>
            <TypographyBlockCode lang="STL">
                {`Plan A | Fast120ms{colSpan=2,align=center} | 120ms{rowSpan=2} | [button text="Buy" url="/buy-a" action="action" targetId="target-id"]`}
            </TypographyBlockCode>
        </div>
    )
}
