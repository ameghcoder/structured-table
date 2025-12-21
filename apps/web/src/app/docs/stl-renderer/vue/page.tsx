import { Button } from "@/components/ui/button";
import { TypographyH1, TypographyH2, TypographyP, TypographyBlockCode, TypographyInlineCode, TypographyLink } from "@/components/ui/typography"
import { REPO_URLS } from "@/constants/url";
import { ArrowRight } from "lucide-react";
import { Metadata } from 'next';
import Link from "next/link";

export const metadata: Metadata = {
    title: "Vue Renderer - STL",
    description: "Learn how to integrate the Structured Table Language (STL) Vue renderer into your project.",
};

export default function VueRendererPage() {
    return (
        <div className="max-w-none">
            <TypographyH1>Vue Renderer</TypographyH1>
            <TypographyP>
                The Vue renderer brings STL support to the Vue 3 ecosystem. It is built using the Composition API and provides a set of highly performant components for rendering complex tables.
            </TypographyP>

            <TypographyH2 className="mt-10">Installation</TypographyH2>
            <TypographyP>
                Use the <TypographyInlineCode>stl-cli</TypographyInlineCode> to add the Vue components to your project.
            </TypographyP>
            <TypographyBlockCode lang="bash">
                npx stl-cli add vue
            </TypographyBlockCode>

            <TypographyH2 className="mt-10">Basic Usage</TypographyH2>
            <TypographyP>
                Import the <TypographyInlineCode>STLTable</TypographyInlineCode> component and pass the parsed STL data as a prop.
            </TypographyP>
            <TypographyBlockCode lang="vue">
                {`<script setup>
import { STLTable } from './components/vue'
import { STL } from 'structured-table'

// Example STL data
const stlString = '#table\\ncols: 2\\n[body]\\nHello | World\\n#endtable'
const tableData = STL.parse(stlString)
</script>

<template>
  <div class="custom-container">
    <STLTable :data="tableData" class="simple" />
  </div>
</template>`}
            </TypographyBlockCode>

            <TypographyH2 className="mt-10">Reactivity</TypographyH2>
            <TypographyP>
                The Vue renderer is fully reactive. If the <TypographyInlineCode>data</TypographyInlineCode> prop changes, the table will re-render efficiently to reflect the new structure.
            </TypographyP>

            <TypographyH2 className="mt-10">Customization</TypographyH2>
            <TypographyP>
                Components are added directly to your project in the <TypographyInlineCode>./components/vue</TypographyInlineCode> directory. You can customize the templates, styling, and logic to fit your specific needs.
            </TypographyP>

            <div className="mt-12 p-6 rounded-2xl bg-primary/5 border border-primary/10">
                <TypographyP className="mt-0 font-medium">
                    Vue 2 Support
                </TypographyP>
                <TypographyP className="text-sm text-muted-foreground">
                    Currently, we only officially support Vue 3. If you require Vue 2 support, please open a discussion on our <TypographyLink href={REPO_URLS["structured-table"]} className="text-primary">GitHub repository</TypographyLink>.
                </TypographyP>
            </div>
            <div className="flex justify-between mb-6 mt-12">
                <Button variant="outline">
                    <Link href="/docs/stl-renderer">Renderers Overview</Link>
                </Button>
                <Link href="/docs/stl-renderer/react" className="">
                    <Button variant="default" className="flex items-center gap-2 cursor-pointer!">
                        <span>Add React Renderer</span>
                        <ArrowRight />
                    </Button>
                </Link>
            </div>
        </div>
    )
}
