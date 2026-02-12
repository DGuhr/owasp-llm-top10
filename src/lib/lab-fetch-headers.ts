import type { LLMProvider } from '@/types/llm'

export function buildLabHeaders(provider: LLMProvider): Record<string, string> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  }

  if (provider === 'ollama') {
    headers['x-llm-mode'] = 'ollama'
    const model = typeof window !== 'undefined' ? localStorage.getItem('ollama_model') : null
    if (model) {
      headers['x-ollama-model'] = model
    }
  } else if (provider === 'local') {
    const apiKey = typeof window !== 'undefined' ? localStorage.getItem('openai_api_key') : null
    headers['Authorization'] = `Bearer ${apiKey || 'not-needed-for-local'}`
    headers['x-llm-mode'] = 'local'
  } else {
    // API mode
    const apiKey = typeof window !== 'undefined' ? localStorage.getItem('openai_api_key') : null
    headers['Authorization'] = `Bearer ${apiKey}`
  }

  return headers
}
