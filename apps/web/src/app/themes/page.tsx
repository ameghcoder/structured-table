'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Copy, Check, Loader, X, Code } from 'lucide-react'
import { Palette } from 'lucide-react'
import { BasicFormat } from '@/stl/basic-format'
import { TypographyBlockCode, TypographyH1, TypographyLarge, TypographyP } from '@/components/ui/typography'
import { STLTablePreview } from '@/components/layout/stl-table-preview'

export const themes: { name: string; url: string; value: string; description: string }[] = [
    { name: 'Simple', url: "/theme/simple.css", value: 'simple', description: 'Clean and minimal table design' },
    { name: 'Border', url: "/theme/border.css", value: 'border', description: 'Table with full borders around all cells' },
    { name: 'Stripe', url: "/theme/stripe.css", value: 'stripe', description: 'Alternating row colors for better readability' },
    { name: 'Tailwind', url: "/theme/tailwind.css", value: 'tailwind', description: 'Modern Tailwind-inspired design with shadows' },
    { name: 'Shadcn', url: "/theme/shadcn.css", value: 'shadcn', description: 'Shadcn UI style table design' },
]

export default function ThemePage() {
    const [copiedTheme, setCopiedTheme] = useState<string | null>(null)
    const [showCssModal, setShowCssModal] = useState(false)
    const [cssContent, setCssContent] = useState('')
    const [activeTheme, setActiveTheme] = useState<string | null>(null)
    const [loading, setLoading] = useState<boolean>(false);

    const getThemeCSSContent = async (theme: string): Promise<string> => {
        try {
            setLoading(true);
            const url = themes.map((theme) => theme.url).find((url) => url.includes(theme)) || '';
            if (url.length == 0) throw new Error("No CSS Found");
            const cssContent = await fetch(url).then((response) => response.text());
            setLoading(false);
            return cssContent;
        } catch (error) {
            console.error('Failed to get CSS content:', error)
            setLoading(false);
            return '';
        }
    }

    const handleShowCSS = async (theme: string) => {
        setLoading(true)
        setActiveTheme(theme)
        const content = await getThemeCSSContent(theme)
        setCssContent(content)
        setShowCssModal(true)
        setLoading(false)
    }

    const handleCopyCSS = async () => {
        try {
            await navigator.clipboard.writeText(cssContent)
            if (activeTheme) {
                setCopiedTheme(activeTheme)
                setTimeout(() => setCopiedTheme(null), 2000)
            }
        } catch (error) {
            console.error('Failed to copy CSS:', error)
            if (activeTheme) {
                setCopiedTheme(activeTheme)
                setTimeout(() => setCopiedTheme(null), 2000)
            }
        }
    }

    return (
        <div className="min-h-screen bg-background ">
            {/* Load Theme CSS files for preview */}
            {themes.map((theme) => (
                <link key={theme.value} rel="stylesheet" href={theme.url} />
            ))}

            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
                {/* Header */}
                <div className="mb-12">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                        <Palette className="h-8 w-8 text-primary" />
                    </div>
                    <TypographyH1 >Table Themes</TypographyH1>
                    <TypographyP >
                        Choose from our collection of beautiful table themes. Each theme is designed to match different design systems and use cases.
                    </TypographyP>
                    <TypographyP >
                        Our table component auto prepend the &apos;st-table&apos; class to the table element. So, when you pass the &apos;border&apos; className in the component it will be used as &apos;st-table-border&apos;.
                    </TypographyP>
                </div>

                {/* Themes Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {themes.map((theme) => (
                        <div
                            key={theme.value}
                            className="border rounded-2xl bg-card shadow-sm overflow-hidden"
                        >
                            {/* Theme Header */}
                            <div className="p-4 border-b bg-muted/30">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="text-lg font-semibold">{theme.name}</h3>
                                        <p className="text-sm text-muted-foreground mt-1">
                                            {theme.description}
                                        </p>
                                    </div>
                                    <Button
                                        variant="default"
                                        size="sm"
                                        onClick={() => handleShowCSS(theme.value)}
                                        className="gap-2 rounded-2xl"
                                    >
                                        {loading ? (
                                            <>
                                                <Loader className="h-4 w-4" />
                                                <span className="hidden sm:inline">Loading...</span>
                                            </>
                                        ) : copiedTheme === theme.value ? (
                                            <>
                                                <Check className="h-4 w-4" />
                                                <span className="hidden sm:inline">Copied!</span>
                                            </>
                                        ) : (
                                            <>
                                                <Code className="h-4 w-4" />
                                                <span className="hidden sm:inline">CSS Code</span>
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </div>

                            {/* Theme Preview */}
                            <STLTablePreview
                                data={BasicFormat}
                                theme={theme.value}
                            />

                            <div className="p-4 border-t bg-muted/30">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-muted-foreground">
                                        Class: <code className="px-1.5 py-0.5 bg-background rounded text-xs font-mono">
                                            {theme.value === 'basic' ? 'basic-table-style' : `${theme.value}`}
                                        </code>
                                    </span>
                                    <span className="text-muted-foreground">
                                        File: <code className="px-1.5 py-0.5 bg-background rounded text-xs font-mono">
                                            {theme.value === 'basic' ? 'basic.css' : `${theme.value}.css`}
                                        </code>
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* CSS Code Modal */}
                {showCssModal && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowCssModal(false)}>
                        <div className="bg-card border rounded-2xl p-4 sm:p-6 max-w-2xl w-full max-h-[80vh] overflow-auto shadow-lg" onClick={(e) => e.stopPropagation()}>
                            <div className="flex items-center justify-between mb-4 pb-3 border-b">
                                <div className="flex items-center gap-2">
                                    <Code className="h-4 w-4 text-primary" />
                                    <h3 className="text-base sm:text-lg font-semibold">Theme CSS</h3>
                                </div>
                                <Button variant="ghost" size="sm" onClick={() => setShowCssModal(false)} className="h-8 w-8 p-0">
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                            <div className="space-y-4">
                                <pre className="bg-muted p-3 sm:p-4 rounded-md text-xs sm:text-sm overflow-auto max-h-96 font-mono border">
                                    {cssContent}
                                </pre>
                                <Button onClick={handleCopyCSS} className="w-full gap-2">
                                    {copiedTheme ? (
                                        <>
                                            <Check className="h-4 w-4" />
                                            Copied!
                                        </>
                                    ) : (
                                        <>
                                            <Copy className="h-4 w-4" />
                                            Copy to Clipboard
                                        </>
                                    )}
                                </Button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Usage Instructions */}
                <div className="mt-12 p-6 rounded-2xl border bg-card">
                    <h2 className="text-xl font-semibold mb-4">How to Use</h2>
                    <div className="space-y-4 text-sm text-muted-foreground">
                        <div>
                            <TypographyLarge className="font-semibold text-foreground">1. Import the CSS</TypographyLarge>
                            <TypographyP>
                                You can import this CSS file in your app or layout file, or can directly add this in your global.css file.
                            </TypographyP>
                        </div>
                        <div>
                            <TypographyLarge className="font-semibold text-foreground">2. Use the Theme Class</TypographyLarge>
                            <TypographyBlockCode lang='JSX'>
                                {`<TableCreator 
  data={table}
  className="${themes[1].value}"
/>`}
                            </TypographyBlockCode>
                        </div>
                        <div>
                            <TypographyLarge className="font-semibold text-foreground">3. Or Apply CSS Class Directly</TypographyLarge>
                            <TypographyP>
                                You can create div with your desired class name and apply the theme class to it in Portable Text Table.
                            </TypographyP>
                            <TypographyBlockCode lang='JSX'>
                                {`<div className="${themes[1].value}-table">
  <table>
    {/* your table content */}
  </table>
</div>`}
                            </TypographyBlockCode>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

