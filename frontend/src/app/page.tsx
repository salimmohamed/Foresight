"use client"

import HomePage from '@/components/HomePage/HomePage'

export default function Page() {
  const handleGetStartedClick = () => {
    // Navigate to dashboard or alerts page
    window.location.href = '/dashboard'
  }

  return <HomePage onGetStartedClick={handleGetStartedClick} />
}