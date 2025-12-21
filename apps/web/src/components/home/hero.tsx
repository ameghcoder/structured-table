import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight, Star } from 'lucide-react'
import { TypographyBlockCode, TypographyH1, TypographyP } from '../ui/typography'
import { BasicFormat } from '@/stl/basic-format'
import { STLTablePreview } from '../layout/stl-table-preview'
import { CompareSlider } from '@/components/ui/compare-slider'
import { Badge } from '../ui/badge'

export function Hero() {
    return (
        <section className="relative overflow-hidden pt-24 pb-12 sm:pt-32 sm:pb-16 lg:pb-24">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[14px_24px] mask-[radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
            <div className="absolute top-0 z-[-2] h-screen w-screen bg-transparent bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.15),rgba(255,255,255,0))]" />

            <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
                {/* Badge */}
                <Badge variant="default" className='rounded-2xl my-6'>
                    v0.1.1 is now live
                </Badge>

                {/* Heading */}
                <TypographyH1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-foreground mb-6 max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100 leading-16">
                    Structured Table Language <br className="hidden sm:block" />
                    for <span className="text-transparent bg-clip-text bg-linear-to-r from-primary to-primary/60">Modern Apps</span>
                </TypographyH1>

                {/* Description */}
                <TypographyP className="max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
                    A framework-agnostic, schema-driven approach to building complex tables.
                    Write in STL (Structured Table Language), render anywhere.
                </TypographyP>

                {/* Copy STL command */}
                <TypographyBlockCode previewClassName='py-2! text-left!' className='w-fit mx-auto pr-8 my-6 rounded-full py-0 bg-accent' copyBtnClassName='h-full! rounded-none! px-2! right-0!'>
                    npm i structured-table
                </TypographyBlockCode>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
                    <Button asChild size="lg" className="h-12 px-8 text-base rounded-2xl">
                        <Link href="/playground">
                            Try Playground
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                    </Button>
                    <Button asChild variant="secondary" size="lg" className="h-12 px-8 text-base rounded-2xl border border-border">
                        <Link href="https://github.com/ameghcoder/structured-table" target="_blank" className='flex items-center justify-center gap-2'>
                            <Star color='yellow' fill='yellow' />
                            Star on GitHub
                            <ArrowRight className="ml-2 h-4 w-4" />
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
