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
    Type,
    Link as LinkIcon,
    MousePointerClick,
    Check,
    Settings2,
    Palette
} from 'lucide-react'
import { SanityTable, TableCell, TableRow } from 'structured-table'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { TextCellProps, LinkCellProps, ButtonCellProps } from 'structured-table'
import { fastNanoid } from '@/utils/fast-nanoid'

interface VisualEditorProps {
    table: SanityTable
    setTable: React.Dispatch<React.SetStateAction<SanityTable>>
    themeClassName: string
    tableTheme: string
    setTableTheme: (theme: any) => void
    handleGenerateStl: () => void
}

interface EditingCell {
    cellUid: string
    rowUid: string
    section: 'header' | 'body' | 'footer'
    cellIndex: number
}

export function VisualEditor({ table, setTable, themeClassName, tableTheme, setTableTheme, handleGenerateStl }: VisualEditorProps) {
    const [editingCell, setEditingCell] = useState<EditingCell | null>(null)
    const [cellTypeMenu, setCellTypeMenu] = useState<EditingCell | null>(null)

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


    // Normalize row span for display - cells covered by rowSpan should be hidden
    const normalizedBodyRows = useMemo(() => {
        const rows = table.body.map(row => ({ ...row, cells: [...row.cells] }))

        for (let r = 0; r < rows.length; r++) {
            const row = rows[r]
            for (let c = 0; c < row.cells.length; c++) {
                const cell = row.cells[c]

                if (cell.rowSpan && cell.rowSpan > 1) {
                    const span = cell.rowSpan
                    for (let i = 1; i < span; i++) {
                        const belowRow = rows[r + i]
                        if (!belowRow) break

                        // Mark cells that should be hidden due to rowSpan
                        if (belowRow.cells[c]) {
                            belowRow.cells[c] = { ...belowRow.cells[c], _removedDueToRowSpan: true }
                        }
                    }
                }
            }
        }

        // Filter out removed cells for display
        return rows.map(row => ({
            ...row,
            cells: row.cells.filter(c => !c._removedDueToRowSpan)
        }))
    }, [table.body])

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
                    variant: cell.type === 'button' ? cell.variant : 'default',
                } as ButtonCellProps
            }
        })
        setCellTypeMenu(null)
    }, [updateCell])

    // Render editable cell
    const renderEditableCell = (cell: TableCell, cellUid: string, rowUid: string, section: 'header' | 'body' | 'footer', cellIndex: number) => {
        const isEditing = editingCell?.cellUid === cellUid && editingCell?.rowUid === rowUid && editingCell?.section === section
        const showTypeMenu = cellTypeMenu?.cellUid === cellUid && cellTypeMenu?.rowUid === rowUid && cellTypeMenu?.section === section

        if (isEditing) {
            return (
                <div className="flex flex-col gap-3 p-3 border-2 border-primary rounded-lg bg-primary/5">
                    <div className="flex flex-wrap gap-2">
                        <DropdownMenu open={showTypeMenu} onOpenChange={(open) => open ? setCellTypeMenu({ cellUid, rowUid, section, cellIndex }) : setCellTypeMenu(null)}>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="sm" className="gap-1.5">
                                    <Type className="h-3.5 w-3.5" />
                                    <span className="hidden sm:inline">{cell.type}</span>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuItem onClick={() => handleChangeCellType(cellUid, rowUid, section, 'text')} className="gap-2">
                                    <FileText className="h-4 w-4" />
                                    Text
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleChangeCellType(cellUid, rowUid, section, 'link')} className="gap-2">
                                    <LinkIcon className="h-4 w-4" />
                                    Link
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleChangeCellType(cellUid, rowUid, section, 'button')} className="gap-2">
                                    <MousePointerClick className="h-4 w-4" />
                                    Button
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>

                        <input
                            type="number"
                            placeholder="colSpan"
                            value={cell.colSpan || 1}
                            onChange={(e) => {
                                const val = parseInt(e.target.value) || 1
                                updateCell(cellUid, rowUid, section, (c) => ({ ...c, colSpan: val > 0 ? val : 1 }))
                            }}
                            className="w-16 sm:w-20 px-2 py-1.5 border rounded-md text-sm bg-background"
                            min="1"
                        />

                        <input
                            type="number"
                            placeholder="rowSpan"
                            value={cell.rowSpan || 1}
                            onChange={(e) => {
                                const val = parseInt(e.target.value) || 1
                                updateCell(cellUid, rowUid, section, (c) => ({ ...c, rowSpan: val > 0 ? val : 1 }))
                            }}
                            className="w-16 sm:w-20 px-2 py-1.5 border rounded-md text-sm bg-background"
                            min="1"
                        />

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="sm" className="gap-1.5">
                                    {cell.align === 'center' ? <AlignCenter className="h-3.5 w-3.5" /> :
                                        cell.align === 'right' ? <AlignRight className="h-3.5 w-3.5" /> :
                                            <AlignLeft className="h-3.5 w-3.5" />}
                                    <span className="hidden sm:inline">{cell.align || 'left'}</span>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuItem onClick={() => updateCell(cellUid, rowUid, section, (c) => ({ ...c, align: 'left' }))} className="gap-2">
                                    <AlignLeft className="h-4 w-4" />
                                    Left
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => updateCell(cellUid, rowUid, section, (c) => ({ ...c, align: 'center' }))} className="gap-2">
                                    <AlignCenter className="h-4 w-4" />
                                    Center
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => updateCell(cellUid, rowUid, section, (c) => ({ ...c, align: 'right' }))} className="gap-2">
                                    <AlignRight className="h-4 w-4" />
                                    Right
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>

                        <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => {
                                handleDeleteCell(cellUid, rowUid, section)
                                setEditingCell(null)
                            }}
                            className="gap-1.5"
                        >
                            <Trash2 className="h-3.5 w-3.5" />
                            <span className="hidden sm:inline">Delete</span>
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => setEditingCell(null)} className="gap-1.5">
                            <Check className="h-3.5 w-3.5" />
                            <span className="hidden sm:inline">Done</span>
                        </Button>
                    </div>

                    <div className="flex flex-col gap-2.5">
                        {cell.type === 'text' && (
                            <input
                                type="text"
                                value={cell.value}
                                onChange={(e) => updateCell(cellUid, rowUid, section, (c) => ({ ...c, value: e.target.value } as TextCellProps))}
                                className="w-full px-3 py-2 border rounded-md text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
                                placeholder="Enter text"
                            />
                        )}
                        {cell.type === 'link' && (
                            <>
                                <input
                                    type="text"
                                    value={cell.text}
                                    onChange={(e) => updateCell(cellUid, rowUid, section, (c) => ({ ...c, text: e.target.value } as LinkCellProps))}
                                    className="w-full px-3 py-2 border rounded-md text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
                                    placeholder="Link text"
                                />
                                <input
                                    type="text"
                                    value={cell.href}
                                    onChange={(e) => updateCell(cellUid, rowUid, section, (c) => ({ ...c, href: e.target.value } as LinkCellProps))}
                                    className="w-full px-3 py-2 border rounded-md text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
                                    placeholder="URL"
                                />
                                <label className="flex items-center gap-2 text-sm cursor-pointer hover:text-primary transition-colors">
                                    <input
                                        type="checkbox"
                                        checked={cell.newTab || false}
                                        onChange={(e) => updateCell(cellUid, rowUid, section, (c) => ({ ...c, newTab: e.target.checked } as LinkCellProps))}
                                        className="w-4 h-4 rounded border-gray-300"
                                    />
                                    Open in new tab
                                </label>
                            </>
                        )}
                        {cell.type === 'button' && (
                            <>
                                <input
                                    type="text"
                                    value={cell.text}
                                    onChange={(e) => updateCell(cellUid, rowUid, section, (c) => ({ ...c, text: e.target.value } as ButtonCellProps))}
                                    className="w-full px-3 py-2 border rounded-md text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
                                    placeholder="Button text"
                                />
                                <input
                                    type="text"
                                    value={cell.url || ''}
                                    onChange={(e) => updateCell(cellUid, rowUid, section, (c) => ({ ...c, url: e.target.value } as ButtonCellProps))}
                                    className="w-full px-3 py-2 border rounded-md text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
                                    placeholder="URL (optional)"
                                />
                                <input
                                    type="text"
                                    value={cell.action || ''}
                                    onChange={(e) => updateCell(cellUid, rowUid, section, (c) => ({ ...c, action: e.target.value } as ButtonCellProps))}
                                    className="w-full px-3 py-2 border rounded-md text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
                                    placeholder="Action (optional)"
                                />
                                <input
                                    type="text"
                                    value={cell.targetId || ''}
                                    onChange={(e) => updateCell(cellUid, rowUid, section, (c) => ({ ...c, targetId: e.target.value } as ButtonCellProps))}
                                    className="w-full px-3 py-2 border rounded-md text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
                                    placeholder="Target ID (optional)"
                                />
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="outline" size="sm" className="gap-1.5">
                                            <span className="hidden sm:inline">{cell.variant || 'default'}</span>
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent className='w-fit'>
                                        <DropdownMenuItem onClick={() => updateCell(cellUid, rowUid, section, (c) => ({ ...c, variant: 'default' }))} className="gap-2">
                                            Default
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => updateCell(cellUid, rowUid, section, (c) => ({ ...c, variant: 'outline' }))} className="gap-2">
                                            Outline
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => updateCell(cellUid, rowUid, section, (c) => ({ ...c, variant: 'ghost' }))} className="gap-2">
                                            Ghost
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </>
                        )}
                    </div>
                </div>
            )
        }

        return (
            <div
                className="relative group cursor-pointer min-h-8 flex items-center"
                onClick={() => setEditingCell({ cellUid, rowUid, section, cellIndex })}
            >
                <div className="absolute inset-0 border-2 border-dashed border-transparent group-hover:border-primary/50 opacity-0 group-hover:opacity-100 transition-opacity z-10 rounded" />
                <div className="relative z-0 w-full">
                    {cell.type === 'text' && <p className="text-sm">{cell.value || <span className="text-muted-foreground italic">(empty)</span>}</p>}
                    {cell.type === 'link' && (
                        <a href={cell.href} target={cell.newTab ? '_blank' : '_self'} className="text-sm text-primary hover:underline flex items-center gap-1">
                            <LinkIcon className="h-3 w-3" />
                            {cell.text || <span className="text-muted-foreground italic">(empty)</span>}
                        </a>
                    )}
                    {cell.type === 'button' && (
                        <button className="text-sm px-2 py-1 bg-primary/10 text-primary rounded hover:bg-primary/20 transition-colors flex items-center gap-1">
                            <MousePointerClick className="h-3 w-3" />
                            {cell.text || <span className="text-muted-foreground italic">(empty)</span>}
                        </button>
                    )}
                </div>
            </div>
        )
    }

    return (
        <>
            {/* Controls */}
            <div className="flex flex-col gap-4 p-3 sm:p-4 border rounded-lg bg-card shadow-sm">
                <div className="flex items-center justify-between">
                    <h2 className="text-base sm:text-lg font-semibold flex items-center gap-2">
                        <Settings2 className="h-4 w-4 sm:h-5 sm:w-5" />
                        <span>Table Editor</span>
                    </h2>
                    <Button onClick={handleGenerateStl} size="sm" className="gap-1.5 flex-initial">
                        <Code className="h-3.5 w-3.5" />
                        <span className="inline">Export STL</span>
                    </Button>
                </div>

                {/* Table Name and Columns */}
                <div className="flex flex-col sm:flex-row gap-2">
                    <div className="flex-1 relative">
                        <FileText className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <input
                            type="text"
                            value={table.name}
                            onChange={(e) => setTable(prev => ({ ...prev, name: e.target.value }))}
                            placeholder="Table name"
                            className="w-full pl-8 pr-2 py-1.5 border rounded-md text-sm bg-background"
                        />
                    </div>
                    <div className="relative sm:w-24">
                        <Columns className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <input
                            type="number"
                            value={table.cols}
                            readOnly
                            placeholder="Cols"
                            className="w-full pl-8 pr-2 py-1.5 border rounded-md text-sm bg-muted"
                            title="Column count is managed by Add/Delete Column buttons"
                        />
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap items-center gap-2">
                    <Button onClick={handleAddRow} variant="outline" size="sm" className="gap-1.5 flex-1 sm:flex-initial">
                        <Plus className="h-3.5 w-3.5" />
                        <Rows className="h-3.5 w-3.5 sm:hidden" />
                        <span className="hidden sm:inline">Add Row</span>
                    </Button>
                    <Button onClick={handleAddColumn} variant="outline" size="sm" className="gap-1.5 flex-1 sm:flex-initial">
                        <Plus className="h-3.5 w-3.5" />
                        <Columns className="h-3.5 w-3.5 sm:hidden" />
                        <span className="hidden sm:inline">Add Column</span>
                    </Button>
                    {table.cols > 0 && (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="sm" className="gap-1.5 flex-1 sm:flex-initial">
                                    <Trash2 className="h-3.5 w-3.5" />
                                    <span className="hidden sm:inline">Delete Column</span>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
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
                            <Button variant="outline" size="sm" className="gap-1.5 flex-1 sm:flex-initial">
                                <Palette className="h-3.5 w-3.5" />
                                <span className="hidden sm:inline">Theme: {tableTheme}</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
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
                    <label className="flex items-center gap-2 text-sm cursor-pointer hover:text-primary transition-colors">
                        <input
                            type="checkbox"
                            checked={table.showSerialIndex}
                            onChange={(e) => setTable(prev => ({ ...prev, showSerialIndex: e.target.checked }))}
                            className="w-4 h-4 rounded border-gray-300"
                        />
                        <Hash className="h-3.5 w-3.5" />
                        <span>Serial Index</span>
                    </label>
                    <label className="flex items-center gap-2 text-sm cursor-pointer hover:text-primary transition-colors">
                        <input
                            type="checkbox"
                            checked={!!table.header}
                            onChange={handleToggleHeader}
                            className="w-4 h-4 rounded border-gray-300"
                        />
                        <FileText className="h-3.5 w-3.5" />
                        <span>Header</span>
                    </label>
                    <label className="flex items-center gap-2 text-sm cursor-pointer hover:text-primary transition-colors">
                        <input
                            type="checkbox"
                            checked={!!table.footer}
                            onChange={handleToggleFooter}
                            className="w-4 h-4 rounded border-gray-300"
                        />
                        <FileText className="h-3.5 w-3.5" />
                        <span>Footer</span>
                    </label>
                </div>
            </div>

            {/* Live Editor */}
            <div className="border rounded-lg p-3 sm:p-4 bg-card shadow-sm">
                <div className="flex items-center gap-2 mb-4 pb-3 border-b">
                    <Eye className="h-4 w-4 text-primary" />
                    <h3 className="text-sm sm:text-base font-semibold">Live Editor</h3>
                </div>
                <div className="overflow-x-auto -mx-2 sm:mx-0">
                    <div className="inline-block min-w-full align-middle">
                        <table className="w-full border-collapse text-sm">
                            {table.header && (
                                <thead>
                                    <tr>
                                        {table.showSerialIndex && <th className="border p-2 bg-muted text-center font-medium">#</th>}
                                        {table.header.cells.map((cell, idx) => (
                                            <th
                                                key={cell.uid}
                                                colSpan={cell.colSpan ?? 1}
                                                rowSpan={cell.rowSpan ?? 1}
                                                className="border p-2 bg-muted font-medium"
                                                style={{ textAlign: cell.align || 'left' }}
                                            >
                                                {renderEditableCell(cell, cell.uid, table.header!.uid, 'header', idx)}
                                            </th>
                                        ))}
                                        <th className="border p-2 bg-muted text-center font-medium">Actions</th>
                                    </tr>
                                </thead>
                            )}
                            <tbody>
                                {normalizedBodyRows.map((row) => {
                                    // Find original row to get correct row index
                                    const originalRowIndex = table.body.findIndex(r => r.uid === row.uid)
                                    return (
                                        <tr key={row.uid}>
                                            {table.showSerialIndex && (
                                                <td className="border p-2 text-center bg-muted font-medium">{originalRowIndex + 1}</td>
                                            )}
                                            {row.cells.map((cell, cellIdx) => {
                                                // Find original cell to get correct index
                                                const originalRow = table.body.find(r => r.uid === row.uid)
                                                const originalCellIndex = originalRow?.cells.findIndex(c => c.uid === cell.uid) ?? cellIdx
                                                return (
                                                    <td
                                                        key={cell.uid}
                                                        colSpan={cell.colSpan ?? 1}
                                                        rowSpan={cell.rowSpan ?? 1}
                                                        className="border p-2"
                                                        style={{ textAlign: cell.align || 'left' }}
                                                    >
                                                        {renderEditableCell(cell, cell.uid, row.uid, 'body', originalCellIndex)}
                                                    </td>
                                                )
                                            })}
                                            <td className="p-2 border">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleDeleteRow(row.uid)}
                                                    className="text-destructive hover:text-destructive gap-1.5"
                                                >
                                                    <Trash2 className="h-3.5 w-3.5" />
                                                    <span className="hidden sm:inline">Delete</span>
                                                </Button>
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                            {table.footer && (
                                <tfoot>
                                    <tr>
                                        {table.showSerialIndex && <th className="border p-2 bg-muted text-center font-medium">#</th>}
                                        {table.footer.cells.map((cell, idx) => (
                                            <th
                                                key={cell.uid}
                                                colSpan={cell.colSpan ?? 1}
                                                rowSpan={cell.rowSpan ?? 1}
                                                className="border p-2 bg-muted font-medium"
                                                style={{ textAlign: cell.align || 'left' }}
                                            >
                                                {renderEditableCell(cell, cell.uid, table.footer!.uid, 'footer', idx)}
                                            </th>
                                        ))}
                                        <th className="border p-2 bg-muted"></th>
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
