import OpenAI from 'openai'

const OLLAMA_BASE_URL = process.env.OLLAMA_BASE_URL || 'http://127.0.0.1:11434/v1'
const OLLAMA_DEFAULT_MODEL = process.env.OLLAMA_DEFAULT_MODEL || 'llama3.2'

export function isLocalMode(req: Request): boolean {
  return req.headers.get('x-llm-mode') === 'local'
}

export function isOllamaMode(req: Request): boolean {
  return req.headers.get('x-llm-mode') === 'ollama'
}

interface LLMClient {
  client: OpenAI
  model: string
}

export function createLLMClient(
  req: Request,
  opts?: { defaultModel?: string; apiKeyOverride?: string }
): LLMClient {
  const defaultModel = opts?.defaultModel || 'gpt-4o-mini'

  if (isOllamaMode(req)) {
    const model = req.headers.get('x-ollama-model') || OLLAMA_DEFAULT_MODEL
    return {
      client: new OpenAI({ baseURL: OLLAMA_BASE_URL, apiKey: 'ollama' }),
      model,
    }
  }

  // API mode
  const apiKey =
    opts?.apiKeyOverride ||
    req.headers.get('authorization')?.split(' ')[1]

  if (!apiKey) {
    throw new Error('API key is required')
  }

  return {
    client: new OpenAI({ apiKey }),
    model: defaultModel,
  }
}

export function handleLLMError(error: unknown): { message: string; status: number } {
  if (error instanceof Error) {
    // Ollama connection refused
    if ('cause' in error && error.cause && typeof error.cause === 'object' && 'code' in error.cause) {
      const cause = error.cause as { code?: string }
      if (cause.code === 'ECONNREFUSED') {
        return {
          message: 'Cannot connect to Ollama. Make sure it is running with `ollama serve`.',
          status: 502,
        }
      }
    }

    // Ollama model not found
    if (error.message.includes('model') && error.message.includes('not found')) {
      return {
        message: `Model not available. Pull it with \`ollama pull <model>\`.`,
        status: 404,
      }
    }

    // OpenAI quota exceeded
    if (error.message.includes('insufficient_quota')) {
      return {
        message: 'OpenAI API quota exceeded. Please check your API key billing.',
        status: 402,
      }
    }

    return { message: error.message, status: 500 }
  }

  return { message: 'Failed to process request', status: 500 }
}
