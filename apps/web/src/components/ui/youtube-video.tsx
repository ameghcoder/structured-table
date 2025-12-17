'use client'

import { useState } from 'react'
import { Play } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ShowYouTubeVideoProps {
    videoId: string
    thumbnailUrl?: string
    className?: string
}

export function ShowYouTubeVideo({ videoId, thumbnailUrl, className }: ShowYouTubeVideoProps) {
    const [isPlaying, setIsPlaying] = useState(false)

    const poster = thumbnailUrl || `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`

    if (isPlaying) {
        return (
            <iframe
                className={cn("w-full my-4 aspect-video h-auto border-border border overflow-hidden rounded-2xl", className)}
                src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
                title="YouTube video player"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
            ></iframe>
        )
    }

    return (
        <div
            className={cn("w-full my-4 aspect-video h-auto border-border border overflow-hidden rounded-2xl relative group cursor-pointer bg-muted", className)}
            onClick={() => setIsPlaying(true)}
        >
            {/* Thumbnail Image */}
            <img
                src={poster}
                alt="Video thumbnail"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />

            {/* Overlay */}
            <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors" />

            {/* Play Button */}
            <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-background/90 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300 backdrop-blur-sm">
                    <Play className="w-6 h-6 sm:w-8 sm:h-8 text-foreground fill-foreground ml-1" />
                </div>
            </div>
        </div>
    )
}