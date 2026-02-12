'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Check, Lock } from 'lucide-react'
import { ALL_LABS, getLabProgress, isLabCompleted } from '@/lib/lab-progress'
import { LAB_COLORS } from '@/lib/lab-colors'

export function LabSidebar() {
  const pathname = usePathname()
  const [progress, setProgress] = React.useState(() => getLabProgress())
  const [footerHeight, setFooterHeight] = React.useState(0)

  React.useEffect(() => {
    const handleProgressUpdate = () => {
      setProgress(getLabProgress())
    }

    window.addEventListener('lab-progress-updated', handleProgressUpdate)
    return () => window.removeEventListener('lab-progress-updated', handleProgressUpdate)
  }, [])

  React.useEffect(() => {
    // Measure footer height
    const updateFooterHeight = () => {
      const footer = document.querySelector('footer')
      if (footer) {
        setFooterHeight(footer.offsetHeight)
      }
    }

    updateFooterHeight()
    window.addEventListener('resize', updateFooterHeight)

    return () => window.removeEventListener('resize', updateFooterHeight)
  }, [])

  return (
    <div
      className="fixed left-0 top-16 w-64 bg-white border-r border-innoq-gray-25 overflow-y-auto z-40"
      style={{ bottom: `${footerHeight}px` }}
    >
      {/* Sidebar Header */}
      <div className="p-4 border-b border-innoq-gray-25">
        <div className="flex items-center gap-2 text-innoq-petrol font-mono text-sm mb-2">
          <div className="w-2 h-2 rounded-full bg-innoq-petrol animate-pulse"></div>
          <span>OWASP TOP 10</span>
        </div>
        <p className="text-xs text-innoq-gray-75 font-mono">LLM Vulnerabilities</p>
      </div>

      {/* Labs List */}
      <nav className="p-2">
        {ALL_LABS.map((lab) => {
          const completed = isLabCompleted(lab.id)
          const isActive = pathname.includes(lab.slug)
          const color = LAB_COLORS[lab.id as keyof typeof LAB_COLORS] || '#004153'

          return (
            <Link
              key={lab.id}
              href={`/labs/${lab.slug}`}
              className={`
                group relative block p-3 mb-1 rounded transition-all duration-200
                ${isActive
                  ? 'bg-innoq-petrol/5 border-l-2'
                  : 'hover:bg-[#f7f7f7] border-l-2 border-transparent hover:border-l-2'
                }
              `}
              style={{
                borderLeftColor: isActive ? color : undefined,
              }}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className="font-mono text-xs font-bold"
                      style={{ color }}
                    >
                      {lab.id}
                    </span>
                    {completed && (
                      <Check className="w-3 h-3 text-innoq-green" />
                    )}
                  </div>
                  <p className="text-sm text-innoq-gray leading-tight line-clamp-2 group-hover:text-innoq-petrol transition-colors">
                    {lab.title}
                  </p>
                </div>

                {/* Completion indicator */}
                {completed && (
                  <div
                    className="w-2 h-2 rounded-full ml-2 flex-shrink-0"
                    style={{ backgroundColor: color }}
                  ></div>
                )}
              </div>

              {/* Hover effect */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity rounded pointer-events-none"
                style={{ backgroundColor: color }}
              ></div>
            </Link>
          )
        })}
      </nav>

      {/* Footer Stats */}
      <div className="sticky bottom-0 p-4 bg-white border-t border-innoq-gray-25">
        <div className="text-xs font-mono text-innoq-gray-75">
          <div className="flex justify-between mb-1">
            <span>Completed:</span>
            <span className="text-innoq-petrol">
              {Object.values(progress).filter(p => p.completed).length}/{ALL_LABS.length}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
