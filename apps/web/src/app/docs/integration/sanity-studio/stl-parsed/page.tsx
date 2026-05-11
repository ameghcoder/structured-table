import { TypographyBlockCode, TypographyH1, TypographyH2, TypographyP, TypographyInlineCode, TypographyMuted } from "@/components/ui/typography";
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: "Sanity stlParsed Field",
    description: "Learn how the stlParsed field works in the Sanity Studio plugin and how it optimizes your frontend performance.",
};

export default function SanityStlParsedPage() {
    return (
        <div className="max-w-none">
            <TypographyH1>Sanity <TypographyInlineCode>stlParsed</TypographyInlineCode> Field</TypographyH1>
            <TypographyP>
                Starting from <TypographyInlineCode>v0.3.0</TypographyInlineCode>, the <TypographyInlineCode>sanity-plugin-structured-table</TypographyInlineCode> utilizes dual storage. On every keystroke, the plugin saves both the raw <TypographyInlineCode>stlString</TypographyInlineCode> and the pre-parsed <TypographyInlineCode>stlParsed</TypographyInlineCode> JSON string.
            </TypographyP>

            <TypographyH2 className="mt-10">Why is this important?</TypographyH2>
            <TypographyP>
                Previously, frontend applications had to parse the raw STL string at request time or render time using the <TypographyInlineCode>STL.parse()</TypographyInlineCode> method. This introduced a computational overhead on every page load, especially for large tables or pages with multiple tables.
            </TypographyP>
            <TypographyP>
                By saving the parsed output directly in the Sanity dataset, your frontend can simply call <TypographyInlineCode>JSON.parse(value.stlParsed)</TypographyInlineCode> and skip the STL parsing step entirely. This dramatically improves rendering performance.
            </TypographyP>

            <TypographyH2 className="mt-10">How to use it on the Frontend</TypographyH2>
            <TypographyP>
                Update your GROQ queries to fetch the <TypographyInlineCode>stlParsed</TypographyInlineCode> field, and then parse the JSON string directly.
            </TypographyP>

            <div className="mt-6">
                <TypographyP className="font-bold">Step 1: Update GROQ queries</TypographyP>
                <TypographyBlockCode lang="groq">
                    {`*[_type == "post"] {
  title,
  myTable {
    stlParsed,
    stlString // Include as a fallback for older documents
  }
}`}
                </TypographyBlockCode>
            </div>

            <div className="mt-8">
                <TypographyP className="font-bold">Step 2: Parse the JSON string</TypographyP>
                <TypographyP>
                    Instead of using <TypographyInlineCode>STL.parse(stlString)</TypographyInlineCode>, you simply use <TypographyInlineCode>JSON.parse()</TypographyInlineCode>.
                </TypographyP>
                <TypographyBlockCode lang="typescript">
                    {`import { Table } from './components/react/Table';

export default function MyComponent({ post }) {
  // Parse the pre-computed JSON string
  const tableData = post.myTable?.stlParsed 
    ? JSON.parse(post.myTable.stlParsed)
    : null;
  
  if (!tableData) return null;

  return <Table data={tableData} />;
}`}
                </TypographyBlockCode>
            </div>

            <TypographyH2 className="mt-10">Migration Layer & Backward Compatibility</TypographyH2>
            <TypographyP>
                You do not need to manually migrate existing tables created before <TypographyInlineCode>v0.3.0</TypographyInlineCode>. The custom Sanity input component acts as a migration layer: it reads <TypographyInlineCode>stlParsed</TypographyInlineCode> first. If it is absent (e.g., an old document), it falls back to <TypographyInlineCode>STL.parse(stlString)</TypographyInlineCode> automatically in the studio. When an editor next edits that document, the new <TypographyInlineCode>stlParsed</TypographyInlineCode> field will be saved atomically via the new Object-level custom input.
            </TypographyP>
            <TypographyP>
                Therefore, if your frontend expects <TypographyInlineCode>stlParsed</TypographyInlineCode> but you have legacy documents, you should include a fallback on your frontend to parse the raw string, or simply open and save those legacy documents in the Studio once.
            </TypographyP>
            
            <div className="mt-8">
                <TypographyP className="font-bold">Example with Fallback</TypographyP>
                <TypographyBlockCode lang="typescript">
                    {`import { STL } from 'structured-table';

const tableData = post.myTable?.stlParsed 
    ? JSON.parse(post.myTable.stlParsed)
    : post.myTable?.stlString 
        ? STL.parse(post.myTable.stlString) 
        : null;`}
                </TypographyBlockCode>
            </div>

        </div>
    )
}
