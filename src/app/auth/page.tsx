"use client"

import { useState } from 'react'
import { LoginForm } from '@/components/Auth/LoginForm'
import { SignUpForm } from '@/components/Auth/SignUpForm'
import { TrendingUp } from 'lucide-react'

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
            <TrendingUp className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Foresight</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Smart stock monitoring and alerts
          </p>
        </div>

        {/* Auth Form */}
        {isLogin ? (
          <LoginForm onSwitchToSignUp={() => setIsLogin(false)} />
        ) : (
          <SignUpForm onSwitchToLogin={() => setIsLogin(true)} />
        )}
      </div>
    </div>
  )
} 