import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight, Sparkles, Github } from 'lucide-react'
import { TypographyBlockCode, TypographyH1, TypographyP } from '../ui/typography'
import { BasicFormat } from '@/stl/basic-format'
import { STLTablePreview } from '../layout/stl-table-preview'
import { CompareSlider } from '@/components/ui/compare-slider'

export function Hero() {
    return (
        <section className="relative overflow-hidden bg-background pt-24 pb-12 sm:pt-32 sm:pb-16 lg:pt-40 lg:pb-24">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
            <div className="absolute top-0 z-[-2] h-screen w-screen bg-transparent bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.15),rgba(255,255,255,0))]" />

            <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
                {/* Badge */}
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-muted border border-border/40 backdrop-blur-xl mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse" />
                    <span className="text-sm font-medium text-muted-foreground">
                        v0.1.1
                        is now live
                    </span>
                </div>

                {/* Heading */}
                <TypographyH1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-foreground mb-6 max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100 leading-16">
                    Structured Table Language <br className="hidden sm:block" />
                    for <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/60">Modern Apps</span>
                </TypographyH1>

                {/* Description */}
                <TypographyP className="max-w-2xl mx-auto mb-10 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
                    A framework-agnostic, schema-driven approach to building complex tables.
                    Write in STL (Structured Table Language), render anywhere.
                </TypographyP>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
                    <Button asChild size="lg" className="h-12 px-8 text-base">
                        <Link href="/playground">
                            Try Playground
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                    </Button>
                    <Button asChild variant="outline" size="lg" className="h-12 px-8 text-base">
                        <Link href="https://github.com/ameghcoder/structured-table" target="_blank">
                            <Github className="mr-2 h-4 w-4" />
                            Star on GitHub
                        </Link>
                    </Button>
                </div>
                <div className='mt-10'>
                    <CompareSlider
                        className="max-w-2xl mx-auto text-left"
                        itemOneClassName='overflow-x-auto w-full'
                        itemTwoClassName='overflow-x-auto w-full'
                        itemOne={
                            <TypographyBlockCode lang='STL' className='my-0 border-none rounded-none shadow-none'>
                                {BasicFormat}
                            </TypographyBlockCode>
                        }
                        itemTwo={
                            <TypographyBlockCode langAlign="right" lang='Rendered' previewClassName='p-0!' className='my-0 border-none rounded-none shadow-none'>
                                <STLTablePreview
                                    data={BasicFormat}
                                    theme="border"
                                />
                            </TypographyBlockCode>
                        }
                    />
                </div>
            </div>
        </section>
    )
}
