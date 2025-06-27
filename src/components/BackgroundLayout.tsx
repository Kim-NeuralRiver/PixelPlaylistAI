'use client';

import Image from 'next/image';
import { ReactNode } from 'react';

interface BackgroundLayoutProps {
    children: ReactNode;
}

export default function BackgroundLayout({ children }: BackgroundLayoutProps) {
    return (
        <div className="min-h-screen relative">
            {/* Global Background Image */}
            <div className="fixed inset-0 z-0">
                <Image 
                    src="/BackgroundImg2.svg" 
                    alt="PixelPlaylistBackground" 
                    fill
                    className="object-cover opacity-70"
                    priority
                />
            </div>
            {/* Content Container */}
            <div className="relative z-10">
                {children}
            </div>
        </div>
    );
}