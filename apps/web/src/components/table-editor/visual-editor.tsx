'use client'

import React, { useCallback, useMemo, useState } from 'react'
import {
    Plus,
    Trash2,
    Columns,
    Rows,
    Hash,
    FileText,
    Eye,
    Code,
    AlignLeft,
    AlignCenter,
    AlignRight,
    Link as LinkIcon,
    MousePointerClick,
    Settings2,
    Palette,
    GripVertical,
    MoveUp,
    MoveDown,
    MoveLeft,
    MoveRight,
    ArrowUpDown,
    Maximize2,
    Minimize2,
    X
} from 'lucide-react'
import { SanityTable, TableCell, TableRow } from 'structured-table'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { TextCellProps, LinkCellProps, ButtonCellProps } from 'structured-table'
import { fastNanoid } from '@/utils/fast-nanoid'
import { Input } from '../ui/input'
import { Themes } from '../layout/table-editor'
import { Checkbox } from '../ui/checkbox'

interface VisualEditorProps {
    table: SanityTable
    setTable: React.Dispatch<React.SetStateAction<SanityTable>>
    themeClassName: string
    tableTheme: string
    setTableTheme: (theme: Themes) => void
    handleGenerateStl: () => void
    handleResetTable: () => void
}

interface EditingCell {
    cellUid: string
    rowUid: string
    section: 'header' | 'body' | 'footer'
    cellIndex: number
}

