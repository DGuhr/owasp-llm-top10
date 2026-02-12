import { NextResponse } from 'next/server'

const OLLAMA_HOST = process.env.OLLAMA_BASE_URL
  ? process.env.OLLAMA_BASE_URL.replace(/\/v1$/, '')
  : 'http://127.0.0.1:11434'

export async function GET() {
  try {
    const res = await fetch(OLLAMA_HOST, { signal: AbortSignal.timeout(3000) })
    if (res.ok) {
      return NextResponse.json({ status: 'ok' })
    }
    return NextResponse.json({ status: 'error', message: 'Ollama returned non-OK status' }, { status: 502 })
  } catch {
    return NextResponse.json(
      { status: 'error', message: 'Cannot connect to Ollama. Make sure it is running with `ollama serve`.' },
      { status: 502 }
    )
  }
}
