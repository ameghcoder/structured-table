import { Button } from "@/components/ui/button";
import { TypographyH1, TypographyH2, TypographyP, TypographyBlockCode, TypographyInlineCode, TypographyList } from "@/components/ui/typography"
import { ArrowRight } from "lucide-react";
import { Metadata } from 'next';
import Link from "next/link";

export const metadata: Metadata = {
    title: "React Renderer - STL",
    description: "Learn how to integrate the Structured Table Language (STL) React renderer into your project.",
};

export default function ReactRendererPage() {
    return (
        <div className="max-w-none">
            <TypographyH1>React Renderer</TypographyH1>
            <TypographyP>
                Our React renderer provides a set of modern, accessible components built with CSS. It supports all STL features including complex cell spanning, custom actions, and interactive elements.
            </TypographyP>

            <TypographyH2 className="mt-10">Installation</TypographyH2>
            <TypographyP>
                Use the <TypographyInlineCode>stl-cli</TypographyInlineCode> to add the React components to your project. This command will create a local folder with the component source code.
            </TypographyP>
            <TypographyBlockCode lang="bash">
                npx stl-cli add react
            </TypographyBlockCode>

            <TypographyH2 className="mt-10">Basic Usage</TypographyH2>
            <TypographyP>
                Once the components are added, you can import them and pass the parsed STL data.
            </TypographyP>
            <TypographyBlockCode lang="tsx">
                {`import * as STLReact from './components/react'
import { STL } from 'structured-table'

// Example STL string
const stlString = '#table\\ncols: 2\\n[body]\\nHello | World\\n#endtable'
const tableData = STL.parse(stlString)

export default function MyTable() {
  return (
    <div className="p-4">
      <STLReact.Table data={tableData} className="simple" />
    </div>
  )
}`}
            </TypographyBlockCode>

            <TypographyH2 className="mt-10">Props Reference</TypographyH2>
            <TypographyP>
                The <TypographyInlineCode>Table</TypographyInlineCode> component accepts the following props:
            </TypographyP>
            <TypographyList list={[
                <span key="1"><TypographyInlineCode>data</TypographyInlineCode>: The parsed STLTable object from the STL parser.</span>,
                <span key="2"><TypographyInlineCode>className</TypographyInlineCode>: A theme name (e.g., &apos;simple&apos;, &apos;border&apos;, &apos;shadcn&apos;) or custom class names.</span>
            ]} />

            <TypographyH2 className="mt-10">Theming</TypographyH2>
            <TypographyP>
                The React renderer is highly customizable. Since the source code is in your project, you can modify the CSS or Tailwind classes directly. We recommend using the provided CSS variables for easy branding.
            </TypographyP>

            <TypographyH2 className="mt-10">Next.js Integration</TypographyH2>
            <TypographyP>
                If you are using this React renderer inside a **Next.js** project and want to use the <TypographyInlineCode>&lt;Link&gt;</TypographyInlineCode> component for optimized navigation instead of a standard HTML <TypographyInlineCode>&lt;a&gt;</TypographyInlineCode> tag, you can modify the implementation in your local component folder.
            </TypographyP>
            <TypographyP>
                Open <TypographyInlineCode>.../cell/LinkCell.tsx</TypographyInlineCode> and update it like this:
            </TypographyP>
            <TypographyBlockCode lang="tsx">
                {`import Link from 'next/link'
// ... other imports

const LinkCell = React.memo(({ data }: { data: LinkCellProps }) => {
    return (
        <Link href={data.href} target={data.newTab ? '_blank' : '_self'}>
            {data.text}
        </Link>
    )
})`}
            </TypographyBlockCode>

            <div className="mt-12 p-6 rounded-2xl bg-primary/5 border border-primary/10">
                <TypographyP className="mt-0 font-medium">
                    Component Location
                </TypographyP>
                <TypographyP className="text-sm text-muted-foreground">
                    By default, components are added to <TypographyInlineCode>./components/</TypographyInlineCode> or <TypographyInlineCode>./src/components/</TypographyInlineCode>. You can move them anywhere in your project as long as you update the imports.
                </TypographyP>
            </div>
            <div className="flex justify-between mb-6 mt-12">
                <Button variant="outline">
                    <Link href="/docs/stl-renderer">Renderers Overview</Link>
                </Button>
                <Link href="/docs/stl-renderer/vue" className="">
                    <Button variant="default" className="flex items-center gap-2 cursor-pointer!">
                        <span>Add Vue Renderer</span>
                        <ArrowRight />
                    </Button>
                </Link>
            </div>
        </div>
    )
}
