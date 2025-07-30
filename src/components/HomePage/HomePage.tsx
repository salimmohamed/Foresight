"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  TrendingUp,
  Brain,
  Bell,
  Newspaper,
  BarChart3,
  Shield,
  Zap,
  Github,
  ArrowRight,
  Target,
  Lightbulb,
} from "lucide-react"
import styles from './HomePage.module.css'

interface HomePageProps {
  onGetStartedClick?: () => void
  onExploreDashboardClick?: () => void
  onViewRepositoryClick?: () => void
  onTryDashboardClick?: () => void
}

export default function HomePage({ 
  onGetStartedClick,
  onExploreDashboardClick,
  onViewRepositoryClick,
  onTryDashboardClick
}: HomePageProps) {
  return (
    <div className={styles.container}>
      {/* Hero Section */}
      <section className={styles.heroSection}>
        <div className={styles.heroContent}>
          <div className={styles.heroText}>
            <h1 className={styles.heroTitle}>Foresight</h1>
            <p className={styles.heroSubtitle}>AI-Powered Trading Insights</p>
            <p className={styles.heroDescription}>
              Democratizing sophisticated trading insights through intelligent stock monitoring, news analysis, and
              customizable alerts. Transform your trading decisions with AI-driven intelligence.
            </p>
          </div>

          <div className={styles.heroButtons}>
            <Button size="lg" className={`${styles.primaryButton} bg-blue-600 hover:bg-blue-700`} onClick={onExploreDashboardClick}>
              <TrendingUp className={styles.buttonIcon} />
              Explore Dashboard
            </Button>
            <Button variant="outline" size="lg" className={styles.secondaryButton} onClick={onViewRepositoryClick}>
              <Github className={styles.buttonIcon} />
              View Repository
            </Button>
          </div>
        </div>
      </section>

      {/* Core Features */}
      <section className={styles.featuresSection}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Core Features</h2>
          <p className={styles.sectionDescription}>
            Powerful tools designed to enhance your trading strategy and market understanding
          </p>
        </div>

        <div className={styles.featuresGrid}>
          <Card className={styles.featureCard}>
            <CardHeader>
              <div className={styles.featureIcon}>
                <BarChart3 className={styles.icon} />
              </div>
              <CardTitle>Real-Time Stock Monitoring</CardTitle>
              <CardDescription>Track market movements with live data feeds and comprehensive analytics</CardDescription>
            </CardHeader>
          </Card>

          <Card className={styles.featureCard}>
            <CardHeader>
              <div className={styles.featureIcon}>
                <Brain className={styles.icon} />
              </div>
              <CardTitle>Intelligent News Analysis</CardTitle>
              <CardDescription>
                AI-powered sentiment analysis of market news to identify trading opportunities
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className={styles.featureCard}>
            <CardHeader>
              <div className={styles.featureIcon}>
                <Bell className={styles.icon} />
              </div>
              <CardTitle>Customizable Email Alerts</CardTitle>
              <CardDescription>
                Stay informed with personalized notifications for price movements and market events
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* Technology Stack */}
      <section className={styles.techSection}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Built with Modern Technology</h2>
          <p className={styles.sectionDescription}>
            Leveraging industry-leading APIs and services for reliable, real-time data
          </p>
        </div>

        <div className={styles.techGrid}>
          <Card className={styles.techCard}>
            <CardHeader className={styles.techCardHeader}>
              <CardTitle className={styles.techCardTitle}>Finnhub API</CardTitle>
              <CardDescription>Real-time stock market data</CardDescription>
            </CardHeader>
          </Card>

          <Card className={styles.techCard}>
            <CardHeader className={styles.techCardHeader}>
              <CardTitle className={styles.techCardTitle}>NewsAPI</CardTitle>
              <CardDescription>Comprehensive news aggregation</CardDescription>
            </CardHeader>
          </Card>

          <Card className={styles.techCard}>
            <CardHeader className={styles.techCardHeader}>
              <CardTitle className={styles.techCardTitle}>SMTP Integration</CardTitle>
              <CardDescription>Reliable email notifications</CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* Future Roadmap */}
      <section className={styles.roadmapSection}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Future Roadmap</h2>
          <p className={styles.sectionDescription}>
            Exciting features in development to further enhance your trading experience
          </p>
        </div>

        <div className={styles.roadmapGrid}>
          <Card className={styles.roadmapCard}>
            <CardHeader>
              <Target className={styles.roadmapIcon} />
              <CardTitle className={styles.roadmapCardTitle}>ML Price Predictions</CardTitle>
              <CardDescription>Advanced machine learning models for price forecasting</CardDescription>
            </CardHeader>
          </Card>

          <Card className={styles.roadmapCard}>
            <CardHeader>
              <Shield className={styles.roadmapIcon} />
              <CardTitle className={styles.roadmapCardTitle}>Portfolio Optimization</CardTitle>
              <CardDescription>AI-driven portfolio balancing and risk management</CardDescription>
            </CardHeader>
          </Card>

          <Card className={styles.roadmapCard}>
            <CardHeader>
              <Newspaper className={styles.roadmapIcon} />
              <CardTitle className={styles.roadmapCardTitle}>Social Sentiment</CardTitle>
              <CardDescription>Integration with social media sentiment analysis</CardDescription>
            </CardHeader>
          </Card>

          <Card className={styles.roadmapCard}>
            <CardHeader>
              <Zap className={styles.roadmapIcon} />
              <CardTitle className={styles.roadmapCardTitle}>Risk Assessment</CardTitle>
              <CardDescription>Advanced risk metrics and assessment tools</CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* Call to Action */}
      <section className={styles.ctaSection}>
        <Card className={styles.ctaCard}>
          <CardHeader className={styles.ctaCardHeader}>
            <div className={styles.ctaIcon}>
              <Lightbulb className={styles.ctaIconInner} />
            </div>
            <CardTitle className={styles.ctaTitle}>Ready to Get Started?</CardTitle>
            <CardDescription className={styles.ctaDescription}>
              Explore the repository, contribute to the project, or start using Foresight to enhance your trading
              strategy today.
            </CardDescription>
          </CardHeader>
          <CardContent className={styles.ctaButtons}>
            <Button size="lg" className={`${styles.ctaPrimaryButton} bg-blue-600 hover:bg-blue-700`} onClick={onViewRepositoryClick}>
              <Github className={styles.buttonIcon} />
              Explore Repository
            </Button>
            <Button variant="outline" size="lg" className={styles.ctaSecondaryButton} onClick={onTryDashboardClick}>
              <ArrowRight className={styles.buttonIcon} />
              Try Dashboard
            </Button>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <div className={styles.footerLeft}>
            <div className={styles.footerLogo}>
              <TrendingUp className={styles.footerIcon} />
              <span className={styles.footerBrand}>Foresight</span>
              <Badge variant="secondary" className={styles.footerBadge}>
                Open Source
              </Badge>
            </div>
          </div>
          <p className={styles.footerText}>Built with passion during the 100 Days of Code challenge</p>
        </div>
      </footer>
    </div>
  )
} 