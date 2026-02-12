'use client'

import React from 'react'

interface TerminalSectionProps {
  title: string
  children: React.ReactNode
  accentColor: string
  className?: string
}

export function TerminalSection({ title, children, accentColor, className = '' }: TerminalSectionProps) {
  return (
    <div
      className={`bg-[#f7f7f7] border rounded-lg p-6 ${className}`}
      style={{
        borderColor: `${accentColor}33`, // 20% opacity
      }}
    >
      <h2 className="text-xl font-display mb-4 flex items-center gap-2" style={{ color: accentColor }}>
        <span className="text-innoq-gray-75">[</span>
        {title}
        <span className="text-innoq-gray-75">]</span>
      </h2>
      {children}
    </div>
  )
}
