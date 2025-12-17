"use client";

import * as React from "react";
import { GripVertical } from "lucide-react";
import { cn } from "@/lib/utils";

interface CompareSliderProps {
    itemOne: React.ReactNode;
    itemTwo: React.ReactNode;
    defaultPosition?: number;
    className?: string;
    itemOneClassName?: string;
    itemTwoClassName?: string;
}

export function CompareSlider({
    itemOne,
    itemTwo,
    defaultPosition = 50,
    className,
    itemOneClassName,
    itemTwoClassName,
}: CompareSliderProps) {
    const [position, setPosition] = React.useState(defaultPosition);
    const containerRef = React.useRef<HTMLDivElement>(null);
    const isDragging = React.useRef(false);

    const handleMove = React.useCallback(
        (clientX: number) => {
            if (containerRef.current) {
                const rect = containerRef.current.getBoundingClientRect();
                const x = clientX - rect.left;
                const percentage = Math.min(
                    Math.max((x / rect.width) * 100, 0),
                    100
                );
                requestAnimationFrame(() => setPosition(percentage));
            }
        },
        []
    );

    const handleMouseDown = React.useCallback(
        (e: React.MouseEvent) => {
            e.preventDefault();
            isDragging.current = true;
        },
        []
    );

    const handleTouchStart = React.useCallback(
        (e: React.TouchEvent) => {
            isDragging.current = true;
        },
        []
    );

    React.useEffect(() => {
        const handleMouseUp = () => {
            isDragging.current = false;
        };

        const handleMouseMove = (e: MouseEvent) => {
            if (isDragging.current) {
                handleMove(e.clientX);
            }
        };

        const handleTouchEnd = () => {
            isDragging.current = false;
        };

        const handleTouchMove = (e: TouchEvent) => {
            if (isDragging.current) {
                handleMove(e.touches[0].clientX);
            }
        };

        document.addEventListener("mouseup", handleMouseUp);
        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("touchend", handleTouchEnd);
        document.addEventListener("touchmove", handleTouchMove);

        return () => {
            document.removeEventListener("mouseup", handleMouseUp);
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("touchend", handleTouchEnd);
            document.removeEventListener("touchmove", handleTouchMove);
        };
    }, [handleMove]);


    return (
        <div
            ref={containerRef}
            className={cn(
                "group relative select-none w-full grid rounded-xl border border-border shadow-sm overflow-hidden ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
                className
            )}
            style={{
                gridTemplateAreas: "'stack'"
            }}
        >
            {/* Item One (Left Side / Bottom Layer) */}
            <div
                className={cn("w-full h-full min-h-[400px]", itemOneClassName)}
                style={{ gridArea: "stack" }}
            >
                {itemOne}
            </div>

            {/* Item Two (Right Side / Top Layer) */}
            <div
                className={cn("w-full h-full min-h-[400px] bg-background", itemTwoClassName)}
                style={{
                    gridArea: "stack",
                    clipPath: `inset(0 0 0 ${position}%)`,
                }}
            >
                {itemTwo}
            </div>

            {/* Drag Handle */}
            <div
                className="absolute top-0 bottom-0 z-30 cursor-col-resize"
                style={{ left: `${position}%` }}
                onMouseDown={handleMouseDown}
                onTouchStart={handleTouchStart}
            >
                {/* Visual Line */}
                <div className="absolute top-0 bottom-0 w-0.5 -ml-[1px] bg-gradient-to-b from-transparent via-primary/50 to-transparent group-hover:via-primary transition-colors" />

                {/* Touch/Interaction Area - Wider for mobile */}
                <div className="absolute top-0 bottom-0 w-8 -ml-4 bg-transparent" />

                {/* Handle Knob */}
                <div className="absolute top-1/2 left-0 -translate-x-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background shadow-lg transition-transform group-hover:scale-110 active:scale-95">
                    <GripVertical className="h-4 w-4 text-muted-foreground" />
                </div>
            </div>
        </div>
    );
}
