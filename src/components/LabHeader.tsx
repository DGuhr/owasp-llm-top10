'use client'

import React from 'react'
import { LucideIcon } from 'lucide-react'

interface LabHeaderProps {
  labNumber: string
  title: string
  description: string
  objective?: string
  difficulty?: 'EASY' | 'MEDIUM' | 'HARD' | 'EXPERT'
  icon: LucideIcon
  accentColor: string // Main accent color for this lab
}

export function LabHeader({
  labNumber,
  title,
  description,
  objective,
  difficulty = 'MEDIUM',
  icon: Icon,
  accentColor
}: LabHeaderProps) {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="border-l-4 pl-6 py-2 bg-[#f7f7f7]/50" style={{ borderColor: accentColor }}>
        <div className="flex items-center gap-3 mb-3">
          <Icon className="w-8 h-8" style={{ color: accentColor }} />
          <h1 className="text-3xl font-display text-innoq-gray">
            <span className="font-mono" style={{ color: accentColor }}>[{labNumber}]</span> {title}
          </h1>
        </div>
        <div className="font-mono text-xs text-innoq-gray-75 flex items-center gap-2">
          <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: accentColor }}></div>
          <span>CHALLENGE ACTIVE</span>
        </div>
      </div>

      <div className="text-innoq-gray-75 space-y-3 leading-relaxed">
        <p>{description}</p>
        {objective && (
          <div className="bg-[#f7f7f7] border-l-2 p-4 rounded" style={{ borderColor: accentColor }}>
            <p className="text-sm font-mono">
              <span style={{ color: accentColor }}>OBJECTIVE:</span>{' '}
              <span className="text-innoq-gray">{objective}</span>
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
