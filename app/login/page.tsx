'use client'

export const dynamic = 'force-dynamic'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Lock, Mail, AlertTriangle } from 'lucide-react'
import { authService } from '@/services/authService'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import LoadingButton from '@/components/LoadingButton'

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

type LoginFormData = z.infer<typeof loginSchema>

export default function LoginPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [rememberMe, setRememberMe] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginFormData) => {
    setLoading(true)
    setError('')

    try {
      await authService.login(data.email, data.password)
      if (rememberMe) {
        localStorage.setItem('texvision_remember_me', data.email)
      } else {
        localStorage.removeItem('texvision_remember_me')
      }
      if (typeof window !== 'undefined') {
        window.location.href = '/dashboard'
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Invalid credentials or inactive account')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-navy-900 to-navy-950 overflow-hidden">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md p-4 md:p-8"
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-danger to-danger-dark rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-glow-red">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white">TexVision AI</h1>
          <p className="text-gray-400">AI-Based Surveillance System</p>
        </div>

        <div className="bg-surface-card backdrop-blur-xl border border-navy-700/50 rounded-2xl p-8 shadow-card">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  {...register('email')}
                  type="email"
                  className="w-full pl-10 pr-4 py-3 bg-navy-800/50 border border-navy-700/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-info/50 focus:ring-2 focus-ring-info/20"
                  placeholder="admin@texvision.ai"
                />
                {errors.email && (
                  <p className="text-xs text-danger mt-1">{errors.email.message}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <AlertTriangle className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  {...register('password')}
                  type="password"
                  className="w-full pl-10 pr-4 py-3 bg-navy-800/50 border border-navy-700/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-info/50 focus:ring-2 focus-ring-info/20"
                  placeholder="••••••••"
                />
                {errors.password && (
                  <p className="text-xs text-danger mt-1">{errors.password.message}</p>
                )}
              </div>
            </div>

            {error && (
              <div className="p-3 bg-danger/10 border border-danger/30 rounded-lg text-sm text-danger">
                {error}
              </div>
            )}

            <div className="flex items-center gap-3 mb-4">
              <input
                id="remember-me"
                type="checkbox"
                checked={rememberMe}
                onChange={() => setRememberMe(!rememberMe)}
                className="w-4 h-4 rounded border-navy-700 bg-navy-800 text-info focus:ring-info/20"
              />
              <label htmlFor="remember-me" className="text-sm text-gray-300 cursor-pointer">
                Remember me
              </label>
            </div>

            <LoadingButton
              type="submit"
              loading={loading}
              className="w-full"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </LoadingButton>
          </form>
        </div>

        <div className="mt-6 pt-6 border-t border-navy-700/50">
          <p className="text-sm text-gray-400 text-center mb-4">Demo Credentials:</p>
          <div className="space-y-2 text-xs">
            <div className="flex items-center gap-2 p-2 bg-navy-800/30 rounded">
              <span className="font-bold text-info">Admin:</span>
              <span>admin@texvision.ai / admin123</span>
            </div>
            <div className="flex items-center gap-2 p-2 bg-navy-800/30 rounded">
              <span className="font-bold text-warning">Supervisor:</span>
              <span>supervisor@texvision.ai / super123</span>
            </div>
            <div className="flex items-center gap-2 p-2 bg-navy-800/30 rounded">
              <span className="font-bold text-gray-400">Viewer:</span>
              <span>viewer@texvision.ai / view123</span>
            </div>
          </div>
        </div>

        <div className="mt-6 text-center">
          <Link href="/auth/forgot-password" className="text-sm text-info hover:text-info/80">
            Forgot Password?
          </Link>
        </div>
      </motion.div>
    </div>
  )
}