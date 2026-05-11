'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Book, FileText, ChevronDown, Code, Layers, Layout, MousePointerClick, Link as LinkIcon, Maximize2, AlignLeft, Monitor, Heading, CornerDownLeft, Tag } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'

const docsNavigationLatest = [
    {
        title: 'Getting Started',
        items: [
            { title: 'Introduction', href: '/docs', icon: FileText },
        ],
    },
    {
        title: 'STL Reference',
        items: [
            { title: 'Overview', href: '/docs/stl-syntax', icon: Code },
            { title: 'Buttons', href: '/docs/stl-syntax/buttons', icon: MousePointerClick },
            { title: 'Links', href: '/docs/stl-syntax/links', icon: LinkIcon },
            { title: 'Row & Col Span', href: '/docs/stl-syntax/spanning', icon: Maximize2 },
            { title: 'Alignment', href: '/docs/stl-syntax/alignment', icon: AlignLeft },
            { title: 'Line Breaks', href: '/docs/stl-syntax/line-breaks', icon: CornerDownLeft, isNew: true },
            { title: 'Classes', href: '/docs/stl-syntax/classes', icon: Tag, isNew: true },
            { title: 'cellType', href: '/docs/stl-syntax/celltype', icon: Heading },
        ],
    },
    {
        title: 'STL Renderers',
        items: [
            { title: 'Overview', href: '/docs/stl-renderer', icon: Monitor },
            { title: 'React', href: '/docs/stl-renderer/react', icon: Code },
            { title: 'Vue', href: '/docs/stl-renderer/vue', icon: Layout },
            { title: 'Svelte', href: '/docs/stl-renderer/svelte', icon: Layers, isNew: true },
        ],
    },
    {
        title: 'Integration',
        items: [
            { title: 'Sanity Studio', href: '/docs/integration/sanity-studio', icon: Layers },
            { title: 'Sanity: stlParsed', href: '/docs/integration/sanity-studio/stl-parsed', icon: FileText, isNew: true },
            { title: 'Frontend Usage', href: '/docs/integration/frontend', icon: Layout, isUpdated: true },
        ],
    },
]

const docsNavigationV021 = [
    {
        title: 'Getting Started',
        items: [
            { title: 'Introduction', href: '/docs/v0.2.1', icon: FileText },
        ],
    },
    {
        title: 'STL Reference',
        items: [
            { title: 'Overview', href: '/docs/v0.2.1/stl-syntax', icon: Code },
            { title: 'Buttons', href: '/docs/v0.2.1/stl-syntax/buttons', icon: MousePointerClick },
            { title: 'Links', href: '/docs/v0.2.1/stl-syntax/links', icon: LinkIcon },
            { title: 'Row & Col Span', href: '/docs/v0.2.1/stl-syntax/spanning', icon: Maximize2 },
            { title: 'Alignment', href: '/docs/v0.2.1/stl-syntax/alignment', icon: AlignLeft },
            { title: 'cellType', href: '/docs/v0.2.1/stl-syntax/celltype', icon: Heading },
        ],
    },
    {
        title: 'STL Renderers',
        items: [
            { title: 'Overview', href: '/docs/v0.2.1/stl-renderer', icon: Monitor },
            { title: 'React', href: '/docs/v0.2.1/stl-renderer/react', icon: Code },
            { title: 'Vue', href: '/docs/v0.2.1/stl-renderer/vue', icon: Layout },
        ],
    },
    {
        title: 'Integration',
        items: [
            { title: 'Sanity Studio', href: '/docs/v0.2.1/integration/sanity-studio', icon: Layers },
            { title: 'Frontend Usage', href: '/docs/v0.2.1/integration/frontend', icon: Layout },
        ],
    },
]

const versions = [
    { label: 'v0.3.0 (Latest)', value: 'v0.3.0', path: '/docs' },
    { label: 'v0.2.1', value: 'v0.2.1', path: '/docs/v0.2.1' },
]

