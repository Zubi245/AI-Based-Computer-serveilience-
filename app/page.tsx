'use client'

export const dynamic = 'force-dynamic'

import { useEffect } from 'react'
import { authService } from '@/services/authService'

export default function Home() {
  useEffect(() => {
    if (authService.isAuthenticated()) {
      if (typeof window !== 'undefined') {
        window.location.href = '/dashboard'
      }
    } else {
      if (typeof window !== 'undefined') {
        window.location.href = '/login'
      }
    }
  }, [])

  return null
}