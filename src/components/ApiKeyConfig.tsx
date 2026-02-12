'use client'

import React from 'react'
import { Key, Check, AlertCircle, Cpu, Zap, Download, Info, Server } from 'lucide-react'
import { getLLMService } from '@/lib/llm-service'
import { getWebLLMEngine, AVAILABLE_MODELS } from '@/lib/web-llm-engine'
import type { LLMProvider, ModelLoadProgress, OllamaModelInfo } from '@/types/llm'

export function ApiKeyConfig() {
  const [mode, setMode] = React.useState<LLMProvider>('api')
  const [apiKey, setApiKey] = React.useState('')
  const [isApiConfigured, setIsApiConfigured] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  // Local mode state
  const [selectedModel, setSelectedModel] = React.useState('phi-3-mini')
  const [isModelLoaded, setIsModelLoaded] = React.useState(false)
  const [isLoadingModel, setIsLoadingModel] = React.useState(false)
  const [isAutoLoading, setIsAutoLoading] = React.useState(false) // Track auto-loading state
  const [loadProgress, setLoadProgress] = React.useState<ModelLoadProgress | null>(null)
  const [webGPUSupported, setWebGPUSupported] = React.useState<boolean | null>(null)
  const [webGPUError, setWebGPUError] = React.useState<string | null>(null)

  // Ollama mode state
  const [ollamaModels, setOllamaModels] = React.useState<OllamaModelInfo[]>([])
  const [selectedOllamaModel, setSelectedOllamaModel] = React.useState('')
  const [ollamaConnected, setOllamaConnected] = React.useState<boolean | null>(null)
  const [isLoadingOllama, setIsLoadingOllama] = React.useState(false)

  React.useEffect(() => {
    // Check stored mode
    const storedMode = localStorage.getItem('llm_mode') as LLMProvider | null
    if (storedMode && (storedMode === 'api' || storedMode === 'local' || storedMode === 'ollama')) {
      setMode(storedMode)
    }

    // Check API key
    const storedKey = localStorage.getItem('openai_api_key')
    if (storedKey) {
      setApiKey(storedKey)
      setIsApiConfigured(true)
    }

    // Check local model
    const storedModel = localStorage.getItem('local_model')
    if (storedModel) {
      setSelectedModel(storedModel)
    }

    // Check Ollama model
    const storedOllamaModel = localStorage.getItem('ollama_model')
    if (storedOllamaModel) {
      setSelectedOllamaModel(storedOllamaModel)
    }

    // Auto-reload model if it was previously loaded
    const autoReloadModel = async () => {
      const storedMode = localStorage.getItem('llm_mode') as LLMProvider | null
      const storedModel = localStorage.getItem('local_model')

      if (storedMode === 'local' && storedModel) {
        const engine = getWebLLMEngine()

        // Check if model is already loaded in memory
        if (!engine.isModelLoaded()) {
          // Check WebGPU support first
          const support = await checkWebGPU()
          if (support && support.supported) {
            // Check if model was previously cached
            const wasCached = localStorage.getItem(`model_${storedModel}_cached`) === 'true'

            try {
              if (wasCached) {
                // For cached models: don't show loading UI, but wait for load to complete
                setIsAutoLoading(true)
                setIsLoadingModel(false)

                // Load silently in background from cache
                await engine.loadModel(storedModel, () => {
                  // Ignore progress updates for cached models
                })

                // Only set as loaded after engine finishes
                setIsModelLoaded(true)
              } else {
                // First time download - show full progress
                setIsLoadingModel(true)
                await engine.loadModel(storedModel, (progress) => {
                  setLoadProgress(progress)
                })
                setIsModelLoaded(true)

                // Mark as cached for next time
                localStorage.setItem(`model_${storedModel}_cached`, 'true')
              }

              // Update LLM service
              const service = getLLMService()
              service.setProvider('local')
            } catch (err) {
              // If auto-load fails, user can manually reload
              console.warn('Failed to auto-reload model:', err)
              setIsModelLoaded(false)
            } finally {
              setIsAutoLoading(false)
              if (!wasCached) {
                setIsLoadingModel(false)
              }
            }
          }
        } else {
          // Model is already loaded
          setIsModelLoaded(true)
          const currentModel = engine.getCurrentModel()
          if (currentModel) {
            setSelectedModel(currentModel)
          }
        }
      } else if (storedMode === 'ollama') {
        // Auto-check Ollama connection
        fetchOllamaModels()
      } else {
        // Check if model is already loaded (for when mode is not stored but model is)
        const engine = getWebLLMEngine()
        if (engine.isModelLoaded()) {
          setIsModelLoaded(true)
          const currentModel = engine.getCurrentModel()
          if (currentModel) {
            setSelectedModel(currentModel)
          }
        }
      }
    }

    // Run auto-reload after WebGPU check
    if (typeof window !== 'undefined') {
      checkWebGPU().then(() => {
        autoReloadModel()
      })
    }
  }, [])

  const checkWebGPU = async () => {
    try {
      const engine = getWebLLMEngine()
      const support = await engine.checkWebGPUSupport()
      setWebGPUSupported(support.supported)
      if (!support.supported) {
        setWebGPUError(support.error || 'WebGPU not supported')
      }
      return support
    } catch (err) {
      setWebGPUSupported(false)
      const errorMsg = err instanceof Error ? err.message : 'Unknown error'
      setWebGPUError(errorMsg)
      return { supported: false, error: errorMsg }
    }
  }

  const fetchOllamaModels = async () => {
    setIsLoadingOllama(true)
    setError(null)
    try {
      const healthRes = await fetch('/api/ollama/health')
      if (!healthRes.ok) {
        setOllamaConnected(false)
        return
      }
      setOllamaConnected(true)

      const modelsRes = await fetch('/api/ollama/models')
      if (modelsRes.ok) {
        const data = await modelsRes.json()
        setOllamaModels(data.models || [])
        // Auto-select first model if none selected
        if (!selectedOllamaModel && data.models?.length > 0) {
          const firstModel = data.models[0].name
          setSelectedOllamaModel(firstModel)
          localStorage.setItem('ollama_model', firstModel)
          const service = getLLMService()
          service.setOllamaModel(firstModel)
        }
      }
    } catch {
      setOllamaConnected(false)
    } finally {
      setIsLoadingOllama(false)
    }
  }

  const handleModeChange = (newMode: LLMProvider) => {
    setMode(newMode)
    localStorage.setItem('llm_mode', newMode)
    const service = getLLMService()
    service.setProvider(newMode)
    setError(null)

    if (newMode === 'ollama') {
      fetchOllamaModels()
    }
  }

  const handleApiSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      if (!apiKey.startsWith('sk-') || apiKey.length < 40) {
        throw new Error('Invalid API key format')
      }

      localStorage.setItem('openai_api_key', apiKey)
      const service = getLLMService()
      service.setApiKey(apiKey)
      setIsApiConfigured(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save API key')
      setIsApiConfigured(false)
    } finally {
      setIsLoading(false)
    }
  }

  const handleApiReset = () => {
    localStorage.removeItem('openai_api_key')
    setApiKey('')
    setIsApiConfigured(false)
    setError(null)
  }

  const handleLoadModel = async () => {
    if (!webGPUSupported) {
      setError('WebGPU is not supported in your browser')
      return
    }

    setIsLoadingModel(true)
    setError(null)
    setLoadProgress(null)

    try {
      const engine = getWebLLMEngine()

      // Automatically unload current model if switching to a different one
      if (isModelLoaded && engine.getCurrentModel() !== selectedModel) {
        setLoadProgress({
          progress: 0,
          text: 'Unloading current model...',
          timeElapsed: 0
        })
        await engine.unloadModel()
      }

      await engine.loadModel(selectedModel, (progress) => {
        setLoadProgress(progress)
      })

      setIsModelLoaded(true)
      localStorage.setItem('local_model', selectedModel)

      // Mark as cached for next time
      localStorage.setItem(`model_${selectedModel}_cached`, 'true')

      // Update LLM service
      const service = getLLMService()
      service.setProvider('local')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load model')
      setIsModelLoaded(false)
    } finally {
      setIsLoadingModel(false)
    }
  }

  const handleUnloadModel = async () => {
    try {
      const engine = getWebLLMEngine()
      await engine.unloadModel()
      setIsModelLoaded(false)
      setLoadProgress(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to unload model')
    }
  }

  const handleModelChange = (modelId: string) => {
    setSelectedModel(modelId)
    localStorage.setItem('local_model', modelId)

    // If a model is already loaded and it's different, show a message
    if (isModelLoaded) {
      const engine = getWebLLMEngine()
      const currentModel = engine.getCurrentModel()
      if (currentModel && currentModel !== modelId) {
        setError(null) // Clear any previous errors when user wants to switch
      }
    }
  }

  const handleOllamaModelChange = (modelName: string) => {
    setSelectedOllamaModel(modelName)
    localStorage.setItem('ollama_model', modelName)
    const service = getLLMService()
    service.setOllamaModel(modelName)
  }

  const formatSize = (bytes: number): string => {
    if (bytes < 1024 * 1024 * 1024) {
      return `${(bytes / (1024 * 1024)).toFixed(0)}MB`
    }
    return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)}GB`
  }

  const formatTime = (ms: number): string => {
    if (ms < 1000) return `${ms}ms`
    return `${(ms / 1000).toFixed(1)}s`
  }

  return (
    <div className="bg-[#f7f7f7] border border-innoq-gray-25 rounded-lg p-6 mb-6">
      <div className="flex items-center gap-2 mb-4">
        <Key className="w-5 h-5 text-innoq-petrol" />
        <h2 className="text-lg font-semibold text-innoq-gray">LLM Configuration</h2>
      </div>

      {/* Mode Selector Tabs */}
      <div className="flex gap-2 mb-6 bg-innoq-gray-25/50 p-1 rounded-lg">
        <button
          onClick={() => handleModeChange('api')}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded transition-all ${
            mode === 'api'
              ? 'bg-innoq-petrol text-white shadow-sm'
              : 'text-innoq-gray-75 hover:text-innoq-gray hover:bg-white'
          }`}
        >
          <Zap className="w-4 h-4" />
          API Mode
        </button>
        <button
          onClick={() => handleModeChange('local')}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded transition-all ${
            mode === 'local'
              ? 'bg-innoq-petrol text-white shadow-sm'
              : 'text-innoq-gray-75 hover:text-innoq-gray hover:bg-white'
          }`}
        >
          <Cpu className="w-4 h-4" />
          Local Mode
        </button>
        <button
          onClick={() => handleModeChange('ollama')}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded transition-all ${
            mode === 'ollama'
              ? 'bg-innoq-green text-white shadow-sm'
              : 'text-innoq-gray-75 hover:text-innoq-gray hover:bg-white'
          }`}
        >
          <Server className="w-4 h-4" />
          Ollama
        </button>
      </div>

      {/* API Mode Configuration */}
      {mode === 'api' && (
        <div className="space-y-4">
          {isApiConfigured ? (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-innoq-green">
                <Check className="w-5 h-5" />
                <p>API key configured</p>
              </div>
              <button
                onClick={handleApiReset}
                className="text-sm text-innoq-gray-75 hover:text-innoq-gray transition-colors"
              >
                Reset API key
              </button>
            </div>
          ) : (
            <form onSubmit={handleApiSubmit} className="space-y-4">
              <div>
                <label htmlFor="apiKey" className="block text-sm font-medium text-innoq-gray-75 mb-2">
                  OpenAI API Key
                </label>
                <input
                  type="password"
                  id="apiKey"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="sk-..."
                  className="w-full px-4 py-2 bg-white border border-innoq-gray-25 rounded-lg text-innoq-gray placeholder:text-innoq-gray-50 focus:outline-none focus:ring-2 focus:ring-innoq-petrol"
                />
                <p className="mt-2 text-sm text-innoq-gray-75">
                  Your API key will be stored locally and only used for lab exercises.
                </p>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="px-4 py-2 bg-innoq-petrol hover:bg-innoq-petrol-75 rounded-lg font-medium transition-colors disabled:opacity-50 text-white"
              >
                {isLoading ? 'Saving...' : 'Save API Key'}
              </button>
            </form>
          )}
        </div>
      )}

      {/* Local Mode Configuration */}
      {mode === 'local' && (
        <div className="space-y-4">
          {/* WebGPU Status */}
          {webGPUSupported === false && (
            <div className="flex items-start gap-2 text-innoq-apricot bg-innoq-apricot-25 p-4 rounded-lg">
              <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-innoq-gray">WebGPU Not Supported</p>
                <p className="text-sm mt-1">{webGPUError}</p>
                <button
                  onClick={() => handleModeChange('api')}
                  className="mt-2 text-sm underline hover:no-underline text-innoq-petrol"
                >
                  Switch to API Mode
                </button>
              </div>
            </div>
          )}

          {/* Info Box */}
          <div className="flex items-start gap-2 text-innoq-petrol bg-innoq-petrol-25/30 p-4 rounded-lg">
            <Info className="w-5 h-5 mt-0.5 flex-shrink-0" />
            <div className="text-sm">
              <p className="font-medium mb-1">How Local Mode Works:</p>
              <ul className="space-y-1 text-innoq-gray-75">
                <li>• Models run entirely in your browser using WebGPU</li>
                <li>• One-time download, then cached for future use</li>
                <li>• No API key needed, data never leaves your device</li>
                <li>• Requires modern browser (Chrome/Edge 113+, Firefox 115+)</li>
                <li>• Performance depends on your GPU</li>
              </ul>
            </div>
          </div>

          {/* Model Selection */}
          <div>
            <label className="block text-sm font-medium text-innoq-gray-75 mb-2">
              Select Model
            </label>
            <select
              value={selectedModel}
              onChange={(e) => handleModelChange(e.target.value)}
              disabled={isLoadingModel}
              className="w-full px-4 py-2 bg-white border border-innoq-gray-25 rounded-lg text-innoq-gray disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-innoq-petrol"
            >
              {AVAILABLE_MODELS.map((model) => (
                <option key={model.id} value={model.id}>
                  {model.name} - {model.size} - {model.description}
                </option>
              ))}
            </select>
            {isModelLoaded && !isAutoLoading && (() => {
              const engine = getWebLLMEngine()
              const currentModel = engine.getCurrentModel()
              return currentModel !== selectedModel ? (
                <p className="mt-2 text-xs text-innoq-apricot">
                  Different model selected. Click &quot;Switch Model&quot; to switch.
                </p>
              ) : null
            })()}
          </div>

          {/* Model Info */}
          {selectedModel && (
            <div className="bg-white/50 border border-innoq-gray-25 p-4 rounded-lg">
              {(() => {
                const modelInfo = AVAILABLE_MODELS.find((m) => m.id === selectedModel)
                if (!modelInfo) return null
                return (
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-innoq-gray-75">Size:</span>
                      <span className="text-innoq-gray font-medium">{modelInfo.size}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-innoq-gray-75">VRAM Required:</span>
                      <span className="text-innoq-gray font-medium">{modelInfo.vramRequired}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-innoq-gray-75">Category:</span>
                      <span className="text-innoq-gray font-medium capitalize">
                        {modelInfo.category}
                      </span>
                    </div>
                  </div>
                )
              })()}
            </div>
          )}

          {/* Load/Switch Model Button */}
          {(!isModelLoaded || (() => {
            const engine = getWebLLMEngine()
            return engine.getCurrentModel() !== selectedModel
          })()) && !isLoadingModel && !isAutoLoading && (
            <button
              onClick={handleLoadModel}
              disabled={!webGPUSupported}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-innoq-petrol hover:bg-innoq-petrol-75 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-white"
            >
              <Download className="w-4 h-4" />
              {isModelLoaded ? 'Switch Model' : 'Download & Load Model'}
            </button>
          )}

          {/* Loading Progress */}
          {isLoadingModel && loadProgress && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-innoq-gray-75">{loadProgress.text}</span>
                <span className="text-innoq-petrol">
                  {(loadProgress.progress * 100).toFixed(0)}%
                </span>
              </div>
              <div className="w-full bg-innoq-gray-25 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-innoq-petrol h-full transition-all duration-300"
                  style={{ width: `${loadProgress.progress * 100}%` }}
                />
              </div>
              <p className="text-xs text-innoq-gray-50">
                Time elapsed: {formatTime(loadProgress.timeElapsed)}
              </p>
            </div>
          )}

          {/* Model Loaded Status */}
          {isModelLoaded && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-innoq-green">
                <Check className="w-5 h-5" />
                <p>Model loaded and ready</p>
              </div>
              <button
                onClick={handleUnloadModel}
                className="text-sm text-innoq-gray-75 hover:text-innoq-gray transition-colors"
              >
                Unload model
              </button>
            </div>
          )}

          {/* Performance Note */}
          {isModelLoaded && (
            <p className="text-xs text-innoq-gray-50 italic">
              Note: If local mode is slow, you can switch to API mode anytime using the tabs above.
            </p>
          )}
        </div>
      )}

      {/* Ollama Mode Configuration */}
      {mode === 'ollama' && (
        <div className="space-y-4">
          {/* Info Box */}
          <div className="flex items-start gap-2 text-innoq-green bg-innoq-green-25/30 p-4 rounded-lg">
            <Info className="w-5 h-5 mt-0.5 flex-shrink-0" />
            <div className="text-sm">
              <p className="font-medium mb-1 text-innoq-gray">How Ollama Mode Works:</p>
              <ul className="space-y-1 text-innoq-gray-75">
                <li>• Models run on your machine via Ollama</li>
                <li>• No API key needed</li>
                <li>• Requests are proxied through the server (no CORS issues)</li>
                <li>• Install models with <code className="bg-innoq-gray-25 px-1 rounded text-innoq-gray">ollama pull &lt;model&gt;</code></li>
              </ul>
            </div>
          </div>

          {/* Connection Status */}
          {ollamaConnected === false && (
            <div className="flex items-start gap-2 text-innoq-apricot bg-innoq-apricot-25 p-4 rounded-lg">
              <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-innoq-gray">Ollama Not Running</p>
                <p className="text-sm mt-1">
                  Start Ollama with <code className="bg-innoq-gray-25 px-1 rounded text-innoq-gray">ollama serve</code> and click refresh below.
                </p>
                <button
                  onClick={fetchOllamaModels}
                  disabled={isLoadingOllama}
                  className="mt-2 text-sm underline hover:no-underline disabled:opacity-50 text-innoq-petrol"
                >
                  {isLoadingOllama ? 'Checking...' : 'Retry Connection'}
                </button>
              </div>
            </div>
          )}

          {ollamaConnected === true && (
            <>
              <div className="flex items-center gap-2 text-innoq-green">
                <Check className="w-5 h-5" />
                <p>Connected to Ollama</p>
              </div>

              {/* Model Selection */}
              {ollamaModels.length > 0 ? (
                <div>
                  <label className="block text-sm font-medium text-innoq-gray-75 mb-2">
                    Select Model
                  </label>
                  <select
                    value={selectedOllamaModel}
                    onChange={(e) => handleOllamaModelChange(e.target.value)}
                    className="w-full px-4 py-2 bg-white border border-innoq-gray-25 rounded-lg text-innoq-gray focus:outline-none focus:ring-2 focus:ring-innoq-green"
                  >
                    {ollamaModels.map((model) => (
                      <option key={model.name} value={model.name}>
                        {model.name} ({formatSize(model.size)})
                      </option>
                    ))}
                  </select>
                </div>
              ) : (
                <div className="text-sm text-innoq-gray-75">
                  No models found. Pull a model with <code className="bg-innoq-gray-25 px-1 rounded text-innoq-gray">ollama pull llama3.2</code>
                </div>
              )}

              {selectedOllamaModel && (
                <div className="flex items-center gap-2 text-innoq-green">
                  <Check className="w-5 h-5" />
                  <p>Ready: {selectedOllamaModel}</p>
                </div>
              )}

              <button
                onClick={fetchOllamaModels}
                disabled={isLoadingOllama}
                className="text-sm text-innoq-gray-75 hover:text-innoq-gray transition-colors disabled:opacity-50"
              >
                {isLoadingOllama ? 'Refreshing...' : 'Refresh Models'}
              </button>
            </>
          )}

          {ollamaConnected === null && isLoadingOllama && (
            <p className="text-sm text-innoq-gray-75">Checking Ollama connection...</p>
          )}
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="flex items-start gap-2 text-innoq-red bg-innoq-red-25 p-4 rounded-lg mt-4">
          <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-medium text-innoq-gray">Configuration Error</p>
            <p className="text-sm">{error}</p>
          </div>
        </div>
      )}
    </div>
  )
}