export default function DocsLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const pathname = usePathname()
    const router = useRouter()
    const [sidebarOpen, setSidebarOpen] = useState(false)
    
    const isV021 = pathname?.startsWith('/docs/v0.2.1')
    const currentVersion = isV021 ? versions[1] : versions[0]
    const currentNavigation = isV021 ? docsNavigationV021 : docsNavigationLatest

    const isActive = (href: string) => {
        if (href === '/docs' || href === '/docs/v0.2.1') return pathname === href
        return pathname?.startsWith(href)
    }

    return (
        <div className="min-h-screen bg-background ">
            {/* Docs Header */}
            <div className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-14 items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Link href="/docs" className="flex items-center gap-2 font-semibold">
                                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10">
                                    <Book className="h-4 w-4 text-primary" />
                                </div>
                                <span>Documentation</span>
                            </Link>
                        </div>
                        <div className="flex items-center gap-3">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-foreground">
                                        <span>{currentVersion.label}</span>
                                        <ChevronDown className="h-3.5 w-3.5" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    {versions.map((version) => (
                                        <DropdownMenuItem
                                            key={version.value}
                                            onClick={() => router.push(version.path)}
                                            className={currentVersion.value === version.value ? 'bg-primary/10' : 'cursor-pointer'}
                                        >
                                            {version.label}
                                        </DropdownMenuItem>
                                    ))}
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mx-auto max-w-7xl">
                <div className="flex items-start">
                    {/* Sidebar - Removed bg-muted/30 */}
                    <aside className="hidden lg:block w-64 border-r h-[calc(100vh-3.5rem)] sticky top-14">
                        <nav className="p-4 space-y-8 overflow-y-auto h-full">
                            {currentNavigation.map((section) => (
                                <div key={section.title}>
                                    <h3 className="mb-3 text-sm font-medium text-foreground px-2">
                                        {section.title}
                                    </h3>
                                    <ul className="space-y-0.5">
                                        {section.items.map((item) => {
                                            const Icon = item.icon
                                            const active = isActive(item.href)
                                            return (
                                                <li key={item.href}>
                                                    <Link
                                                        href={item.href}
                                                        className={`flex items-center gap-2.5 rounded-2xl px-2 py-1.5 text-sm transition-colors ${active
                                                            ? 'bg-primary/10 text-primary font-medium'
                                                            : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                                                            }`}
                                                    >
                                                        <Icon className="h-4 w-4 opacity-70" />
                                                        <span>{item.title}</span>
                                                        {(item as any).isNew && (
                                                            <span className="ml-auto text-[10px] bg-primary/20 text-primary px-1.5 py-0.5 rounded-md font-semibold leading-none">
                                                                New
                                                            </span>
                                                        )}
                                                        {(item as any).isUpdated && (
                                                            <span className="ml-auto text-[10px] bg-amber-500/20 text-amber-500 px-1.5 py-0.5 rounded-md font-semibold leading-none">
                                                                Updated
                                                            </span>
                                                        )}
                                                    </Link>
                                                </li>
                                            )
                                        })}
                                    </ul>
                                </div>
                            ))}
                        </nav>
                    </aside>

                    {/* Mobile Sidebar Toggle */}
                    <div className="lg:hidden fixed bottom-6 right-6 z-50">
                        <Button
                            size="icon"
                            className="rounded-full shadow-xl h-12 w-12"
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                        >
                            <Book className="h-5 w-5" />
                        </Button>
                    </div>

                    {/* Mobile Sidebar Overlay */}
                    {sidebarOpen && (
                        <>
                            <div
                                className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
                                onClick={() => setSidebarOpen(false)}
                            />
                            <aside className="fixed left-0 top-14 z-50 h-[calc(100vh-3.5rem)] w-72 border-r bg-background lg:hidden overflow-y-auto slide-in-from-left duration-200 animate-in">
                                <nav className="p-6 space-y-8">
                                    {currentNavigation.map((section) => (
                                        <div key={section.title}>
                                            <h3 className="mb-3 text-sm font-medium text-foreground px-2">
                                                {section.title}
                                            </h3>
                                            <ul className="space-y-1">
                                                {section.items.map((item) => {
                                                    const Icon = item.icon
                                                    const active = isActive(item.href)
                                                    return (
                                                        <li key={item.href}>
                                                            <Link
                                                                href={item.href}
                                                                onClick={() => setSidebarOpen(false)}
                                                                className={`flex items-center gap-2.5 rounded-md px-2 py-2 text-sm transition-colors ${active
                                                                    ? 'bg-primary/10 text-primary font-medium'
                                                                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                                                                    }`}
                                                            >
                                                                <Icon className="h-4 w-4 opacity-70" />
                                                                <span>{item.title}</span>
                                                                {(item as any).isNew && (
                                                                    <span className="ml-auto text-[10px] bg-primary/20 text-primary px-1.5 py-0.5 rounded-md font-semibold leading-none">
                                                                        New
                                                                    </span>
                                                                )}
                                                                {(item as any).isUpdated && (
                                                                    <span className="ml-auto text-[10px] bg-amber-500/20 text-amber-500 px-1.5 py-0.5 rounded-md font-semibold leading-none">
                                                                        Updated
                                                                    </span>
                                                                )}
                                                            </Link>
                                                        </li>
                                                    )
                                                })}
                                            </ul>
                                        </div>
                                    ))}
                                </nav>
                            </aside>
                        </>
                    )}

                    {/* Main Content */}
                    <main className="flex-1 min-w-0">
                        <div className="px-4 sm:px-6 lg:px-8 py-8">
                            {children}
                        </div>
                    </main>
                </div>
            </div>
        </div>
    )
}
