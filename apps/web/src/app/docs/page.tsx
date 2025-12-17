import { TypographyBlockCode, TypographyBlockquote, TypographyH1, TypographyH2, TypographyList, TypographyP } from "@/components/ui/typography";
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: "Introduction",
    description: "Learn about Structured Table (STL), a schema-driven engine for easy, consistent, and performant table management in headless applications.",
};

export default function IntroductionPage() {
    return (
        <div className="prose prose-slate dark:prose-invert max-w-none">
            <TypographyH1>Introduction</TypographyH1>
            <TypographyP>
                <strong>Structured Table</strong> (shortly called as <code>structured-table</code> or <code>STL</code>) is a powerful, schema-driven engine designed to make table management easy, consistent, and performant. While it was born out of the need for better tables in Sanity Studio, it has evolved into a <strong>framework-agnostic</strong> solution.
            </TypographyP>
            <TypographyBlockquote>
                <strong className="text-primary">NOTE:</strong> STL is currently in it's in verson 0.1.1 that supports many features, that helps to create static tables now, upcoming version can support dynamic tables.
            </TypographyBlockquote>

            <TypographyH2 className="mt-6">Why Structured Table?</TypographyH2>

            <TypographyP>
                Most CMS table plugins store data as raw HTML or simplified generic objects that are hard to render consistently on the frontend. They often crash with complex layouts or fail to support mobile views.
            </TypographyP>
            <TypographyP>
                Structured Table takes a different approach:
            </TypographyP>

            <TypographyList list={[
                <p key="1"><strong className="text-primary">Schema-First:</strong> Data is stored in a clean, text-based format (STL), not HTML.</p>,
                <p key="2"><strong className="text-primary">Render-Anywhere:</strong> Because the data is structured, you can render it as a semantic `&lt;table&gt;` (using our renderers), a flex grid, or even a chart (using the structured json).</p>,
                <p key="3"><strong className="text-primary">STL Syntax:</strong> A markdown-like syntax (Structured Table Language) for defining tables quickly.</p>,
                <p key="4"><strong className="text-primary">Headless Ready:</strong> Perfect for Next.js, Remix, Gatsby, or any headless stack where javascript support is available.</p>,
            ]} />

            <TypographyH2>Installation</TypographyH2>

            <TypographyP>
                Install the core package to get started:
            </TypographyP>

            <TypographyBlockCode lang="bash">
                npm install structured-table
            </TypographyBlockCode>

            <TypographyP>
                Or with yarn/pnpm:
            </TypographyP>

            <TypographyBlockCode lang="bash">
                pnpm add structured-table
            </TypographyBlockCode>

            <TypographyH2>Next Steps</TypographyH2>
            <TypographyP>
                Depending on your use case, jump to the relevant guide:
            </TypographyP>
            <TypographyList list={[
                <p key="1">Check out the <a href="/docs/stl-syntax" className="font-medium text-primary underline underline-offset-4">STL Syntax</a> to learn how to write tables manually.</p>,
                <p key="2">Integrate it into <a href="/docs/integration/sanity-studio" className="font-medium text-primary underline underline-offset-4">Sanity Studio</a> (the most popular use-case).</p>,
                <p key="3">Learn how to render tables on your <a href="/docs/integration/frontend" className="font-medium text-primary underline underline-offset-4">Frontend Website</a>.</p>,
            ]} />
        </div>
    )
}

