'use client'

import React from 'react'
import { ArrowLeft, Terminal } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { ModeBadge } from './ModeBadge'
import { LabSidebar } from './LabSidebar'
import { LabProgressBar } from './LabProgressBar'

interface LabLayoutProps {
    children: React.ReactNode
}

export function LabLayout({ children }: LabLayoutProps) {
    const router = useRouter()

    return (
        <div className="min-h-screen bg-white">
            {/* Navigation Bar - Fixed */}
            <div className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-innoq-gray-25 shadow-sm backdrop-blur-sm bg-opacity-95">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-innoq-red"></div>
                            <div className="w-3 h-3 rounded-full bg-innoq-apricot"></div>
                            <div className="w-3 h-3 rounded-full bg-innoq-green"></div>
                        </div>

                        <div className="hidden md:flex items-center gap-2 font-mono text-sm text-innoq-gray-75">
                            <Terminal className="w-4 h-4 text-innoq-petrol" />
                            <span className="text-innoq-petrol">lab@llm-sec</span>
                            <span>:</span>
                            <span className="text-innoq-blue">~</span>
                            <span>$</span>
                        </div>

                        {/* Progress Bar */}
                        <LabProgressBar />

                        <ModeBadge />
                    </div>

                        <button
                            onClick={() => router.push('/')}
                            className="flex items-center gap-2 text-innoq-gray-75 hover:text-innoq-petrol transition-all duration-300 font-mono text-sm px-4 py-2 rounded border border-innoq-petrol/20 hover:border-innoq-petrol/60 hover:shadow-sm"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            <span className="hidden sm:inline">cd ..</span>
                            <span className="sm:hidden">Back</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Sidebar */}
            <LabSidebar />

            {/* Spacer for fixed nav */}
            <div className="h-16"></div>

            {/* Main Content with left margin for sidebar */}
            <main className="relative ml-64">
                {children}
            </main>
        </div>
    )
}
