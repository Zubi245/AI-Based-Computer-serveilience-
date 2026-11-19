'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, ArrowLeft, AlertCircle } from 'lucide-react'
import Link from 'next/link'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1500))
      setSent(true)
    } catch (error) {
      console.error('Forgot password error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-navy-900 to-navy-950">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md p-8"
      >
        {!sent ? (
          <>
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-warning/20 rounded-full flex items-center justify-center mx-auto mb-4 shadow-glow-red">
                <AlertCircle className="w-8 h-8 text-warning" />
              </div>
              <h1 className="text-3xl font-bold text-white mb-2">Forgot Password</h1>
              <p className="text-gray-400">Enter your email to reset your password</p>
            </div>

            <div className="bg-surface-card backdrop-blur-xl border border-navy-700/50 rounded-2xl p-8 shadow-card">
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-navy-800/50 border border-navy-700/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-info/50 focus:ring-2 focus-ring-info/20"
                      placeholder="admin@texvision.ai"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full px-4 py-3 bg-info/20 hover:bg-info/30 text-info border border-info/30 rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Sending...' : 'Send Reset Link'}
                </button>
              </form>
            </div>

            <div className="mt-6 pt-6 border-t border-navy-700/50 text-center">
              <Link href="/login" className="flex items-center gap-2 text-sm text-info hover:text-info/80">
                <ArrowLeft className="w-4 h-4" />
                Back to Login
              </Link>
            </div>
          </>
        ) : (
          <>
            <div className="text-center">
              <div className="w-16 h-16 bg-success/20 rounded-full flex items-center justify-center mx-auto mb-4 shadow-glow-red">
                <AlertCircle className="w-8 h-8 text-success" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Reset Link Sent</h2>
              <p className="text-gray-400 mb-6">
                Please check your email ({email}) to reset your password.
              </p>
              <Link
                href="/login"
                className="flex items-center gap-2 px-4 py-2 bg-info/20 hover:bg-info/30 text-info border border-info/30 rounded-lg transition-all"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Login
              </Link>
            </div>
          </>
        )}
      </motion.div>
    </div>
  )
}
