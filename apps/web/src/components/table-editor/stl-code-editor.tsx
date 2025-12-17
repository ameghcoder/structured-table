'use client'

import React, { useState, useEffect } from 'react'
import { Code } from 'lucide-react'
import { SanityTable } from 'structured-table'
import { STL } from 'structured-table'
import { Button } from '@/components/ui/button'

interface StlCodeEditorProps {
    table: SanityTable
    setTable: React.Dispatch<React.SetStateAction<SanityTable>>
    handleGenerateStl: () => void
}

export function StlCodeEditor({ table, setTable, handleGenerateStl }: StlCodeEditorProps) {
    const [stlCode, setStlCode] = useState<string>('')
    const [parseError, setParseError] = useState<string | null>(null)

    // Sync state when mounting
    useEffect(() => {
        try {
            const code = STL.stringify(table)
            setStlCode(code)
            setParseError(null)
        } catch (e) {
            console.error("Failed to stringify table", e)
        }
    }, [])

    const handleCodeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newCode = e.target.value
        setStlCode(newCode)
        try {
            const parsed = STL.parse(newCode)
            setTable(parsed)
            setParseError(null)
        } catch (err: any) {
            setParseError(err.message || "Invalid STL format")
        }
    }

    return (
        <div className="flex flex-col gap-4 p-3 sm:p-4 border rounded-lg bg-card shadow-sm h-[600px]">
            <div className="flex items-center justify-between border-b pb-3">
                <div className="flex items-center gap-2">
                    <Code className="h-5 w-5 text-primary" />
                    <h3 className="text-base sm:text-lg font-semibold">STL Code Editor</h3>
                </div>
                <div className="flex items-center gap-2">
                    {parseError && (
                        <span className="text-xs text-destructive font-medium bg-destructive/10 px-2 py-1 rounded">
                            {parseError}
                        </span>
                    )}
                    <Button onClick={handleGenerateStl} size="sm" className="gap-1.5">
                        <Code className="h-3.5 w-3.5" />
                        <span className="inline">Export STL</span>
                    </Button>
                </div>
            </div>
            <textarea
                value={stlCode}
                onChange={handleCodeChange}
                className="flex-1 w-full bg-muted/50 font-mono text-sm p-4 rounded-md border resize-none focus:outline-none focus:ring-2 focus:ring-primary/20"
                placeholder="#table..."
                spellCheck={false}
            />
            <div className="text-xs text-muted-foreground">
                Edits made here are automatically reflected in the preview below.
            </div>
        </div>
    )
}
