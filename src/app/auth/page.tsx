"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { TrendingUp, Mail, Lock, User, Eye, EyeOff, ArrowLeft, Github } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { useAuth } from "@/contexts/AuthContext"

export default function AuthPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
    rememberMe: false,
  })
  const [signupForm, setSignupForm] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    acceptTerms: false,
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  
  const { signIn, signUp } = useAuth()
  const router = useRouter()

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const validatePassword = (password: string) => {
    return password.length >= 8
  }

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const newErrors: Record<string, string> = {}

    if (!loginForm.email) {
      newErrors.email = "Email is required"
    } else if (!validateEmail(loginForm.email)) {
      newErrors.email = "Please enter a valid email address"
    }

    if (!loginForm.password) {
      newErrors.password = "Password is required"
    }

    setErrors(newErrors)

    if (Object.keys(newErrors).length === 0) {
      setIsLoading(true)
      const { error } = await signIn(loginForm.email, loginForm.password)
      
      if (error) {
        setErrors({ general: error.message })
        setIsLoading(false)
      } else {
        router.push("/dashboard")
      }
    }
  }

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const newErrors: Record<string, string> = {}

    if (!signupForm.fullName) {
      newErrors.fullName = "Full name is required"
    }

    if (!signupForm.email) {
      newErrors.email = "Email is required"
    } else if (!validateEmail(signupForm.email)) {
      newErrors.email = "Please enter a valid email address"
    }

    if (!signupForm.password) {
      newErrors.password = "Password is required"
    } else if (!validatePassword(signupForm.password)) {
      newErrors.password = "Password must be at least 8 characters long"
    }

    if (!signupForm.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password"
    } else if (signupForm.password !== signupForm.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match"
    }

    if (!signupForm.acceptTerms) {
      newErrors.acceptTerms = "You must accept the terms and conditions"
    }

    setErrors(newErrors)

    if (Object.keys(newErrors).length === 0) {
      setIsLoading(true)
      const { error } = await signUp(signupForm.email, signupForm.password, signupForm.fullName)
      
      if (error) {
        setErrors({ general: error.message })
      }
      
      setIsLoading(false)
    }
  }

  const handleSocialLogin = (provider: string) => {
    console.log(`Login with ${provider}`)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Back to Home Link */}
      <div className="absolute top-6 left-6 z-10">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>
      </div>

      <div className="grid min-h-screen lg:grid-cols-2">
        {/* Left Side - Branding */}
        <div className="flex items-center justify-center p-8 lg:p-12">
          <div className="mx-auto flex w-full flex-col justify-center space-y-8 sm:w-[400px]">
            <div className="flex flex-col space-y-6 text-center">
              <div className="flex items-center justify-center space-x-3">
                <div className="flex h-12 w-12 items-center justify-center">
                  <TrendingUp className="h-8 w-8 text-blue-600" />
                </div>
                <h1
                  className="text-3xl font-bold tracking-tight"
                  style={{ fontFamily: "var(--font-sans)", fontWeight: 700 }}
                >
                  Foresight
                </h1>
              </div>

              <div className="space-y-4">
                <h2 className="text-3xl font-bold tracking-tight" style={{ fontSize: "1.875rem", fontWeight: 700 }}>
                  Welcome to Foresight
                </h2>
                <p className="text-lg text-muted-foreground" style={{ fontWeight: 400 }}>
                  Harness the power of AI-driven insights to make smarter trading decisions. Monitor market trends,
                  analyze patterns, and stay ahead of the curve with our advanced stock monitoring platform.
                </p>
              </div>

              <div className="grid gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-blue-600"></div>
                  <span>Real-time market analysis powered by AI</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-blue-600"></div>
                  <span>Intelligent alerts and notifications</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-blue-600"></div>
                  <span>Comprehensive portfolio tracking</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Authentication Forms */}
        <div className="flex items-center justify-center p-8 lg:p-12 bg-muted/30">
          <div className="mx-auto w-full max-w-[400px]">
            <Card
              className="border-0 shadow-lg"
              style={{ boxShadow: "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)" }}
            >
              <CardHeader className="space-y-1 pb-4">
                <CardTitle className="text-2xl font-bold text-center" style={{ fontWeight: 700 }}>
                  Get Started
                </CardTitle>
                <CardDescription className="text-center" style={{ fontWeight: 400 }}>
                  Sign in to your account or create a new one
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="login" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 mb-6">
                    <TabsTrigger value="login" style={{ fontWeight: 500 }}>
                      Login
                    </TabsTrigger>
                    <TabsTrigger value="signup" style={{ fontWeight: 500 }}>
                      Sign Up
                    </TabsTrigger>
                  </TabsList>

                  {/* Login Tab */}
                  <TabsContent value="login" className="space-y-4">
                    <form onSubmit={handleLoginSubmit} className="space-y-4">
                      {errors.general && (
                        <div className="text-sm text-red-500 text-center">{errors.general}</div>
                      )}
                      
                      <div className="space-y-2">
                        <Label htmlFor="login-email" style={{ fontWeight: 500 }}>
                          Email
                        </Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="login-email"
                            type="email"
                            placeholder="Enter your email"
                            className="pl-10"
                            value={loginForm.email}
                            onChange={(e) => {
                              setLoginForm({ ...loginForm, email: e.target.value })
                              if (errors.email) setErrors({ ...errors, email: "" })
                            }}
                          />
                        </div>
                        {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="login-password" style={{ fontWeight: 500 }}>
                          Password
                        </Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="login-password"
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter your password"
                            className="pl-10 pr-10"
                            value={loginForm.password}
                            onChange={(e) => {
                              setLoginForm({ ...loginForm, password: e.target.value })
                              if (errors.password) setErrors({ ...errors, password: "" })
                            }}
                          />
                          <button
                            type="button"
                            className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                        {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="remember-me"
                            checked={loginForm.rememberMe}
                            onCheckedChange={(checked) =>
                              setLoginForm({ ...loginForm, rememberMe: checked as boolean })
                            }
                          />
                          <Label htmlFor="remember-me" className="text-sm" style={{ fontWeight: 400 }}>
                            Remember me
                          </Label>
                        </div>
                        <Link
                          href="/forgot-password"
                          className="text-sm text-blue-600 hover:text-blue-500 transition-colors"
                          style={{ fontWeight: 500 }}
                        >
                          Forgot Password?
                        </Link>
                      </div>

                      <Button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700"
                        disabled={isLoading}
                        style={{ fontWeight: 500 }}
                      >
                        {isLoading ? "Signing In..." : "Sign In"}
                      </Button>
                    </form>

                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <Separator className="w-full" />
                      </div>
                      <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
                      </div>
                    </div>

                    <div className="relative">
                      <div className="grid grid-cols-2 gap-3 opacity-50">
                        <Button
                          variant="outline"
                          disabled
                          className="w-full cursor-not-allowed bg-transparent"
                          style={{ fontWeight: 500 }}
                        >
                          <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                            <path
                              fill="currentColor"
                              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                            />
                            <path
                              fill="currentColor"
                              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                            />
                            <path
                              fill="currentColor"
                              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                            />
                            <path
                              fill="currentColor"
                              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                            />
                          </svg>
                          Google
                        </Button>
                        <Button
                          variant="outline"
                          disabled
                          className="w-full cursor-not-allowed bg-transparent"
                          style={{ fontWeight: 500 }}
                        >
                          <Github className="mr-2 h-4 w-4" />
                          GitHub
                        </Button>
                      </div>

                      {/* Coming Soon Overlay */}
                      <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm rounded-md">
                        <div className="bg-card border rounded-lg px-3 py-1.5 shadow-sm">
                          <span className="text-xs font-medium text-muted-foreground">Coming Soon</span>
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  {/* Sign Up Tab */}
                  <TabsContent value="signup" className="space-y-4">
                    <form onSubmit={handleSignupSubmit} className="space-y-4">
                      {errors.general && (
                        <div className="text-sm text-red-500 text-center">{errors.general}</div>
                      )}
                      
                      <div className="space-y-2">
                        <Label htmlFor="signup-name" style={{ fontWeight: 500 }}>
                          Full Name
                        </Label>
                        <div className="relative">
                          <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="signup-name"
                            type="text"
                            placeholder="Enter your full name"
                            className="pl-10"
                            value={signupForm.fullName}
                            onChange={(e) => {
                              setSignupForm({ ...signupForm, fullName: e.target.value })
                              if (errors.fullName) setErrors({ ...errors, fullName: "" })
                            }}
                          />
                        </div>
                        {errors.fullName && <p className="text-sm text-red-500">{errors.fullName}</p>}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="signup-email" style={{ fontWeight: 500 }}>
                          Email
                        </Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="signup-email"
                            type="email"
                            placeholder="Enter your email"
                            className="pl-10"
                            value={signupForm.email}
                            onChange={(e) => {
                              setSignupForm({ ...signupForm, email: e.target.value })
                              if (errors.email) setErrors({ ...errors, email: "" })
                            }}
                          />
                        </div>
                        {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="signup-password" style={{ fontWeight: 500 }}>
                          Password
                        </Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="signup-password"
                            type={showPassword ? "text" : "password"}
                            placeholder="Create a password"
                            className="pl-10 pr-10"
                            value={signupForm.password}
                            onChange={(e) => {
                              setSignupForm({ ...signupForm, password: e.target.value })
                              if (errors.password) setErrors({ ...errors, password: "" })
                            }}
                          />
                          <button
                            type="button"
                            className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                        {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="signup-confirm-password" style={{ fontWeight: 500 }}>
                          Confirm Password
                        </Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="signup-confirm-password"
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="Confirm your password"
                            className="pl-10 pr-10"
                            value={signupForm.confirmPassword}
                            onChange={(e) => {
                              setSignupForm({ ...signupForm, confirmPassword: e.target.value })
                              if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: "" })
                            }}
                          />
                          <button
                            type="button"
                            className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          >
                            {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                        {errors.confirmPassword && <p className="text-sm text-red-500">{errors.confirmPassword}</p>}
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-start space-x-2">
                          <Checkbox
                            id="accept-terms"
                            checked={signupForm.acceptTerms}
                            onCheckedChange={(checked) => {
                              setSignupForm({ ...signupForm, acceptTerms: checked as boolean })
                              if (errors.acceptTerms) setErrors({ ...errors, acceptTerms: "" })
                            }}
                            className="mt-1"
                          />
                          <Label htmlFor="accept-terms" className="text-sm leading-5" style={{ fontWeight: 400 }}>
                            I agree to the{" "}
                            <Link href="/terms" className="text-blue-600 hover:text-blue-500 transition-colors">
                              Terms and Conditions
                            </Link>{" "}
                            and{" "}
                            <Link href="/privacy" className="text-blue-600 hover:text-blue-500 transition-colors">
                              Privacy Policy
                            </Link>
                          </Label>
                        </div>
                        {errors.acceptTerms && <p className="text-sm text-red-500">{errors.acceptTerms}</p>}
                      </div>

                      <Button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700"
                        disabled={isLoading}
                        style={{ fontWeight: 500 }}
                      >
                        {isLoading ? "Creating Account..." : "Create Account"}
                      </Button>
                    </form>

                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <Separator className="w-full" />
                      </div>
                      <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
                      </div>
                    </div>

                    <div className="relative">
                      <div className="grid grid-cols-2 gap-3 opacity-50">
                        <Button
                          variant="outline"
                          disabled
                          className="w-full cursor-not-allowed bg-transparent"
                          style={{ fontWeight: 500 }}
                        >
                          <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                            <path
                              fill="currentColor"
                              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                            />
                            <path
                              fill="currentColor"
                              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                            />
                            <path
                              fill="currentColor"
                              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                            />
                            <path
                              fill="currentColor"
                              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                            />
                          </svg>
                          Google
                        </Button>
                        <Button
                          variant="outline"
                          disabled
                          className="w-full cursor-not-allowed bg-transparent"
                          style={{ fontWeight: 500 }}
                        >
                          <Github className="mr-2 h-4 w-4" />
                          GitHub
                        </Button>
                      </div>

                      {/* Coming Soon Overlay */}
                      <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm rounded-md">
                        <div className="bg-card border rounded-lg px-3 py-1.5 shadow-sm">
                          <span className="text-xs font-medium text-muted-foreground">Coming Soon</span>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
} 