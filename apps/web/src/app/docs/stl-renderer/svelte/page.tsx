import { Button } from "@/components/ui/button";
import { TypographyH1, TypographyH2, TypographyP, TypographyBlockCode, TypographyInlineCode, TypographyLink } from "@/components/ui/typography"
import { ArrowRight } from "lucide-react";
import { Metadata } from 'next';
import Link from "next/link";

export const metadata: Metadata = {
    title: "Svelte Renderer - STL",
    description: "Learn how to integrate the Structured Table Language (STL) Svelte renderer into your project.",
};

export default function SvelteRendererPage() {
    return (
        <div className="max-w-none">
            <TypographyH1>Svelte Renderer</TypographyH1>
            <TypographyP>
                The Svelte renderer brings STL support to the Svelte 4 and 5 ecosystem. It provides native Svelte components for rendering and interacting with complex tables seamlessly.
            </TypographyP>

            <TypographyH2 className="mt-10">Installation</TypographyH2>
            <TypographyP>
                Use the <TypographyInlineCode>stl-cli</TypographyInlineCode> to add the Svelte components to your project.
            </TypographyP>
            <TypographyBlockCode lang="bash">
                npx stl-cli add svelte
            </TypographyBlockCode>

            <TypographyH2 className="mt-10">Basic Usage</TypographyH2>
            <TypographyP>
                Import the <TypographyInlineCode>Table</TypographyInlineCode> component and pass the parsed STL data as a prop.
            </TypographyP>
            <TypographyBlockCode lang="svelte">
                {`<script>
  import Table from './components/svelte/Table.svelte'
  import { STL } from 'structured-table'

  // Example STL data
  const stlString = '#table\\ncols: 2\\n[body]\\nHello | World\\n#endtable'
  const tableData = STL.parse(stlString)
</script>

<div class="custom-container">
  <Table data={tableData} class="simple" />
</div>`}
            </TypographyBlockCode>

            <TypographyH2 className="mt-10">Custom Action Events</TypographyH2>
            <TypographyP>
                The Svelte renderer supports custom actions via buttons. You can listen to the <TypographyInlineCode>st-action</TypographyInlineCode> event dispatched by the table component when a user interacts with a button cell.
            </TypographyP>
            <TypographyBlockCode lang="svelte">
                {`<script>
  import Table from './components/svelte/Table.svelte'
  // ... prepare tableData

  function handleAction(event) {
    const detail = event.detail;
    console.log('Action name:', detail.action);
    console.log('Action data:', detail.data); // Optional passed arguments
  }
</script>

<Table data={tableData} on:st-action={handleAction} />`}
            </TypographyBlockCode>

            <div className="flex justify-between mb-6 mt-12">
                <Button variant="outline">
                    <Link href="/docs/stl-renderer/vue">Vue Renderer</Link>
                </Button>
                <Link href="/docs/integration/sanity-studio" className="">
                    <Button variant="default" className="flex items-center gap-2 cursor-pointer!">
                        <span>Sanity Studio Integration</span>
                        <ArrowRight />
                    </Button>
                </Link>
            </div>
        </div>
    )
}
