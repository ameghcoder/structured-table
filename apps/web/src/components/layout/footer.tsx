/* eslint-disable @next/next/no-img-element */

import Link from "next/link";

import { REPO_URLS, SOCIAL_URLS } from "@/constants/url";

const Footer = () => {
    return (
        <>
            <div className="md:pt-8 md:px-4 lg:px-8 lg:pt-16 pb-36 sm:pb-32 md:rounded-t-4xl border-border/25 border-t  relative bg-accent/25 overflow-hidden" >
                <div className="relative z-50 bg-background py-8 sm:p-8 lg:p-12 flex flex-col md:rounded-4xl md:border border-border shadow-xl">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-8">
                        <div className="w-md mx-auto sm:mx-0 flex flex-col items-center md:items-start max-w-sm gap-4 md:gap-6">
                            <div className="flex items-center gap-2 mb-4">
                                <img
                                    className="size-8 border border-border rounded-lg"
                                    src="/assets/logo/sanity-table-bg.png"
                                    alt="Sanity Table Logo"
                                />
                                <span className="font-semibold">Sanity Tables</span>
                            </div>
                            <span className="text-sm text-center sm:text-left">
                                Fast, free and open source. <br />Write in STL (Structured Table Language), render anywhere.
                            </span>
                        </div>
                        <div className="w-full sm:w-fit flex flex-col items-center md:items-end justify-center md:justify-end gap-4">
                            <Link title="Source on GitHub" href={REPO_URLS['structured-table']} className="w-fit flex gap-2 items-center rounded-full border-border border bg-secondary/50 pl-4 hover:bg-secondary cursor-pointer">
                                <span className="text-muted-foreground text-sm font-medium">Source on GitHub</span>
                                <span className="size-10 rounded-full bg-white p-1">
                                    <img src="/assets/social/github.svg" alt="github logo" />
                                </span>
                            </Link>
                            <ul className="text-sm flex items-center flex-col md:flex-row flex-wrap gap-4 font-medium text-muted-foreground">
                                <li><Link href="/playground" className="hover:text-foreground">Playground</Link></li>
                                <li>|</li>
                                <li><Link href="/docs" className="hover:text-foreground">Documentation</Link></li>
                                <li>|</li>
                                <li><Link href={SOCIAL_URLS['github']} className="hover:text-foreground">Creator</Link></li>
                            </ul>
                            <ul className="text-sm flex items-center flex-col md:flex-row flex-wrap gap-4 font-medium text-muted-foreground">
                                <li><Link href={REPO_URLS['sanity-plugin']} className="hover:text-foreground">Sanity Table Plugin</Link></li>
                            </ul>
                        </div>
                    </div>
                    <hr className="my-6" />
                    <div className="pt-2 text-center">
                        <a href={REPO_URLS["license"]} target="_blank" rel="noopener noreferrer" >
                            <span className="text-sm font-mono font-medium text-muted-foreground hover:text-foreground">Open Source under MIT License</span>
                        </a>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Footer