import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight, Code, Rocket, Sliders } from 'lucide-react'

export function HowToUse() {
    return (
        <section className="py-24 sm:py-32 bg-background relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute right-0 top-1/4 h-96 w-96 bg-primary/5 rounded-full blur-3xl z-[-1]" />
            <div className="absolute left-0 bottom-1/4 h-96 w-96 bg-primary/5 rounded-full blur-3xl z-[-1]" />

            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <h2 className="text-3xl sm:text-4xl font-bold mb-4 tracking-tight">From Idea to Table in Seconds</h2>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        A simplified workflow designed for both developers and content editors.
                    </p>
                </div>

                <div className="relative grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Connecting Line (Desktop) */}
                    <div className="hidden md:block absolute top-1/2 left-[16%] right-[16%] h-0.5 bg-linear-to-r from-transparent via-border to-transparent z-0" />

                    {/* Step 1 */}
                    <div className="relative z-10 group">
                        <div className="flex flex-col items-center text-center p-6 bg-card rounded-2xl border shadow-sm hover:shadow-md transition-all duration-300 h-full">
                            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-6 shadow-inner group-hover:scale-110 transition-transform duration-300">
                                <Sliders className="h-7 w-7" />
                            </div>
                            <h3 className="text-xl font-bold mb-3">1. Design</h3>
                            <p className="text-muted-foreground mb-6 grow">
                                Use our visual editor or write generic STL code to define your table&apos;s structure, columns, and data types.
                            </p>
                            <Button asChild variant="outline" className="w-full mt-auto">
                                <Link href="/playground">
                                    Open Editor
                                </Link>
                            </Button>
                        </div>
                    </div>

                    {/* Step 2 */}
                    <div className="relative z-10 group">
                        <div className="flex flex-col items-center text-center p-6 bg-card rounded-2xl border shadow-sm hover:shadow-md transition-all duration-300 h-full">
                            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-6 shadow-inner group-hover:scale-110 transition-transform duration-300">
                                <Code className="h-7 w-7" />
                            </div>
                            <h3 className="text-xl font-bold mb-3">2. Export</h3>
                            <p className="text-muted-foreground mb-6 grow">
                                Copy the generated schema or JSON output. It&apos;s clean, readable, and ready to be dropped into your codebase or CMS.
                            </p>
                            <div className="w-full bg-muted p-3 rounded-lg text-xs font-mono text-left text-muted-foreground border opacity-70">
                                <span className="text-primary">#table</span> <br />
                                name: Pricing <br />
                                cols: 3
                            </div>
                        </div>
                    </div>

                    {/* Step 3 */}
                    <div className="relative z-10 group">
                        <div className="flex flex-col items-center text-center p-6 bg-card rounded-2xl border shadow-sm hover:shadow-md transition-all duration-300 h-full">
                            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-6 shadow-inner group-hover:scale-110 transition-transform duration-300">
                                <Rocket className="h-7 w-7" />
                            </div>
                            <h3 className="text-xl font-bold mb-3">3. Render</h3>
                            <p className="text-muted-foreground mb-6 grow">
                                Use our React component to render the table instantly. It auto-adapts to your theme and supports SSR.
                            </p>
                            <Button asChild className="w-full mt-auto">
                                <Link href="/docs">
                                    See Integration
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
