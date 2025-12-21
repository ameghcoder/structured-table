/* eslint-disable @next/next/no-img-element */
import { TypographyH1, TypographyH2, TypographyP, TypographyInlineCode, TypographyLink, TypographyList, TypographyH3 } from "@/components/ui/typography"
import { REPO_URLS } from "@/constants/url";
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: "STL Renderers",
    description: "Explore the supported renderers for Structured Table Language (STL) across different frameworks like React and Vue.",
};

export default function StlRenderersPage() {
    return (
        <div className="max-w-none">
            <TypographyH1>STL Renderers</TypographyH1>
            <TypographyP>
                STL is designed to be framework-agnostic. While the core logic handles parsing and stringification, we provide dedicated renderers for popular frontend frameworks to make integration seamless.
            </TypographyP>

            <TypographyH2 className="mt-10">Choose Your Framework</TypographyH2>
            <TypographyP>
                Select your frontend framework to view specific integration guides and examples.
            </TypographyP>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                <TypographyLink href="/docs/stl-renderer/react" className="no-underline!">
                    <div className="p-6 rounded-2xl border bg-card hover:bg-accent transition-colors group flex flex-col gap-4">
                        <img src="/assets/icons/React.svg" alt="React Logo" className="w-12 h-12" />
                        <TypographyH3 className="text-xl font-bold group-hover:text-primary transition-colors">React</TypographyH3>
                        <TypographyP className="text-sm text-muted-foreground mt-0!">Modern components built with CSS and full TypeScript support.</TypographyP>
                    </div>
                </TypographyLink>
                <TypographyLink href="/docs/stl-renderer/vue" className="no-underline!">
                    <div className="p-6 rounded-2xl border bg-card hover:bg-accent transition-colors group flex flex-col gap-4">
                        <img src="/assets/icons/Vue.js.svg" alt="Vue Logo" className="w-12 h-12" />
                        <TypographyH3 className="text-xl font-bold group-hover:text-primary transition-colors">Vue</TypographyH3>
                        <TypographyP className="text-sm text-muted-foreground mt-0!">Reactive components utilizing the Vue 3 Composition API.</TypographyP>
                    </div>
                </TypographyLink>
            </div>

            <TypographyH2 className="mt-16">Using the CLI</TypographyH2>
            <TypographyP>
                The <TypographyInlineCode>stl-cli</TypographyInlineCode> is the recommended way to add renderers to your project. It doesn&apos;t just install a package; it adds the source code of the components directly to your project, allowing you to fully customize the styling and behavior.
            </TypographyP>
            <TypographyList list={[
                "Full control over component code",
                "No 'black-box' dependencies",
                "Easily theme with your own CSS",
                "Relocate based on your folder structure"
            ]} />

            <div className="mt-12 p-6 rounded-2xl bg-primary/5 border border-primary/10">
                <TypographyP className="mt-0 font-medium">
                    Looking for another framework?
                </TypographyP>
                <TypographyP className="text-sm text-muted-foreground">
                    We are working on other renderers. If you need a specific renderer urgently, feel free to contribute or open an issue on our <TypographyLink href={REPO_URLS["structured-table"]} className="text-primary">GitHub</TypographyLink>.
                </TypographyP>
            </div>
        </div>
    )
}
