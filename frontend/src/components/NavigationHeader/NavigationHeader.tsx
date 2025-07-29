"use client"

import * as React from "react"
import { Bell, Github, Menu, Moon, Sun, TrendingUp, User, X, Settings, BarChart3, Home } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import styles from './NavigationHeader.module.css'

interface NavigationHeaderProps {
  currentPath?: string
  userName?: string
  userEmail?: string
  userAvatar?: string
  notificationCount?: number
  onThemeToggle?: () => void
  onLogout?: () => void
  onProfileClick?: () => void
  onSettingsClick?: () => void
}

export function NavigationHeader({
  currentPath = "/dashboard",
  userName = "John Doe",
  userEmail = "john@example.com",
  userAvatar,
  notificationCount = 3,
  onThemeToggle,
  onLogout,
  onProfileClick,
  onSettingsClick,
}: NavigationHeaderProps) {
  const [isDarkMode, setIsDarkMode] = React.useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false)

  const navigationItems = [
    { name: "Home", href: "/", icon: Home },
    { name: "Dashboard", href: "/dashboard", icon: TrendingUp },
    { name: "Market", href: "/market", icon: BarChart3 },
    { name: "Alerts", href: "/alerts", icon: Bell },
  ]

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode)
    // In a real app, you'd update your theme context or localStorage here
    document.documentElement.classList.toggle("dark")
    onThemeToggle?.()
  }

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const isActivePath = (path: string) => currentPath === path

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        {/* Logo */}
        <div className={styles.logoDesktop}>
          <a className={styles.logoLink} href="/dashboard">
            <TrendingUp className={styles.logoIcon} />
            <span className={styles.logoText}>Foresight</span>
          </a>
        </div>

        {/* Mobile menu button */}
        <Button
          variant="ghost"
          className={styles.mobileMenuButton}
          onClick={toggleMobileMenu}
        >
          {isMobileMenuOpen ? <X className={styles.menuIcon} /> : <Menu className={styles.menuIcon} />}
          <span className={styles.srOnly}>Toggle Menu</span>
        </Button>

        {/* Mobile logo */}
        <div className={styles.mobileContainer}>
          <div className={styles.mobileLogoWrapper}>
            <a className={styles.mobileLogoLink} href="/dashboard">
              <TrendingUp className={styles.logoIcon} />
              <span className={styles.mobileLogoText}>Foresight</span>
            </a>
          </div>

          {/* Desktop Navigation */}
          <nav className={styles.desktopNav}>
            {navigationItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className={`${styles.navLink} ${
                  isActivePath(item.href) ? styles.activeNavLink : styles.inactiveNavLink
                }`}
              >
                <item.icon className={styles.navIcon} />
                <span>{item.name}</span>
                {isActivePath(item.href) && (
                  <div className={styles.activeIndicator} />
                )}
              </a>
            ))}
          </nav>

          {/* Right side actions */}
          <div className={styles.rightActions}>
            {/* GitHub button */}
            <a
              href="https://github.com/salimmohamed/foresight"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.githubLink}
            >
              <Github className={styles.githubIcon} />
              <span>GitHub</span>
            </a>

            {/* Theme toggle */}
            <Button variant="ghost" size="icon" onClick={toggleTheme} className={styles.themeButton}>
              <Sun className={styles.sunIcon} />
              <Moon className={styles.moonIcon} />
              <span className={styles.srOnly}>Toggle theme</span>
            </Button>

            {/* User profile dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className={styles.avatarButton}>
                  <Avatar className={styles.avatar}>
                    <AvatarImage src={userAvatar || "/placeholder.svg"} alt={userName} />
                    <AvatarFallback className={styles.avatarFallback}>
                      {userName
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className={styles.dropdownContent} align="end" forceMount>
                <DropdownMenuLabel className={styles.dropdownLabel}>
                  <div className={styles.userInfo}>
                    <p className={styles.userName}>{userName}</p>
                    <p className={styles.userEmail}>{userEmail}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={onProfileClick}>
                  <User className={styles.dropdownIcon} />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={onSettingsClick}>
                  <Settings className={styles.dropdownIcon} />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={onLogout}>
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className={styles.mobileNavContainer}>
          <nav className={styles.mobileNav}>
            <div className={styles.mobileNavItems}>
              {navigationItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className={`${styles.mobileNavLink} ${
                    isActivePath(item.href) ? styles.activeMobileNavLink : styles.inactiveMobileNavLink
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <item.icon className={styles.mobileNavIcon} />
                  <span>{item.name}</span>
                </a>
              ))}

              {/* GitHub button for mobile */}
              <a
                href="https://github.com/salimmohamed/foresight"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.mobileGithubLink}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Github className={styles.mobileNavIcon} />
                <span>GitHub</span>
              </a>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
} 