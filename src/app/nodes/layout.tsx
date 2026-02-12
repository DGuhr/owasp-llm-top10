import React from 'react'

interface NodesLayoutProps {
    children: React.ReactNode;
}

export default function NodesLayout({
    children,
}: NodesLayoutProps) {
    return (
        <div className="min-h-screen bg-white">
            {children}
        </div>
    )
} 