import { NextResponse } from 'next/server'

const OLLAMA_HOST = process.env.OLLAMA_BASE_URL
  ? process.env.OLLAMA_BASE_URL.replace(/\/v1$/, '')
  : 'http://127.0.0.1:11434'

export async function GET() {
  try {
    const res = await fetch(`${OLLAMA_HOST}/api/tags`, { signal: AbortSignal.timeout(5000) })
    if (!res.ok) {
      return NextResponse.json({ error: 'Failed to fetch models from Ollama' }, { status: 502 })
    }
    const data = await res.json()
    const models = (data.models || []).map((m: { name: string; size: number; modified_at: string }) => ({
      name: m.name,
      size: m.size,
      modified_at: m.modified_at,
    }))
    return NextResponse.json({ models })
  } catch {
    return NextResponse.json(
      { error: 'Cannot connect to Ollama. Make sure it is running with `ollama serve`.' },
      { status: 502 }
    )
  }
}
