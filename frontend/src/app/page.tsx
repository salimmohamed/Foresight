"use client"

import HomePage from '@/components/HomePage/HomePage'

export default function Page() {
  const handleGetStartedClick = () => {
    // Navigate to market page
    window.location.href = '/market'
  }

  return <HomePage onGetStartedClick={handleGetStartedClick} />
}