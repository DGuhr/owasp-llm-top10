'use client'

import React from 'react'
import { getCompletionPercentage, getCompletedCount, ALL_LABS } from '@/lib/lab-progress'

export function LabProgressBar() {
  const [percentage, setPercentage] = React.useState(0)
  const [completed, setCompleted] = React.useState(0)

  React.useEffect(() => {
    const updateProgress = () => {
      setPercentage(getCompletionPercentage())
      setCompleted(getCompletedCount())
    }

    updateProgress()

    window.addEventListener('lab-progress-updated', updateProgress)
    return () => window.removeEventListener('lab-progress-updated', updateProgress)
  }, [])

  return (
    <div className="flex items-center gap-3">
      {/* Progress percentage */}
      <div className="hidden sm:flex items-center gap-2 font-mono text-xs text-innoq-gray-75">
        <span className="text-innoq-petrol">{completed}/{ALL_LABS.length}</span>
        <span>labs</span>
      </div>

      {/* Progress bar */}
      <div className="w-24 h-2 bg-innoq-gray-25 rounded-full overflow-hidden border border-innoq-petrol/20">
        <div
          className="h-full bg-gradient-to-r from-innoq-petrol to-innoq-green transition-all duration-500 ease-out relative overflow-hidden"
          style={{ width: `${percentage}%` }}
        >
          {/* Animated shine effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
        </div>
      </div>

      {/* Percentage text */}
      <span className="font-mono text-xs text-innoq-petrol font-bold min-w-[3ch]">
        {percentage}%
      </span>
    </div>
  )
}
