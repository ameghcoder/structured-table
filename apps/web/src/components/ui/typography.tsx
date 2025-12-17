import { cn } from "@/lib/utils"
import { Copy } from "lucide-react"
import Link from "next/link"
import { Button } from "./button"
import { CopyButton } from "../layout/copy-button"

export function TypographyBlockquote({ children }: { children: React.ReactNode }) {
    return (
        <blockquote className="mt-6 border-l-2 pl-6 italic">
            {children}
        </blockquote>
    )
}

export function TypographyInlineCode({ children }: { children: React.ReactNode }) {
    return (
        <code className="bg-muted my-4 relative rounded px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold">
            {children}
        </code>
    )
}

export function TypographyBlockCode({ children, lang, langAlign = 'left', className, previewClassName }: { children: React.ReactNode, lang?: string, langAlign?: 'left' | 'right' | 'center', className?: string, previewClassName?: string }) {
    return (
        <code className={cn("w-full h-full block bg-muted my-4 relative rounded-2xl border border-border whitespace-pre font-mono text-sm font-semibold overflow-hidden relative", className)}>
            {
                lang &&
                <div className={cn("bg-accent px-4 py-1", langAlign === "left" ? "text-left" : langAlign === "right" ? "text-right" : "text-center")}>
                    {lang}
                </div>
            }
            <div className="absolute top-0 right-0 size-8 p-0 flex items-center justify-center bg-background rounded-bl-2xl cursor-pointer hover:bg-primary/50">
                <CopyButton data={children} />
            </div>
            <div className={`px-4 py-4 w-full overflow-x-auto ${previewClassName}`}>
                {children}
            </div>
        </code>
    )
}

export function TypographyH1({ children, className }: { children: React.ReactNode, className?: string }) {
    return (
        <h1 className={`scroll-m-20 text-4xl font-extrabold tracking-tight text-balance ${className}`}>
            {children}
        </h1>
    )
}

export function TypographyH2({ children, className }: { children: React.ReactNode, className?: string }) {
    return (
        <h2 className={`scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0 ${className}`}>
            {children}
        </h2>
    )
}
export function TypographyH3({ children, className }: { children: React.ReactNode, className?: string }) {
    return (
        <h3 className={`scroll-m-20 text-2xl font-semibold tracking-tight ${className}`}>
            {children}
        </h3>
    )
}

export function TypographyP({ children, className }: { children: React.ReactNode, className?: string }) {
    return (
        <p className={`leading-7 not-first:mt-6 ${className}`}>
            {children}
        </p>
    )
}

export function TypographyLink({ children, href, className }: { children: React.ReactNode, href: string, className?: string }) {
    return (
        <Link href={href} className={`leading-7 underline ${className}`}>
            {children}
        </Link>
    )
}


export function TypographyList({ list }: { list: React.ReactNode[] }) {
    return (
        <ul className="my-6 ml-6 list-disc [&>li]:mt-2">
            {
                list.map((ch, index) => <li key={index}>{ch}</li>)
            }
        </ul>
    )
}

export function TypographyLead({ children }: { children: React.ReactNode }) {
    return (
        <p className="text-muted-foreground text-xl">
            {children}
        </p>
    )
}

export function TypographyLarge({ children, className }: { children: React.ReactNode, className?: string }) {
    return <div className={`text-lg font-semibold ${className}`}>{children}</div>
}

export function TypographyMuted({ children }: { children: React.ReactNode }) {
    return (
        <p className="text-muted-foreground text-sm">{children}</p>
    )
}
