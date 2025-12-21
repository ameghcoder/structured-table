import { cn } from '@/lib/utils';
import React from 'react';

interface BgGradientProps {
    colors: (string | string[]);
    className?: string;
    children?: React.ReactNode;
    opacity?: number;
    direction?: 'to bottom right' | 'to bottom left' | 'to top right' | 'to top left' | 'to right' | 'to left' | 'to top' | 'to bottom';
    position?: 'fixed' | 'relative' | 'absolute'
}

const isValidHexColor = (color: string): boolean => {
    return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color);
};

const normalizeColor = (color: string): string => {
    const colorLower = color.toLowerCase().trim();

    // If it's a valid hex, return it
    if (isValidHexColor(colorLower)) {
        return colorLower;
    }

    // If it's not a valid hex color, return a default color
    console.warn(`Invalid hex color "${color}" provided to BgGradient. Using default color.`);
    return '#808080'; // Default to gray
};

const BgGradient: React.FC<BgGradientProps> = ({
    colors,
    className,
    children,
    opacity = 0.8,
    direction = 'to bottom right',
    position = 'fixed'
}) => {
    // Convert colors to array if it's a single string
    const colorsArray = Array.isArray(colors) ? colors : [colors];

    // Ensure we have between 2 and 4 colors and normalize them
    const validColors = colorsArray
        .slice(0, Math.min(Math.max(colorsArray.length, 2), 4))
        .map(normalizeColor);

    // If we have less than 4 colors, duplicate the last color to fill the array
    while (validColors.length < 4) {
        validColors.push(validColors[validColors.length - 1]);
    }

    // Create gradient stops with proper color distribution
    const gradientStops = validColors.map((color, index) => {
        const stop = (index / (validColors.length - 1)) * 100;
        return `${color} ${stop}%`;
    }).join(', ');

    return (
        <div className={`${position} inset-0 -z-10 transition-all`}>
            <div
                className={cn(
                    'w-full h-full relative',
                    className
                )}
                style={{
                    backgroundImage: `linear-gradient(${direction}, ${gradientStops})`,
                    opacity: opacity
                }}
            >
                {children}
            </div>
            <div className="absolute inset-0 bg-linear-to-b from-background/80 via-background/90 to-background/95" />
        </div>
    );
};

export default BgGradient; 