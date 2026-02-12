'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Shield, User, Loader2, LogIn } from 'lucide-react'
import { createBrowserClient } from '@/lib/supabase'
import { useOctober } from '@/contexts/OctoberContext'

export default function OctoberLoginPage() {
  const router = useRouter()
  const { refreshUser } = useOctober()
  const [username, setUsername] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      if (username.length < 3) {
        throw new Error('Username must be at least 3 characters')
      }

      const supabase = createBrowserClient()

      // Check if user exists
      const { data: user, error: fetchError } = await supabase
        .from('ctf_users')
        .select('*')
        .eq('username', username)
        .single()

      if (fetchError || !user) {
        throw new Error('Username not found. Please register first.')
      }

      // Store user ID in localStorage
      localStorage.setItem('october_ctf_user_id', user.id)
      localStorage.setItem('october_ctf_username', user.username)

      // Update context so the /october page sees the authenticated user
      await refreshUser()

      // Redirect to October challenge page
      router.push('/october')
    } catch (err: any) {
      console.error('Login error:', err)
      setError(err.message || 'Failed to login. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-white text-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="text-4xl">🎃</span>
            <Shield className="w-12 h-12 text-orange-400" />
          </div>
          <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-orange-400 to-cyan-400 bg-clip-text text-transparent">
            Welcome Back!
          </h1>
          <p className="text-innoq-gray-75">
            Login to continue your October CTF challenge
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-[#f7f7f7] border border-innoq-gray-25 rounded-lg p-8 shadow-lg">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Username Field */}
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-innoq-gray-75 mb-2">
                Username
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-innoq-gray-75" />
                <input
                  type="text"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white border border-innoq-gray-25 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="Enter your username"
                  required
                  autoComplete="username"
                />
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-innoq-red/10 border border-red-500/50 text-innoq-red px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* Login Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-600 disabled:from-gray-600 disabled:to-gray-600 text-white font-semibold rounded-lg transition-all shadow-lg disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Logging in...</span>
                </>
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  <span>Login</span>
                </>
              )}
            </button>
          </form>

          {/* Register Link */}
          <div className="mt-6 text-center">
            <p className="text-innoq-gray-75 text-sm">
              Don't have an account?{' '}
              <Link
                href="/october/register"
                className="text-cyan-400 hover:text-cyan-300 font-medium transition-colors"
              >
                Register here
              </Link>
            </p>
          </div>

          {/* Back Link */}
          <div className="mt-4 text-center">
            <Link
              href="/october"
              className="text-innoq-gray-75 hover:text-innoq-gray-75 text-sm transition-colors"
            >
              ← Back to Challenge
            </Link>
          </div>
        </div>

        {/* Info Box */}
        <div className="mt-6 bg-orange-900/20 border border-orange-500/30 rounded-lg p-4 text-center">
          <p className="text-sm text-innoq-gray-75">
            <span className="text-orange-400 font-medium">New to October CTF?</span>
            <br />
            You can try Level 1 without registering, or register to track your progress!
          </p>
        </div>
      </div>
    </main>
  )
}
