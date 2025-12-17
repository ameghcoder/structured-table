import type { Metadata } from "next";
import { Roboto_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProviders } from "@/components/provider/theme-provider";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";

const robotoMono = Roboto_Mono({
  subsets: ['latin'],
  weight: ['400', '700'],
  style: ['normal'],
  display: 'swap',
  fallback: [
    'ui-monospace',
    'SFMono-Regular',
    'Menlo',
    'Monaco',
    'Consolas',
    'Liberation Mono'
  ]
})

export const metadata: Metadata = {
  metadataBase: new URL('https://stl-table.vercel.app'),
  title: {
    default: "Structured Table - Write in STL, Render Anywhere",
    template: "%s | Structured Table"
  },
  description: "A framework-agnostic, schema-driven approach to building complex tables. Write in STL (Structured Table Language), render anywhere.",
  openGraph: {
    title: "Structured Table - Write in STL, Render Anywhere",
    description: "A framework-agnostic, schema-driven approach to building complex tables. Write in STL (Structured Table Language), render anywhere.",
    url: 'https://stl-table.vercel.app',
    siteName: 'Structured Table',
    images: [
      {
        url: '/assets/banner/STL.webp',
        width: 1200,
        height: 630,
        alt: 'Structured Table Preview',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Structured Table - Write in STL, Render Anywhere",
    description: "A framework-agnostic, schema-driven approach to building complex tables. Write in STL (Structured Table Language), render anywhere.",
    images: ['/assets/banner/STL.webp'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <meta name="apple-mobile-web-app-title" content="STL Table" />
        <link rel="manifest" href="/site.webmanifest" />
      </head>
      <body
        className={`${robotoMono.className} antialiased`}
      >
        <ThemeProviders>
          <Header />
          {children}
          <Footer />
        </ThemeProviders>
      </body>
    </html>
  );
}
