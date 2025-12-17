import { TypographyBlockCode, TypographyH1, TypographyH2, TypographyH3, TypographyLarge, TypographyList, TypographyP } from "@/components/ui/typography";

export default function LinksPage() {
    return (
        <div className="prose prose-slate dark:prose-invert max-w-none">
            <TypographyH1>Links</TypographyH1>
            <p className="leading-7 not-first:mt-6">
                Links allow you to navigate normally or open new tabs from within a table cell. They are defined using the `[link]` token.
            </p>

            <TypographyH2 className="mt-6">Syntax</TypographyH2>
            <TypographyBlockCode lang="STL">
                {`[link text="Label" href="/url" newTab="true"]`}
            </TypographyBlockCode>

            <TypographyH3 className="mt-8">Attributes</TypographyH3>
            <TypographyList list={[
                '`text` (required): The link text displayed to the user.',
                '`href` (required): The destination URL.',
                '`newTab` (optional): Set to "true" to open in a new tab (`target="_blank"`).'
            ]} />

            <TypographyLarge className="border-b mt-10">Example</TypographyLarge>
            <TypographyBlockCode lang="STL">
                {`#table
cols: 2

[header]
Resource | Link

[body]
Documentation | [link text="Read Docs" href="/docs"]
GitHub Repo   | [link text="View Code" href="https://github.com" newTab="true"]`}
            </TypographyBlockCode>

            <TypographyH2>How Links Work</TypographyH2>
            <TypographyP>
                Links in the Structured Table Library render as standard anchor (`&lt;a&gt;`) elements with proper styling.
            </TypographyP>

            <TypographyList list={[
                <p key="1"><strong className="text-primary">Standard Navigation</strong>: By default, links navigate within the same tab.</p>,
                <p key="2"><strong className="text-primary">New Tab</strong>: When `newTab="true"` is set, the link opens in a new browser tab with `rel="noopener noreferrer"` for security.</p>,
            ]} />

        </div>
    )
}
