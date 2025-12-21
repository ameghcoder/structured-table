'use client'

import { useState, useCallback, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { SanityTable } from 'structured-table'
import {
    Copy,
    Eye,
    Code,
    X,
    Palette,
    Trash2
} from 'lucide-react'
import { STL } from 'structured-table'
import { BasicFormat } from '@/stl/basic-format'
import { themes } from '@/app/themes/page'
import { STLReact } from '../stl-render-react/latest'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { VisualEditor } from '../table-editor/visual-editor'
import { StlCodeEditor } from '../table-editor/stl-code-editor'
import STLTableClient from './stl-table-client'
import BgGradient from '../ui/bg-gradient'

export type Themes = 'simple' | 'shadcn' | 'stripe' | 'tailwind' | 'border'

function TableEditorContent() {
    const searchParams = useSearchParams()
    const initialMode = searchParams.get('editor') === 'stl' ? 'code' : 'visual'

    // Initialize table from localStorage or format.txt
    const [table, setTable] = useState<SanityTable>(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('stl-table-data')
            if (saved) {
                try {
                    return JSON.parse(saved)
                } catch (e) {
                    console.error('Failed to parse saved table', e)
                }
            }
        }
        return STL.parse(BasicFormat)
    })

    const [mode, setMode] = useState<'visual' | 'code'>(initialMode)
    const [tableTheme, setTableTheme] = useState<Themes>('simple')
    const [themeClassName, setThemeClassName] = useState<string>('simple-table')
    const [stlFormat, setStlFormat] = useState<string | null>(null)
    const [isGeneratingStl, setIsGeneratingStl] = useState(false)
    const [showStlModal, setShowStlModal] = useState(false)

    // Save to localStorage whenever table changes
    useEffect(() => {
        localStorage.setItem('stl-table-data', JSON.stringify(table))
    }, [table])

    const handleResetTable = useCallback(() => {
        if (confirm('Are you sure you want to reset the table? All changes will be lost.')) {
            const defaultTable = STL.parse(BasicFormat)
            setTable(defaultTable)
            localStorage.removeItem('stl-table-data')
        }
    }, [])

    useEffect(() => {
        setThemeClassName(`table-${tableTheme}`)
    }, [tableTheme])

    // Update mode if URL param changes (optional, but good for deep linking)
    useEffect(() => {
        const modeParam = searchParams.get('editor')
        if (modeParam === 'stl') setMode('code')
        else if (modeParam === 'visual') setMode('visual')
    }, [searchParams])


    // Generate STL format
    const handleGenerateStl = useCallback(async () => {
        setIsGeneratingStl(true)
        setShowStlModal(true)

        // Simulate async operation with a small delay for better UX
        await new Promise(resolve => setTimeout(resolve, 300))

        const stl = STL.stringify(table)
        setStlFormat(stl)
        setIsGeneratingStl(false)
    }, [table])

    // Copy STL to clipboard
    const handleCopyStl = useCallback(async () => {
        if (stlFormat) {
            try {
                await navigator.clipboard.writeText(stlFormat)
                alert('STL format copied to clipboard!')
            } catch (err) {
                console.error('Failed to copy:', err)
                alert('Failed to copy to clipboard')
            }
        }
    }, [stlFormat])


    return (
        <div className="w-full space-y-4">
            <BgGradient opacity={0.4} colors={['#D6A62E', 'black']} />
            <STLTableClient />
            {themes.map((theme) => (
                <link key={theme.value} rel="stylesheet" href={theme.url} />
            ))}

            {/* Mode Switcher */}
            <div className="flex justify-center mb-6">
                <div className="flex items-center p-1 bg-muted rounded-2xl border">
                    <button
                        onClick={() => setMode('visual')}
                        className={`px-4 py-1.5 text-sm font-medium rounded-xl transition-all ${mode === 'visual' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                    >
                        Visual Editor
                    </button>
                    <button
                        onClick={() => setMode('code')}
                        className={`px-4 py-1.5 text-sm font-medium rounded-xl transition-all ${mode === 'code' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                    >
                        STL Code
                    </button>
                </div>
                <Button variant="ghost" size="sm" onClick={handleResetTable} className="text-muted-foreground hover:text-destructive gap-1.5 rounded-xl ml-2">
                    <Trash2 className="h-4 w-4" />
                    Reset
                </Button>
            </div>

            {mode === 'visual' ? (
                <VisualEditor
                    table={table}
                    setTable={setTable}
                    themeClassName={themeClassName}
                    tableTheme={tableTheme}
                    setTableTheme={setTableTheme}
                    handleGenerateStl={handleGenerateStl}
                    handleResetTable={handleResetTable}
                />
            ) : (
                <StlCodeEditor
                    table={table}
                    setTable={setTable}
                    handleGenerateStl={handleGenerateStl}
                />
            )}


            {/* Rendered Table Reference (Common for both modes) */}
            <div className="border rounded-2xl p-3 sm:p-4 bg-card shadow-sm">
                <div className="flex items-center gap-2 mb-4 pb-3 border-b">
                    <Eye className="h-4 w-4 text-primary" />
                    <h3 className="text-sm sm:text-base font-semibold">Rendered Table Reference</h3>
                    <div className="ml-auto flex items-center gap-2">
                        {
                            mode === 'code' && (
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="outline" size="sm" className="gap-1.5 h-8">
                                            <Palette className="h-3.5 w-3.5" />
                                            <span className="hidden sm:inline">Theme: {tableTheme}</span>
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem onClick={() => setTableTheme('simple')}>Simple</DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => setTableTheme('border')}>Border</DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => setTableTheme('stripe')}>Stripe</DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => setTableTheme('tailwind')}>Tailwind</DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => setTableTheme('shadcn')}>Shadcn</DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            )
                        }
                        <span className="text-xs text-muted-foreground hidden sm:inline">Theme: {tableTheme}</span>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <STLReact.Table data={table} className={tableTheme} />
                </div>
            </div>

            {/* STL Format Modal */}
            {showStlModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setShowStlModal(false)}>
                    <div className="bg-secondary border rounded-2xl p-4 sm:p-6 max-w-2xl w-full max-h-[80vh] overflow-auto shadow-2xl" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-between mb-4 pb-3 border-b">
                            <div className="flex items-center gap-2">
                                <Code className="h-5 w-5 text-primary" />
                                <h3 className="text-base sm:text-lg font-semibold">STL Format</h3>
                            </div>
                            <Button variant="ghost" size="sm" onClick={() => setShowStlModal(false)} className="h-8 w-8 p-0">
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                        {isGeneratingStl ? (
                            <div className="flex flex-col items-center justify-center py-12 gap-3">
                                <div className="animate-spin rounded-full h-10 w-10 border-2 border-primary border-t-transparent"></div>
                                <span className="text-sm text-muted-foreground">Generating STL format...</span>
                            </div>
                        ) : stlFormat ? (
                            <div className="space-y-4">
                                <pre className="bg-background p-3 sm:p-4 rounded-xl text-xs sm:text-sm overflow-auto max-h-96 font-mono border">
                                    {stlFormat}
                                </pre>
                                <Button onClick={handleCopyStl} className="w-full gap-2">
                                    <Copy className="h-4 w-4" />
                                    Copy to Clipboard
                                </Button>
                            </div>
                        ) : null}
                    </div>
                </div>
            )}
        </div>
    )
}

export default function TableEditor() {
    return (
        <Suspense fallback={<div className="p-4">Loading editor...</div>}>
            <TableEditorContent />
        </Suspense>
    )
}

