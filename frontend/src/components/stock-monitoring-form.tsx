"use client"

import React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, AlertCircle } from "lucide-react"

interface FormData {
  stockSymbol: string
  companyName: string
  priceThreshold: string
  articleCount: string
}

interface FormErrors {
  stockSymbol?: string
  companyName?: string
  priceThreshold?: string
  articleCount?: string
}

export default function Component() {
  const [formData, setFormData] = useState<FormData>({
    stockSymbol: "",
    companyName: "",
    priceThreshold: "",
    articleCount: "",
  })

  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    // Stock symbol validation
    if (!formData.stockSymbol.trim()) {
      newErrors.stockSymbol = "Stock symbol is required"
    } else if (!/^[A-Z]{1,5}$/.test(formData.stockSymbol.toUpperCase())) {
      newErrors.stockSymbol = "Stock symbol must be 1-5 uppercase letters"
    }

    // Company name validation
    if (!formData.companyName.trim()) {
      newErrors.companyName = "Company name is required"
    } else if (formData.companyName.trim().length < 2) {
      newErrors.companyName = "Company name must be at least 2 characters"
    }

    // Price threshold validation
    if (!formData.priceThreshold) {
      newErrors.priceThreshold = "Price change threshold is required"
    } else {
      const threshold = Number.parseFloat(formData.priceThreshold)
      if (isNaN(threshold) || threshold <= 0 || threshold > 100) {
        newErrors.priceThreshold = "Threshold must be between 0.1% and 100%"
      }
    }

    // Article count validation
    if (!formData.articleCount) {
      newErrors.articleCount = "Number of articles is required"
    } else {
      const count = Number.parseInt(formData.articleCount)
      if (isNaN(count) || count < 1 || count > 100) {
        newErrors.articleCount = "Article count must be between 1 and 100"
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
    setSubmitSuccess(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      console.log("Stock monitoring setup:", {
        stockSymbol: formData.stockSymbol.toUpperCase(),
        companyName: formData.companyName.trim(),
        priceThreshold: Number.parseFloat(formData.priceThreshold),
        articleCount: Number.parseInt(formData.articleCount),
      })

      setSubmitSuccess(true)
      // Reset form after successful submission
      setFormData({
        stockSymbol: "",
        companyName: "",
        priceThreshold: "",
        articleCount: "",
      })
    } catch (error) {
      console.error("Submission error:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="w-full max-w-2xl mx-auto p-6">
      <Card>
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
            <TrendingUp className="h-6 w-6 text-blue-600" />
          </div>
          <CardTitle className="text-2xl font-bold">Stock Monitoring Setup</CardTitle>
          <CardDescription>Configure alerts for stock price changes and news articles</CardDescription>
        </CardHeader>

        <CardContent>
          {submitSuccess && (
            <div className="mb-6 rounded-lg border border-green-200 bg-green-50 p-4">
              <div className="flex items-center">
                <AlertCircle className="h-4 w-4 text-green-600 mr-2" />
                <span className="text-green-800">
                  Stock monitoring has been successfully configured!
                </span>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <label htmlFor="stockSymbol" className="text-sm font-medium">
                  Stock Symbol *
                </label>
                <input
                  id="stockSymbol"
                  type="text"
                  placeholder="e.g., AAPL"
                  value={formData.stockSymbol}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange("stockSymbol", e.target.value.toUpperCase())}
                  className={`w-full rounded-md border px-3 py-2 text-sm ${errors.stockSymbol ? "border-red-500 focus-visible:ring-red-500" : "border-gray-300 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"}`}
                  maxLength={5}
                />
                {errors.stockSymbol && <p className="text-sm text-red-600">{errors.stockSymbol}</p>}
              </div>

              <div className="space-y-2">
                <label htmlFor="companyName" className="text-sm font-medium">
                  Company Name *
                </label>
                <input
                  id="companyName"
                  type="text"
                  placeholder="e.g., Apple Inc."
                  value={formData.companyName}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange("companyName", e.target.value)}
                  className={`w-full rounded-md border px-3 py-2 text-sm ${errors.companyName ? "border-red-500 focus-visible:ring-red-500" : "border-gray-300 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"}`}
                />
                {errors.companyName && <p className="text-sm text-red-600">{errors.companyName}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <label htmlFor="priceThreshold" className="text-sm font-medium">
                  Price Change Threshold (%) *
                </label>
                <div className="relative">
                  <input
                    id="priceThreshold"
                    type="number"
                    placeholder="5.0"
                    step="0.1"
                    min="0.1"
                    max="100"
                    value={formData.priceThreshold}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange("priceThreshold", e.target.value)}
                    className={`w-full rounded-md border px-3 py-2 text-sm pr-8 ${errors.priceThreshold ? "border-red-500 focus-visible:ring-red-500" : "border-gray-300 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"}`}
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">%</span>
                </div>
                {errors.priceThreshold && <p className="text-sm text-red-600">{errors.priceThreshold}</p>}
                <p className="text-xs text-gray-500">Alert when price changes by this percentage</p>
              </div>

              <div className="space-y-2">
                <label htmlFor="articleCount" className="text-sm font-medium">
                  Number of Articles *
                </label>
                <input
                  id="articleCount"
                  type="number"
                  placeholder="10"
                  min="1"
                  max="100"
                  value={formData.articleCount}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange("articleCount", e.target.value)}
                  className={`w-full rounded-md border px-3 py-2 text-sm ${errors.articleCount ? "border-red-500 focus-visible:ring-red-500" : "border-gray-300 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"}`}
                />
                {errors.articleCount && <p className="text-sm text-red-600">{errors.articleCount}</p>}
                <p className="text-xs text-gray-500">Maximum articles to monitor daily</p>
              </div>
            </div>

            <div className="pt-4">
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Setting up monitoring...
                  </>
                ) : (
                  "Start Monitoring"
                )}
              </Button>
            </div>
          </form>

          <div className="mt-6 rounded-lg bg-gray-50 p-4">
            <h4 className="text-sm font-medium text-gray-900 mb-2">What happens next?</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Real-time price monitoring will begin immediately</li>
              <li>• You&apos;ll receive alerts when thresholds are met</li>
              <li>• Daily article summaries will be delivered</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}