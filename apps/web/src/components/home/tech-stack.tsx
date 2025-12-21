/* eslint-disable @next/next/no-img-element */
export function TechStack() {
    return (
        <section className="border-y border-border/50 overflow-hidden bg-secondary">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
                <p className="text-center text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-8">
                    Powering the next generation of content with
                </p>
                <div className="group relative flex overflow-hidden">

                    {/* Static Grid for simplicity - cleaner than marquee for few items */}
                    <div className="flex flex-wrap justify-center items-center gap-12 md:gap-24 w-full opacity-75 grayscale hover:grayscale-0 transition-all duration-500">
                        <div className="flex items-center gap-2">
                            <img src="/assets/icons/React.svg" className="h-8 w-8" alt="React icon" />
                            <span className="font-semibold text-lg">React</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <img src="/assets/icons/Next.js.svg" className="h-8 w-8 invert-[0.5]" alt="next.js icon" />
                            <span className="font-semibold text-lg">Next.js</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <img src="/assets/icons/Sanity.svg" className="h-8 w-8" alt="sanity icon" />
                            <span className="font-semibold text-lg">Sanity</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <img src="/assets/icons/TypeScript.svg" className="h-8 w-8" alt="typescript icon" />
                            <span className="font-semibold text-lg">TypeScript</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <img src="/assets/icons/JavaScript.svg" className="h-8 w-8" alt="javascript icon" />
                            <span className="font-semibold text-lg">JavaScript</span>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    )
}