export function VisualEditor({ table, setTable, tableTheme, setTableTheme, handleGenerateStl, handleResetTable }: VisualEditorProps) {
    const [editingCell, setEditingCell] = useState<EditingCell | null>(null)
    const [isFullScreen, setIsFullScreen] = useState(false)

    // FullScreen
    const handleFullScreen = () => {
        document.body.style.overflow = isFullScreen ? 'auto' : 'hidden'
        setIsFullScreen(!isFullScreen)
    }

    // Update a cell
    const updateCell = useCallback((cellUid: string, rowUid: string, section: 'header' | 'body' | 'footer', updater: (cell: TableCell) => TableCell) => {
        setTable((prev: SanityTable) => {
            const newTable = { ...prev }

            if (section === 'header' && newTable.header) {
                newTable.header = {
                    ...newTable.header,
                    cells: newTable.header.cells.map((c: TableCell) => c.uid === cellUid ? updater(c) : c)
                }
            } else if (section === 'body') {
                newTable.body = newTable.body.map((row: TableRow) => {
                    if (row.uid === rowUid) {
                        return {
                            ...row,
                            cells: row.cells.map((c: TableCell) => c.uid === cellUid ? updater(c) : c)
                        }
                    }
                    return row
                })
            } else if (section === 'footer' && newTable.footer) {
                newTable.footer = {
                    ...newTable.footer,
                    cells: newTable.footer.cells.map((c: TableCell) => c.uid === cellUid ? updater(c) : c)
                }
            }

            return newTable
        })
    }, [setTable])

    // Add a new row to body
    const handleAddRow = useCallback(() => {
        setTable(prev => {
            const newRow: TableRow = {
                uid: fastNanoid(),
                cells: Array.from({ length: prev.cols }, () => ({
                    uid: fastNanoid(),
                    type: 'text',
                    value: '',
                } as TextCellProps))
            }
            return {
                ...prev,
                body: [...prev.body, newRow]
            }
        })
    }, [setTable])

    // Add a new column
    const handleAddColumn = useCallback(() => {
        setTable(prev => {
            const newTable = { ...prev, cols: prev.cols + 1 }

            // Add cell to header
            if (newTable.header) {
                newTable.header = {
                    ...newTable.header,
                    cells: [...newTable.header.cells, {
                        uid: fastNanoid(),
                        type: 'text',
                        value: '',
                    } as TextCellProps]
                }
            }

            // Add cell to each body row
            newTable.body = newTable.body.map(row => ({
                ...row,
                cells: [...row.cells, {
                    uid: fastNanoid(),
                    type: 'text',
                    value: '',
                } as TextCellProps]
            }))

            // Add cell to footer
            if (newTable.footer) {
                newTable.footer = {
                    ...newTable.footer,
                    cells: [...newTable.footer.cells, {
                        uid: fastNanoid(),
                        type: 'text',
                        value: '',
                    } as TextCellProps]
                }
            }

            return newTable
        })
    }, [setTable])

    // Delete a row
    const handleDeleteRow = useCallback((rowUid: string) => {
        setTable(prev => ({
            ...prev,
            body: prev.body.filter(row => row.uid !== rowUid)
        }))
    }, [setTable])

    // Delete a column
    const handleDeleteColumn = useCallback((colIndex: number) => {
        setTable(prev => {
            if (prev.cols <= 1) return prev

            const newTable = { ...prev, cols: prev.cols - 1 }

            // Remove cell from header
            if (newTable.header) {
                newTable.header = {
                    ...newTable.header,
                    cells: newTable.header.cells.filter((_, i) => i !== colIndex)
                }
            }

            // Remove cell from each body row
            newTable.body = newTable.body.map(row => ({
                ...row,
                cells: row.cells.filter((_, i) => i !== colIndex)
            }))

            // Remove cell from footer
            if (newTable.footer) {
                newTable.footer = {
                    ...newTable.footer,
                    cells: newTable.footer.cells.filter((_, i) => i !== colIndex)
                }
            }

            return newTable
        })
    }, [setTable])

    // Delete a single cell
    const handleDeleteCell = useCallback((cellUid: string, rowUid: string, section: 'header' | 'body' | 'footer') => {
        setTable(prev => {
            const newTable = { ...prev }

            if (section === 'header' && newTable.header) {
                newTable.header = {
                    ...newTable.header,
                    cells: newTable.header.cells.filter(c => c.uid !== cellUid)
                }
                if (newTable.header.cells.length === 0) {
                    newTable.header = undefined
                }
            } else if (section === 'body') {
                newTable.body = newTable.body.map(row => {
                    if (row.uid === rowUid) {
                        const newCells = row.cells.filter(c => c.uid !== cellUid)
                        return {
                            ...row,
                            cells: newCells
                        }
                    }
                    return row
                })
            } else if (section === 'footer' && newTable.footer) {
                newTable.footer = {
                    ...newTable.footer,
                    cells: newTable.footer.cells.filter(c => c.uid !== cellUid)
                }
                if (newTable.footer.cells.length === 0) {
                    newTable.footer = undefined
                }
            }

            return newTable
        })
    }, [setTable])

    // Toggle serial index
    const handleToggleSerialIndex = useCallback(() => {
        setTable(prev => {
            if (prev.showSerialIndex) {
                return { ...prev, showSerialIndex: false }
            } else {
                return {
                    ...prev,
                    showSerialIndex: true
                }
            }
        })
    }, [setTable])

    // Toggle header
    const handleToggleHeader = useCallback(() => {
        setTable(prev => {
            if (prev.header) {
                return { ...prev, header: undefined }
            } else {
                return {
                    ...prev,
                    header: {
                        uid: fastNanoid(),
                        cells: Array.from({ length: prev.cols }, () => ({
                            uid: fastNanoid(),
                            type: 'text',
                            value: '',
                        } as TextCellProps))
                    }
                }
            }
        })
    }, [setTable])

    // Toggle footer
    const handleToggleFooter = useCallback(() => {
        setTable(prev => {
            if (prev.footer) {
                return { ...prev, footer: undefined }
            } else {
                return {
                    ...prev,
                    footer: {
                        uid: fastNanoid(),
                        cells: Array.from({ length: prev.cols }, () => ({
                            uid: fastNanoid(),
                            type: 'text',
                            value: '',
                        } as TextCellProps))
                    }
                }
            }
        })
    }, [setTable])

    // Move a row
    const handleMoveRow = useCallback((fromIndex: number, toIndex: number) => {
        setTable(prev => {
            if (toIndex < 0 || toIndex >= prev.body.length) return prev
            const newBody = [...prev.body]
            const [movedRow] = newBody.splice(fromIndex, 1)
            newBody.splice(toIndex, 0, movedRow)
            return { ...prev, body: newBody }
        })
    }, [setTable])

    // Move a column logically
    const handleMoveColumn = useCallback((fromIndex: number, toIndex: number) => {
        setTable(prev => {
            if (toIndex < 0 || toIndex >= prev.cols) return prev

            const moveRowColumns = (row: TableRow) => {
                // 1. Map logical column index to cell index
                const colToCell: number[] = []
                row.cells.forEach((cell, cellIdx) => {
                    const span = cell.colSpan || 1
                    for (let i = 0; i < span; i++) colToCell.push(cellIdx)
                })

                // 2. Identify which cells are being swapped
                const fromCellIdx = colToCell[fromIndex]
                const toCellIdx = colToCell[toIndex]

                if (fromCellIdx === toCellIdx) return row // Same cell, no-op or moving within span

                // 3. Re-calculate target index by moving logical columns and reconstructing unique cells
                const logicalCells: TableCell[] = []
                row.cells.forEach(cell => {
                    const span = cell.colSpan || 1
                    for (let i = 0; i < span; i++) logicalCells.push(cell)
                })

                const [targetCell] = logicalCells.splice(fromIndex, 1)
                logicalCells.splice(toIndex, 0, targetCell)

                // Reconstruct unique cells in order
                const finalCells: TableCell[] = []
                const seen = new Set<string>()
                logicalCells.forEach(cell => {
                    if (!seen.has(cell.uid)) {
                        finalCells.push(cell)
                        seen.add(cell.uid)
                    }
                })

                return { ...row, cells: finalCells }
            }

            return {
                ...prev,
                header: prev.header ? moveRowColumns(prev.header) : undefined,
                body: prev.body.map(moveRowColumns),
                footer: prev.footer ? moveRowColumns(prev.footer) : undefined
            }
        })
    }, [setTable])

    // Normalize table for display handling both rowSpan and colSpan
    const normalizedTable = useMemo(() => {
        // Deep clone the table structure for normalization
        const cloneRow = (row: TableRow) => ({ ...row, cells: row.cells.map(c => ({ ...c })) })

        const header = table.header ? cloneRow(table.header) : undefined
        const body = table.body.map(cloneRow)
        const footer = table.footer ? cloneRow(table.footer) : undefined

        // Simpler version for now that just marks cells to hide
        const markSpans = (rows: TableRow[]) => {
            const occupied = new Set<string>()

            for (let r = 0; r < rows.length; r++) {
                let cellIndex = 0
                for (let c = 0; c < table.cols; c++) {
                    const key = `${r}-${c}`
                    if (occupied.has(key)) continue

                    const cell = rows[r]?.cells[cellIndex]
                    if (!cell) break

                    const rs = cell.rowSpan || 1
                    const cs = cell.colSpan || 1

                    for (let i = 0; i < rs; i++) {
                        for (let j = 0; j < cs; j++) {
                            if (i === 0 && j === 0) continue
                            occupied.add(`${r + i}-${c + j}`)
                        }
                    }
                    cellIndex++
                }
            }

            // Second pass to attach the "hidden" flag
            return rows.map((row, r) => {
                let cellIndex = 0
                const newCells = []
                for (let c = 0; c < table.cols; c++) {
                    const key = `${r}-${c}`
                    if (occupied.has(key)) continue
                    const cell = row.cells[cellIndex]
                    if (cell) {
                        newCells.push(cell)
                        cellIndex++
                    }
                }
                return { ...row, cells: newCells }
            })
        }

        return {
            header: header ? markSpans([header])[0] : undefined,
            body: markSpans(body),
            footer: footer ? markSpans([footer])[0] : undefined
        }
    }, [table])

    // Change cell type
    const handleChangeCellType = useCallback((cellUid: string, rowUid: string, section: 'header' | 'body' | 'footer', newType: 'text' | 'link' | 'button') => {
        updateCell(cellUid, rowUid, section, (cell) => {
            if (newType === 'text') {
                return {
                    ...cell,
                    type: 'text',
                    value: cell.type === 'text' ? cell.value : (cell.type === 'link' ? cell.text : (cell.type === 'button' ? cell.text : '')),
                } as TextCellProps
            } else if (newType === 'link') {
                return {
                    ...cell,
                    type: 'link',
                    text: cell.type === 'text' ? cell.value : (cell.type === 'link' ? cell.text : (cell.type === 'button' ? cell.text : '')),
                    href: cell.type === 'link' ? cell.href : '',
                } as LinkCellProps
            } else {
                return {
                    ...cell,
                    type: 'button',
                    text: cell.type === 'text' ? cell.value : (cell.type === 'link' ? cell.text : (cell.type === 'button' ? cell.text : '')),
                    url: cell.type === 'button' ? cell.url : '',
                } as ButtonCellProps
            }
        })
    }, [updateCell])

    return (
        <>
            {/* Controls */}
            <div className="flex flex-col gap-4 mb-8">
                <div className="flex items-center justify-between">
                    <h2 className="text-base sm:text-lg font-semibold flex items-center gap-2">
                        <Settings2 className="h-4 w-4 sm:h-5 sm:w-5" />
                        <span>Table Options</span>
                    </h2>
                    <Button onClick={handleGenerateStl} size="sm" className="gap-1.5 flex-initial">
                        <Code className="h-3.5 w-3.5" />
                        <span className="inline">Export STL</span>
                    </Button>
                </div>

                {/* Table Name and Columns */}
                <div className="flex flex-col  gap-2">
                    <div className="flex-1 relative">
                        <FileText className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            type="text"
                            value={table.name}
                            onChange={(e) => setTable(prev => ({ ...prev, name: e.target.value }))}
                            placeholder="Table name"
                            className="w-full max-w-xs pl-8 pr-2 py-1.5 border text-sm bg-background"
                        />
                    </div>
                    <div className="relative w-fit">
                        <Columns className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            type="number"
                            value={table.cols}
                            readOnly
                            aria-labelledby='Table Column Count'
                            placeholder="Cols"
                            className="w-fit pl-8 pr-2 py-1.5 border text-sm bg-muted"
                            title="Column count is managed by Add/Delete Column buttons"
                        />
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap items-center gap-2">
                    <Button onClick={handleAddRow} variant="secondary" size="sm" className="gap-1.5 flex-1 sm:flex-initial">
                        <Plus className="h-3.5 w-3.5" />
                        <Rows className="h-3.5 w-3.5 sm:hidden" />
                        <span className="hidden sm:inline">Add Row</span>
                    </Button>
                    <Button onClick={handleAddColumn} variant="secondary" size="sm" className="gap-1.5 flex-1 sm:flex-initial">
                        <Plus className="h-3.5 w-3.5" />
                        <Columns className="h-3.5 w-3.5 sm:hidden" />
                        <span className="hidden sm:inline">Add Column</span>
                    </Button>
                    {table.cols > 0 && (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="secondary" size="sm" className="gap-1.5 flex-1 sm:flex-initial">
                                    <Trash2 className="h-3.5 w-3.5" />
                                    <span className="hidden sm:inline">Delete Column</span>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className='z-999'>
                                {Array.from({ length: table.cols }, (_, i) => (
                                    <DropdownMenuItem
                                        key={i}
                                        onClick={() => handleDeleteColumn(i)}
                                        className="gap-2"
                                    >
                                        <Columns className="h-4 w-4" />
                                        Column {i + 1}
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )}

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="secondary" size="sm" className="gap-1.5 flex-1 sm:flex-initial">
                                <Palette className="h-3.5 w-3.5" />
                                <span className="hidden sm:inline">Theme: {tableTheme}</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className='z-999'>
                            <DropdownMenuItem onClick={() => setTableTheme('simple')} className="gap-2">
                                <span>Simple</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setTableTheme('border')} className="gap-2">
                                <span>Border</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setTableTheme('stripe')} className="gap-2">
                                <span>Stripe</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setTableTheme('tailwind')} className="gap-2">
                                <span>Tailwind</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setTableTheme('shadcn')} className="gap-2">
                                <span>Shadcn</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

                {/* Toggles */}
                <div className="flex flex-wrap items-center gap-3 sm:gap-4 pt-2 border-t">
                    <label htmlFor='toggle-serial-index' className="flex items-center gap-2 text-sm cursor-pointer hover:text-primary transition-colors">
                        <Checkbox id="toggle-serial-index" onCheckedChange={handleToggleSerialIndex} checked={table.showSerialIndex} />
                        <Hash className="h-3.5 w-3.5" />
                        <span>Serial Index</span>
                    </label>
                    <label htmlFor='toggle-header' className="flex items-center gap-2 text-sm cursor-pointer hover:text-primary transition-colors">
                        <Checkbox id="toggle-header" onCheckedChange={handleToggleHeader} checked={!!table.header} />
                        <FileText className="h-3.5 w-3.5" />
                        <span>Header</span>
                    </label>
                    <label htmlFor='toggle-footer' className="flex items-center gap-2 text-sm cursor-pointer hover:text-primary transition-colors">
                        <Checkbox id="toggle-footer" onCheckedChange={handleToggleFooter} checked={!!table.footer} />
                        <FileText className="h-3.5 w-3.5" />
                        <span>Footer</span>
                    </label>
                    <Button variant="ghost" size="sm" onClick={handleResetTable} className="text-destructive hover:bg-destructive/10 gap-1.5 ml-auto">
                        <Trash2 className="h-3.5 w-3.5" />
                        Reset Table
                    </Button>
                </div>
            </div>

            {/* Editing Popup */}
            {editingCell && (
                <div className="fixed inset-0 z-999 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm h-full" onClick={() => setEditingCell(null)}>
                    <div className="bg-card p-4 sm:p-6 rounded-2xl border shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center justify-between mb-4 pb-3 border-b">
                            <h3 className="text-lg font-bold flex items-center gap-2">
                                <Settings2 className="h-5 w-5 text-primary" />
                                Edit Cell
                            </h3>
                            <Button variant="ghost" size="sm" onClick={() => setEditingCell(null)} className="h-8 w-8 p-0 rounded-full">
                                <X className="h-5 w-5" />
                            </Button>
                        </div>

                        {(() => {
                            const { cellUid, rowUid, section } = editingCell
                            let cell: TableCell | undefined
                            if (section === 'header') cell = table.header?.cells.find(c => c.uid === cellUid)
                            else if (section === 'body') cell = table.body.find(r => r.uid === rowUid)?.cells.find(c => c.uid === cellUid)
                            else if (section === 'footer') cell = table.footer?.cells.find(c => c.uid === cellUid)

                            if (!cell) return null

                            return (
                                <div className="space-y-6">
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Type</label>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="outline" className="w-full justify-between h-10 px-3">
                                                        <div className="flex items-center gap-2">
                                                            {cell.type === 'text' ? <FileText className="h-4 w-4" /> : cell.type === 'link' ? <LinkIcon className="h-4 w-4" /> : <MousePointerClick className="h-4 w-4" />}
                                                            <span className="capitalize">{cell.type}</span>
                                                        </div>
                                                        <ArrowUpDown className="h-3.5 w-3.5 opacity-50" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent className="w-[180px] z-999">
                                                    <DropdownMenuItem onClick={() => handleChangeCellType(cellUid, rowUid, section, 'text')} className="gap-2 p-2.5">
                                                        <FileText className="h-4 w-4" /> Text
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => handleChangeCellType(cellUid, rowUid, section, 'link')} className="gap-2 p-2.5">
                                                        <LinkIcon className="h-4 w-4" /> Link
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => handleChangeCellType(cellUid, rowUid, section, 'button')} className="gap-2 p-2.5">
                                                        <MousePointerClick className="h-4 w-4" /> Button
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>

                                        <div className="space-y-1.5">
                                            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Alignment</label>
                                            <div className="flex bg-muted p-1 rounded-2xl border h-10">
                                                {(['left', 'center', 'right'] as const).map((align) => (
                                                    <button
                                                        key={align}
                                                        onClick={() => updateCell(cellUid, rowUid, section, (c) => ({ ...c, align }))}
                                                        className={`flex-1 flex items-center justify-center rounded-xl transition-all ${((cell!.align || 'left') === align) ? 'bg-background shadow-sm text-primary' : 'text-muted-foreground hover:text-foreground'}`}
                                                    >
                                                        {align === 'left' ? <AlignLeft className="h-4 w-4" /> : align === 'center' ? <AlignCenter className="h-4 w-4" /> : <AlignRight className="h-4 w-4" />}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Column Span</label>
                                            <Input
                                                type="number"
                                                min="1"
                                                value={cell.colSpan || 1}
                                                onChange={(e) => {
                                                    const val = parseInt(e.target.value) || 1
                                                    updateCell(cellUid, rowUid, section, (c) => ({ ...c, colSpan: Math.max(1, val) }))
                                                }}
                                                className="h-10"
                                            />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Row Span</label>
                                            <Input
                                                type="number"
                                                min="1"
                                                value={cell.rowSpan || 1}
                                                onChange={(e) => {
                                                    const val = parseInt(e.target.value) || 1
                                                    updateCell(cellUid, rowUid, section, (c) => ({ ...c, rowSpan: Math.max(1, val) }))
                                                }}
                                                className="h-10"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-3 pt-2 border-t">
                                        {cell.type === 'text' && (
                                            <div className="space-y-1.5">
                                                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Content</label>
                                                <textarea
                                                    value={cell.value}
                                                    onChange={(e) => updateCell(cellUid, rowUid, section, (c) => ({ ...c, value: e.target.value } as TextCellProps))}
                                                    className="w-full min-h-[100px] p-3 text-sm bg-background border rounded-xl focus:ring-2 focus:ring-primary/20 outline-none resize-none"
                                                    placeholder="Enter cell text..."
                                                />
                                            </div>
                                        )}
                                        {cell.type === 'link' && (
                                            <div className="space-y-3">
                                                <div className="space-y-1.5">
                                                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Link Text</label>
                                                    <Input
                                                        value={cell.text}
                                                        onChange={(e) => updateCell(cellUid, rowUid, section, (c) => ({ ...c, text: e.target.value } as LinkCellProps))}
                                                        placeholder="e.g. Visit Website"
                                                    />
                                                </div>
                                                <div className="space-y-1.5">
                                                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">URL</label>
                                                    <Input
                                                        value={cell.href}
                                                        onChange={(e) => updateCell(cellUid, rowUid, section, (c) => ({ ...c, href: e.target.value } as LinkCellProps))}
                                                        placeholder="https://..."
                                                    />
                                                </div>
                                                <label className="flex items-center gap-2 text-sm cursor-pointer p-2 rounded-lg hover:bg-muted transition-colors">
                                                    <Checkbox
                                                        checked={cell.newTab || false}
                                                        onCheckedChange={(checked) => updateCell(cellUid, rowUid, section, (c) => ({ ...c, newTab: !!checked } as LinkCellProps))}
                                                    />
                                                    <span>Open in new tab</span>
                                                </label>
                                            </div>
                                        )}
                                        {cell.type === 'button' && (
                                            <div className="space-y-3">
                                                <div className="space-y-1.5">
                                                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Button Text</label>
                                                    <Input
                                                        value={cell.text}
                                                        onChange={(e) => updateCell(cellUid, rowUid, section, (c) => ({ ...c, text: e.target.value } as ButtonCellProps))}
                                                    />
                                                </div>
                                                <div className="grid grid-cols-2 gap-3">
                                                    <div className="space-y-1.5">
                                                        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Variant</label>
                                                        <DropdownMenu>
                                                            <DropdownMenuTrigger asChild>
                                                                <Button variant="outline" className="w-full justify-between h-10 px-3">
                                                                    <span className="capitalize">{cell.variant || 'default'}</span>
                                                                    <ArrowUpDown className="h-3.5 w-3.5 opacity-50" />
                                                                </Button>
                                                            </DropdownMenuTrigger>
                                                            <DropdownMenuContent className='z-999'>
                                                                {(['default', 'outline', 'ghost'] as const).map((v) => (
                                                                    <DropdownMenuItem key={v} onClick={() => updateCell(cellUid, rowUid, section, (c) => ({ ...c, variant: v }))} className="capitalize">
                                                                        {v}
                                                                    </DropdownMenuItem>
                                                                ))}
                                                            </DropdownMenuContent>
                                                        </DropdownMenu>
                                                    </div>
                                                    <div className="space-y-1.5">
                                                        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Action</label>
                                                        <Input
                                                            value={cell.action || ''}
                                                            onChange={(e) => updateCell(cellUid, rowUid, section, (c) => ({ ...c, action: e.target.value } as ButtonCellProps))}
                                                            placeholder="click, open..."
                                                        />
                                                    </div>
                                                </div>
                                                <div className="space-y-1.5">
                                                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Target ID</label>
                                                    <Input
                                                        value={cell.targetId || ''}
                                                        onChange={(e) => updateCell(cellUid, rowUid, section, (c) => ({ ...c, targetId: e.target.value } as ButtonCellProps))}
                                                        placeholder="#target"
                                                    />
                                                </div>
                                                <div className="space-y-1.5">
                                                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">URL</label>
                                                    <Input
                                                        value={cell.url || ''}
                                                        onChange={(e) => updateCell(cellUid, rowUid, section, (c) => ({ ...c, url: e.target.value } as ButtonCellProps))}
                                                        placeholder="/url"
                                                    />
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex gap-3 pt-6 border-t">
                                        <Button
                                            variant="destructive"
                                            className="flex-1 gap-2"
                                            onClick={() => {
                                                handleDeleteCell(cellUid, rowUid, section)
                                                setEditingCell(null)
                                            }}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                            Delete Cell
                                        </Button>
                                        <Button
                                            variant="default"
                                            className="flex-1"
                                            onClick={() => setEditingCell(null)}
                                        >
                                            Done
                                        </Button>
                                    </div>
                                </div>
                            )
                        })()}
                    </div>
                </div>
            )}

            {/* Live Editor */}
            <div className={`border rounded-2xl bg-card shadow-sm flex flex-col transition-all overflow-hidden duration-300 ${isFullScreen ? 'fixed inset-0 z-100 rounded-none h-screen' : 'h-full'}`}>
                <div className="flex items-center justify-between p-3 sm:p-4 border-b bg-muted/50 shrink-0">
                    <div className="flex items-center gap-2">
                        <Eye className="h-4 w-4 text-primary" />
                        <h3 className="text-sm sm:text-base font-semibold">Live Table Editor</h3>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <ArrowUpDown className="h-3 w-3" /> Drag headers to reorder
                        </span>
                        <Button
                            variant="outline"
                            size="sm"
                            className="h-8 gap-1.5 rounded-lg border-primary/20 hover:bg-primary/5 ml-2"
                            onClick={() => handleFullScreen()}
                        >
                            {isFullScreen ? (
                                <>
                                    <Minimize2 className="h-3.5 w-3.5" />
                                    <span>Exit Fullscreen</span>
                                </>
                            ) : (
                                <>
                                    <Maximize2 className="h-3.5 w-3.5" />
                                    <span>Full Screen</span>
                                </>
                            )}
                        </Button>
                    </div>
                </div>

                <div className="overflow-auto grow h-full min-h-0 bg-background">
                    <div className="inline-block min-w-full align-middle">
                        <table className="w-full border-collapse text-sm table-fixed">
                            <thead className='sticky top-0 z-10 bg-background border-b border-border'>
                                <tr className="bg-muted/80">
                                    <th className="w-10 border-b border-r p-2 bg-muted/30"></th>
                                    {table.showSerialIndex && <th className="w-12 border-b border-r p-2 bg-muted/30 font-bold uppercase text-[10px] tracking-tighter">#</th>}
                                    {Array.from({ length: table.cols }).map((_, idx) => (
                                        <th
                                            key={`col-ctrl-${idx}`}
                                            className="border-b border-r p-2 group relative transition-colors hover:bg-muted/50"
                                            draggable
                                            onDragStart={(e) => {
                                                e.dataTransfer.setData('colIndex', idx.toString())
                                                e.currentTarget.classList.add('bg-primary/10')
                                            }}
                                            onDragOver={(e) => {
                                                e.preventDefault()
                                                e.currentTarget.classList.add('bg-primary/20')
                                            }}
                                            onDragLeave={(e) => {
                                                e.currentTarget.classList.remove('bg-primary/20')
                                            }}
                                            onDrop={(e) => {
                                                e.preventDefault()
                                                const fromIdx = parseInt(e.dataTransfer.getData('colIndex'))
                                                handleMoveColumn(fromIdx, idx)
                                                e.currentTarget.classList.remove('bg-primary/10', 'bg-primary/20')
                                            }}
                                        >
                                            <div className="flex items-center justify-center gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                                                <button onClick={() => handleMoveColumn(idx, idx - 1)} disabled={idx === 0} className="p-1 hover:bg-secondary rounded disabled:opacity-20">
                                                    <MoveLeft className="h-3 w-3" />
                                                </button>
                                                <div className="cursor-grab active:cursor-grabbing p-1 bg-primary/10 rounded flex items-center">
                                                    <GripVertical className="h-3 w-3 text-primary" />
                                                    <span className="text-[10px] font-bold text-primary ml-0.5">{idx + 1}</span>
                                                </div>
                                                <button onClick={() => handleMoveColumn(idx, idx + 1)} disabled={idx === table.cols - 1} className="p-1 hover:bg-secondary rounded disabled:opacity-20">
                                                    <MoveRight className="h-3 w-3" />
                                                </button>
                                                <button onClick={() => handleDeleteColumn(idx)} className="p-1 hover:bg-destructive/10 text-destructive rounded ml-1">
                                                    <Trash2 className="h-3 w-3" />
                                                </button>
                                            </div>
                                        </th>
                                    ))}
                                    <th className="w-16 border-b p-2"></th>
                                </tr>
                                {normalizedTable.header && (
                                    <tr>
                                        <th className="border-b border-r p-2 bg-muted/30">H</th>
                                        {table.showSerialIndex && <th className="border-b border-r p-2 bg-muted/30"></th>}
                                        {normalizedTable.header.cells.map((cell: TableCell, cellIdx: number) => (
                                            <th
                                                key={cell.uid}
                                                colSpan={cell.colSpan ?? 1}
                                                rowSpan={cell.rowSpan ?? 1}
                                                className="border-b border-r p-2 bg-muted/10 hover:bg-muted/30 transition-colors cursor-pointer"
                                                style={{ textAlign: cell.align || 'left' }}
                                                onClick={() => setEditingCell({ cellUid: cell.uid, rowUid: normalizedTable.header!.uid, section: 'header', cellIndex: cellIdx })}
                                            >
                                                {renderCellPreview(cell)}
                                            </th>
                                        ))}
                                        <th className="border-b p-2"></th>
                                    </tr>
                                )}
                            </thead>
                            <tbody>
                                {normalizedTable.body.map((row, rIdx) => (
                                    <tr key={row.uid} className="group/row">
                                        <td className="border-b border-r p-1 text-center bg-muted/10 relative">
                                            <div className="flex flex-col items-center gap-1 opacity-0 group-hover/row:opacity-100 transition-opacity">
                                                <button onClick={() => handleMoveRow(rIdx, rIdx - 1)} disabled={rIdx === 0} className="p-1 hover:bg-secondary rounded disabled:opacity-20">
                                                    <MoveUp className="h-3 w-3" />
                                                </button>
                                                <GripVertical className="h-4 w-4 text-muted-foreground/30" />
                                                <button onClick={() => handleMoveRow(rIdx, rIdx + 1)} disabled={rIdx === table.body.length - 1} className="p-1 hover:bg-secondary rounded disabled:opacity-20">
                                                    <MoveDown className="h-3 w-3" />
                                                </button>
                                            </div>
                                        </td>
                                        {table.showSerialIndex && (
                                            <td className="border-b border-r p-2 text-center text-muted-foreground font-medium bg-muted/5">{rIdx + 1}</td>
                                        )}
                                        {row.cells.map((cell, cIdx) => (
                                            <td
                                                key={cell.uid}
                                                colSpan={cell.colSpan ?? 1}
                                                rowSpan={cell.rowSpan ?? 1}
                                                className="border-b border-r p-2 hover:bg-primary/5 transition-colors cursor-pointer"
                                                style={{ textAlign: cell.align || 'left' }}
                                                onClick={() => setEditingCell({ cellUid: cell.uid, rowUid: row.uid, section: 'body', cellIndex: cIdx })}
                                            >
                                                {renderCellPreview(cell)}
                                            </td>
                                        ))}
                                        <td className="p-2 border-b">
                                            <button
                                                onClick={() => handleDeleteRow(row.uid)}
                                                className="p-1.5 rounded-full hover:bg-destructive/10 text-destructive opacity-0 group-hover/row:opacity-100 transition-opacity"
                                                title="Delete Row"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                <tr className="hover:bg-primary/5">
                                    <td colSpan={1 + (table.showSerialIndex ? 1 : 0) + table.cols + 1} className="p-3">
                                        <Button onClick={handleAddRow} variant="ghost" className="w-full border-2 border-dashed border-muted hover:border-primary/50 hover:bg-primary/5 h-12 rounded-xl group/add">
                                            <Plus className="h-4 w-4 mr-2 group-hover/add:scale-125 transition-transform" />
                                            Add New Row
                                        </Button>
                                    </td>
                                </tr>
                            </tbody>
                            {normalizedTable.footer && (
                                <tfoot>
                                    <tr>
                                        <th className="border-t border-r p-2 bg-muted/30">F</th>
                                        {table.showSerialIndex && <th className="border-t border-r p-2 bg-muted/30"></th>}
                                        {normalizedTable.footer.cells.map((cell, cellIdx) => (
                                            <th
                                                key={cell.uid}
                                                colSpan={cell.colSpan ?? 1}
                                                rowSpan={cell.rowSpan ?? 1}
                                                className="border-t border-r p-2 bg-muted/10 hover:bg-muted/30 transition-colors cursor-pointer"
                                                style={{ textAlign: cell.align || 'left' }}
                                                onClick={() => setEditingCell({ cellUid: cell.uid, rowUid: normalizedTable.footer!.uid, section: 'footer', cellIndex: cellIdx })}
                                            >
                                                {renderCellPreview(cell)}
                                            </th>
                                        ))}
                                        <th className="border-t p-2"></th>
                                    </tr>
                                </tfoot>
                            )}
                        </table>
                    </div>
                </div>
            </div>
        </>
    )
}

// Add this helper function outside or inside the component
function renderCellPreview(cell: TableCell) {
    if (cell.type === 'text') {
        return (
            <div className="relative group">
                <p className="text-sm truncate max-w-[200px]">{cell.value || <span className="opacity-30 italic">Empty text</span>}</p>
                {cell.colSpan! > 1 || cell.rowSpan! > 1 ? (
                    <div className="absolute top-0 right-0 p-0.5 bg-primary/20 rounded text-[8px] font-bold text-primary flex gap-1">
                        {cell.colSpan! > 1 && <span>COL {cell.colSpan}</span>}
                        {cell.rowSpan! > 1 && <span>ROW {cell.rowSpan}</span>}
                    </div>
                ) : null}
            </div>
        )
    }
    if (cell.type === 'link') {
        return (
            <div className="flex items-center gap-1.5 text-primary">
                <LinkIcon className="h-3.5 w-3.5" />
                <span className="text-sm font-medium underline underline-offset-4 decoration-primary/30 truncate max-w-[150px]">{cell.text || 'Empty link'}</span>
            </div>
        )
    }
    if (cell.type === 'button') {
        return (
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-primary/10 text-primary text-xs font-bold border border-primary/20 shadow-sm">
                <MousePointerClick className="h-3 w-3" />
                <span className="truncate max-w-[120px] uppercase tracking-tight">{cell.text || 'Action'}</span>
            </div>
        )
    }
    return null
}
