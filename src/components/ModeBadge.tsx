'use client'

import React from 'react'
import { Cpu, Zap, Server } from 'lucide-react'
import { getLLMService } from '@/lib/llm-service'
import { getWebLLMEngine } from '@/lib/web-llm-engine'
import type { LLMProvider } from '@/types/llm'

export function ModeBadge() {
  const [mode, setMode] = React.useState<LLMProvider>('api')
  const [modelName, setModelName] = React.useState<string>('API')

  React.useEffect(() => {
    const updateMode = () => {
      const service = getLLMService()
      const currentMode = service.getCurrentProvider()
      setMode(currentMode)

      if (currentMode === 'local') {
        const engine = getWebLLMEngine()
        const currentModel = engine.getCurrentModel()
        if (currentModel) {
          const modelInfo = engine.getModelInfo(currentModel)
          setModelName(modelInfo?.name || currentModel)
        } else {
          setModelName('No Model')
        }
      } else if (currentMode === 'ollama') {
        const ollamaModel = localStorage.getItem('ollama_model')
        setModelName(ollamaModel || 'No Model')
      } else {
        setModelName('API')
      }
    }

    updateMode()

    // Listen for storage changes (mode switches)
    const handleStorageChange = () => {
      updateMode()
    }
    window.addEventListener('storage', handleStorageChange)

    // Also check periodically in case storage event doesn't fire
    const interval = setInterval(updateMode, 1000)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
      clearInterval(interval)
    }
  }, [])

  const badgeConfig = {
    api: {
      bg: 'bg-innoq-apricot/15',
      border: 'border-innoq-apricot/40',
      text: 'text-innoq-petrol',
      icon: Zap,
      label: 'API Mode',
    },
    local: {
      bg: 'bg-innoq-petrol/10',
      border: 'border-innoq-petrol/40',
      text: 'text-innoq-petrol',
      icon: Cpu,
      label: `Local: ${modelName}`,
    },
    ollama: {
      bg: 'bg-innoq-green/15',
      border: 'border-innoq-green/40',
      text: 'text-innoq-petrol',
      icon: Server,
      label: `Ollama: ${modelName}`,
    },
  }

  const config = badgeConfig[mode]
  const Icon = config.icon

  return (
    <div
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border ${config.bg} ${config.border} ${config.text}`}
    >
      <Icon className="w-3.5 h-3.5" />
      <span>{config.label}</span>
    </div>
  )
}
