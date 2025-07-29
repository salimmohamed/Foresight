"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { TrendingUp, Newspaper, Mail, Github } from "lucide-react"

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col">
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center text-center py-20 px-4 bg-gradient-to-b from-white/80 to-blue-50">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 drop-shadow-sm">
          Foresight: From Code Challenge to AI-Powered Trading Insights
        </h1>
        <p className="text-lg md:text-xl text-gray-700 mb-8 max-w-2xl mx-auto">
          Leverage the power of AI to monitor stocks, analyze news, and receive actionable trading insights. Built for the future of intelligent investing.
        </p>
        <Link href="/dashboard">
          <Button size="lg" className="text-lg px-8 py-4 shadow-md">
            Get Started
          </Button>
        </Link>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-10">Core Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white rounded-xl shadow-md p-8 flex flex-col items-center text-center transition-transform hover:-translate-y-1 hover:shadow-lg">
            <TrendingUp className="h-10 w-10 text-blue-600 mb-4" />
            <h3 className="font-semibold text-xl mb-2">Real-Time Stock Monitoring</h3>
            <p className="text-gray-600">Track your favorite stocks with up-to-the-minute price updates and performance metrics.</p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-8 flex flex-col items-center text-center transition-transform hover:-translate-y-1 hover:shadow-lg">
            <Newspaper className="h-10 w-10 text-indigo-600 mb-4" />
            <h3 className="font-semibold text-xl mb-2">Intelligent News Analysis</h3>
            <p className="text-gray-600">Harness AI to analyze news articles and gauge market sentiment for smarter trading decisions.</p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-8 flex flex-col items-center text-center transition-transform hover:-translate-y-1 hover:shadow-lg">
            <Mail className="h-10 w-10 text-green-600 mb-4" />
            <h3 className="font-semibold text-xl mb-2">Customizable Email Alerts</h3>
            <p className="text-gray-600">Set your own thresholds and receive instant email alerts when market conditions meet your criteria.</p>
          </div>
        </div>
      </section>

      {/* Project Vision Section */}
      <section className="bg-white/90 py-16 px-4 border-t border-b border-gray-200">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">Project Vision</h2>
          <p className="text-lg text-gray-700 mb-4">
            Foresight began as a passion project during the <span className="font-semibold text-blue-700">100 Days of Code</span> challenge. What started as a simple coding exercise has grown into an ambitious platform aiming to empower traders and investors with AI-driven insights. Our vision is to evolve Foresight into a sophisticated, all-in-one trading assistant that not only monitors the markets but also learns and adapts to your unique trading style.
          </p>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900 mb-8">How It Works</h2>
        <div className="max-w-3xl mx-auto text-center text-gray-700 text-lg">
          <p className="mb-4">
            <span className="font-semibold text-blue-700">Foresight</span> integrates with <span className="font-semibold">Finnhub</span> for real-time stock data, <span className="font-semibold">NewsAPI</span> for the latest financial news, and uses <span className="font-semibold">SMTP</span> to deliver instant email alerts. The backend processes your custom alert rules, monitors price changes, and analyzes news sentiment—all so you can stay ahead in the market.
          </p>
        </div>
      </section>

      {/* Call-to-Action Section */}
      <section className="bg-gradient-to-t from-blue-100 to-white py-16 px-4 flex flex-col items-center">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 text-center">Ready to get started?</h2>
        <p className="text-lg text-gray-700 mb-8 text-center max-w-xl">
          Clone the repository or explore the documentation to learn how Foresight can help you make smarter trading decisions.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <a
            href="https://github.com/salimmohamed/Foresight"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button size="lg" variant="outline" className="flex items-center gap-2 px-8 py-4">
              <Github className="h-5 w-5" />
              Clone on GitHub
            </Button>
          </a>
          <Link href="/docs">
            <Button size="lg" className="px-8 py-4">
              Explore Documentation
            </Button>
          </Link>
        </div>
      </section>
    </main>
  )
}