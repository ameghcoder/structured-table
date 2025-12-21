import { Code, Database, FileJson, Layers, Layout, Zap } from 'lucide-react'

const features = [
    {
        icon: Code,
        title: "Simple Syntax (STL)",
        description: "Write tables using our intuitive Structured Table Language. It's like Markdown, but for complex data grids."
    },
    {
        icon: Layers,
        title: "Framework Agnostic",
        description: "Core logic is separated from rendering. Use it with React, Vue, Svelte, or vanilla JS without vendor lock-in."
    },
    {
        icon: Layout,
        title: "Fully Themable",
        description: "Comes with built-in themes like Tailwind, Shadcn, and Stripe. Or create your own with simple CSS variables."
    },
    {
        icon: Zap,
        title: "High Performance",
        description: "Optimized parser and renderer ensure your tables load instantly, even with large datasets."
    },
    {
        icon: Database,
        title: "Schema Driven",
        description: "Perfect for Headless CMS integration. Define your table structure once, render it consistently everywhere."
    },
    {
        icon: FileJson,
        title: "Type Safe",
        description: "Built with TypeScript from the ground up. Enjoy full type inference and autocomplete support."
    }
]

export function Features() {
    return (
        <section className="py-24 relative">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">Why Structured Table?</h2>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Everything you need to build, manage, and render data tables in modern applications.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className="group p-8 rounded-2xl bg-card border hover:border-primary/50 transition-colors duration-300 relative overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-linear-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                            <div className="relative z-10">
                                <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 text-primary mb-6 group-hover:scale-110 transition-transform duration-300">
                                    <feature.icon className="h-6 w-6" />
                                </div>
                                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                                <p className="text-muted-foreground leading-relaxed">
                                    {feature.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
