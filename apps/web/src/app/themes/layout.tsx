import { Metadata } from "next"

export const metadata: Metadata = {
    title: "Themes",
    description: "Explore and copy beautiful pre-built themes for Structured Table. Includes Simple, Border, Stripe, Tailwind, and Shadcn designs.",
}

export default function ThemesLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <>
            {children}
        </>
    )
}
