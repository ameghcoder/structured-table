'use client'

import { useEffect, useState } from 'react'
import { Github, Star } from 'lucide-react'

interface GitHubStarsProps {
    repo: string
    size?: 'sm' | 'md'
    showIcon?: boolean
}

export function GitHubStars({ repo, size = 'md', showIcon = true }: GitHubStarsProps) {
    const [stars, setStars] = useState<number | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        // For now, we'll use a placeholder. In production, you'd fetch from GitHub API
        // Example: fetch(`https://api.github.com/repos/${repo}`)
        // For demo purposes, we'll use a mock value
        const fetchStars = async () => {
            try {
                // Replace with actual GitHub API call
                // const response = await fetch(`https://api.github.com/repos/${repo}`)
                // const data = await response.json()
                // setStars(data.stargazers_count)

                // Mock data for now - replace with actual API call
                setStars(42) // Placeholder
                setLoading(false)
            } catch (error) {
                console.error('Failed to fetch GitHub stars:', error)
                setLoading(false)
            }
        }

        fetchStars()
    }, [repo])

    if (loading) {
        return (
            <div className={`inline-flex items-center gap-1.5 ${size === 'sm' ? 'text-xs' : 'text-sm'}`}>
                {showIcon && <Github className={size === 'sm' ? 'h-3 w-3' : 'h-4 w-4'} />}
                <span className="text-muted-foreground">...</span>
            </div>
        )
    }

    if (stars === null) return null

    return (
        <a
            href={`https://github.com/${repo}`}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors ${size === 'sm' ? 'text-xs' : 'text-sm'}`}
        >
            {showIcon && <Github className={size === 'sm' ? 'h-3 w-3' : 'h-4 w-4'} />}
            <Star className={size === 'sm' ? 'h-3 w-3 fill-current' : 'h-4 w-4 fill-current'} />
            <span>{stars.toLocaleString()}</span>
        </a>
    )
}

