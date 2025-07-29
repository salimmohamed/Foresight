import { ArrowRight, BarChart3, Bell, Brain, Code, Database, Mail, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import styles from './HomePage.module.css'

interface HomePageProps {
  onGetStartedClick?: () => void
}

export default function HomePage({ onGetStartedClick }: HomePageProps) {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="border-b border-gray-200 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-8 w-8 text-blue-600" />
              <span className="text-2xl font-bold text-gray-900">Foresight</span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-600 hover:text-gray-900 transition-colors">
                Features
              </a>
              <a href="#vision" className="text-gray-600 hover:text-gray-900 transition-colors">
                Vision
              </a>
              <a href="#how-it-works" className="text-gray-600 hover:text-gray-900 transition-colors">
                How It Works
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <div className={`absolute inset-0 ${styles['bg-grid-pattern']} opacity-5`}></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              Foresight: From Code Challenge to{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                AI-Powered Trading Insights
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              Leverage the power of artificial intelligence to monitor stock markets, analyze news sentiment, and
              receive intelligent trading insights. Transform your investment strategy with real-time data and AI-driven
              analysis.
            </p>
            <div className="flex justify-center">
              <Button 
                size="lg" 
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg"
                onClick={onGetStartedClick}
              >
                Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Powerful Features for Smart Trading</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Everything you need to stay ahead in the financial markets with AI-powered insights
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BarChart3 className="h-8 w-8 text-blue-600" />
                </div>
                <CardTitle className="text-xl font-semibold">Real-Time Stock Monitoring</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center text-gray-600 leading-relaxed">
                  Track your favorite stocks with live price updates, volume analysis, and market trends. Get instant
                  notifications when significant price movements occur.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Brain className="h-8 w-8 text-indigo-600" />
                </div>
                <CardTitle className="text-xl font-semibold">Intelligent News Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center text-gray-600 leading-relaxed">
                  AI-powered sentiment analysis of financial news and market reports. Understand how news impacts stock
                  prices and make informed decisions based on market sentiment.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Bell className="h-8 w-8 text-green-600" />
                </div>
                <CardTitle className="text-xl font-semibold">Customizable Email Alerts</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center text-gray-600 leading-relaxed">
                  Set personalized alerts for price thresholds, volume spikes, and news events. Receive timely
                  notifications via email to never miss important market opportunities.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Project Vision Section */}
      <section id="vision" className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">From Challenge to Innovation</h2>
              <div className="space-y-6 text-gray-600 leading-relaxed">
                <p>
                  Foresight began as part of the <strong className="text-gray-900">"100 Days of Code"</strong>{" "}
                  challenge, where the goal was to build something meaningful while learning new technologies. What
                  started as a simple stock monitoring tool has evolved into an ambitious AI-driven trading assistant.
                </p>
                <p>
                  The project represents the intersection of financial markets and artificial intelligence,
                  demonstrating how modern technology can democratize access to sophisticated trading insights that were
                  once available only to institutional investors.
                </p>
                <p>
                  Our vision is to create a comprehensive platform that not only monitors markets but also learns from
                  patterns, predicts trends, and provides actionable insights to help both novice and experienced
                  traders make better investment decisions.
                </p>
              </div>
              <div className="mt-8 flex items-center space-x-4">
                <Code className="h-6 w-6 text-blue-600" />
                <span className="text-sm font-medium text-gray-900">Built with passion during #100DaysOfCode</span>
              </div>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl p-8 text-white">
                <h3 className="text-2xl font-bold mb-4">Future Roadmap</h3>
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-white rounded-full mr-3"></div>
                    Machine Learning Price Predictions
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-white rounded-full mr-3"></div>
                    Portfolio Optimization Algorithms
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-white rounded-full mr-3"></div>
                    Social Media Sentiment Integration
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-white rounded-full mr-3"></div>
                    Advanced Risk Assessment Tools
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Powered by Modern Technology</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Built with industry-leading APIs and services to deliver reliable, real-time insights
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Database className="h-10 w-10 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Finnhub Integration</h3>
              <p className="text-gray-600 leading-relaxed">
                Real-time stock data, company fundamentals, and market statistics powered by Finnhub's comprehensive
                financial API for accurate and up-to-date information.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Brain className="h-10 w-10 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">NewsAPI Analysis</h3>
              <p className="text-gray-600 leading-relaxed">
                Intelligent news aggregation and sentiment analysis using NewsAPI to understand market-moving events and
                their potential impact on stock prices.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Mail className="h-10 w-10 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">SMTP Notifications</h3>
              <p className="text-gray-600 leading-relaxed">
                Reliable email delivery system using SMTP protocols to ensure you receive timely alerts and insights
                directly in your inbox when market conditions change.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call-to-Action Section */}
      <section className="py-24 bg-gradient-to-r from-blue-600 to-indigo-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">Ready to Transform Your Trading Strategy?</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join the future of AI-powered financial analysis. Clone the repository and explore the code to get started
            with your own AI trading insights.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              variant="secondary"
              className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 text-lg"
            >
              Clone Repository
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-blue-600 px-8 py-3 text-lg bg-transparent"
            >
              View Source Code
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <TrendingUp className="h-8 w-8 text-blue-400" />
              <span className="text-2xl font-bold">Foresight</span>
            </div>
            <div className="text-gray-400 text-center md:text-right">
              <p>Built with ❤️ during #100DaysOfCode</p>
              <p className="text-sm mt-1">© 2024 Foresight. Open source project.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
} 