"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function HomePage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-primary/95 backdrop-blur border-b border-primary/20">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center">
              <span className="text-accent-foreground font-bold text-lg">N</span>
            </div>
            <span className="text-primary-foreground font-bold text-xl hidden sm:inline">NUTRITRACK</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="#features" className="text-primary-foreground hover:text-accent transition">
              Features
            </Link>
            <Link href="#benefits" className="text-primary-foreground hover:text-accent transition">
              Benefits
            </Link>
            <Link href="#community" className="text-primary-foreground hover:text-accent transition">
              Community
            </Link>
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex gap-3">
            <Link href="/login">
              <Button
                variant="outline"
                className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary bg-transparent"
              >
                Login
              </Button>
            </Link>
            <Link href="/signup">
              <Button className="bg-accent hover:bg-accent/90 text-accent-foreground">Get Started</Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden text-primary-foreground">
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-primary border-t border-primary/20">
            <div className="px-4 py-4 flex flex-col gap-4">
              <Link
                href="#features"
                className="text-primary-foreground hover:text-accent transition"
                onClick={() => setMobileMenuOpen(false)}
              >
                Features
              </Link>
              <Link
                href="#benefits"
                className="text-primary-foreground hover:text-accent transition"
                onClick={() => setMobileMenuOpen(false)}
              >
                Benefits
              </Link>
              <Link
                href="#community"
                className="text-primary-foreground hover:text-accent transition"
                onClick={() => setMobileMenuOpen(false)}
              >
                Community
              </Link>
              <div className="flex flex-col gap-3 pt-2 border-t border-primary/20">
                <Link href="/login" className="w-full">
                  <Button
                    variant="outline"
                    className="w-full border-primary-foreground text-primary-foreground bg-transparent"
                  >
                    Login
                  </Button>
                </Link>
                <Link href="/signup" className="w-full">
                  <Button className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">Get Started</Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6 leading-tight">
            Track Your Nutrition. Fuel Your Gains.
          </h1>
          <p className="text-lg md:text-xl text-foreground/80 mb-8 max-w-2xl mx-auto">
            NUTRITRACK helps Nigerian gym enthusiasts make smart nutrition choices using local foods. Log meals, get
            personalized suggestions, and track your progress with ease.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup">
              <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground w-full sm:w-auto">
                Start Free Trial
              </Button>
            </Link>
            <Link href="#features">
              <Button size="lg" variant="outline" className="border-foreground/20 w-full sm:w-auto bg-transparent">
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 bg-card">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-foreground">Powerful Features</h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: "🍲",
                title: "Local Food Logging",
                description: "Log Nigerian meals like jollof rice, egusi soup, and more with accurate nutritional data",
              },
              {
                icon: "📊",
                title: "Smart Portion Guide",
                description: "Visual guides using locally available measuring tools - no scales needed",
              },
              {
                icon: "🎯",
                title: "Personalized Suggestions",
                description: "Get meal recommendations based on your fitness goals using local ingredients",
              },
              {
                icon: "📈",
                title: "Weekly Dashboard",
                description: "Track consistency streaks and see your weekly progress at a glance",
              },
              {
                icon: "🔔",
                title: "Smart Reminders",
                description: "Daily meal time and hydration reminders to keep you on track",
              },
              {
                icon: "👥",
                title: "Community Tips",
                description: "Share wins, get motivation, and learn from other gym enthusiasts",
              },
            ].map((feature, i) => (
              <div
                key={i}
                className="p-6 rounded-lg bg-background border border-border/50 hover:border-primary/30 transition"
              >
                <div className="text-4xl mb-3">{feature.icon}</div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
                <p className="text-foreground/70">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-foreground">Why NUTRITRACK</h2>

          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-2xl font-bold text-primary mb-4">Built for Nigerian Gym Enthusiasts</h3>
              <ul className="space-y-4 text-foreground/80">
                <li className="flex gap-3">
                  <span className="text-accent text-xl">✓</span>
                  <span>Comprehensive Nigerian food database with local meals</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-accent text-xl">✓</span>
                  <span>Portion guides using items readily available at home</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-accent text-xl">✓</span>
                  <span>Nutrition tracking without complicated calculations</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-accent text-xl">✓</span>
                  <span>Community of like-minded fitness enthusiasts</span>
                </li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-lg p-8 border border-primary/20">
              <h4 className="text-xl font-bold text-foreground mb-4">Quick Stats</h4>
              <div className="space-y-4">
                <div>
                  <div className="text-3xl font-bold text-primary">500+</div>
                  <p className="text-foreground/70">Nigerian foods in database</p>
                </div>
                <div>
                  <div className="text-3xl font-bold text-accent">10K+</div>
                  <p className="text-foreground/70">Active users tracking</p>
                </div>
                <div>
                  <div className="text-3xl font-bold text-primary">98%</div>
                  <p className="text-foreground/70">User satisfaction rate</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Community Section */}
      <section id="community" className="py-20 px-4 bg-card">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-foreground">Join Our Community</h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-5xl mb-4">💪</div>
              <h3 className="font-bold text-lg text-foreground mb-2">Get Motivated</h3>
              <p className="text-foreground/70">Connect with other gym enthusiasts and stay motivated</p>
            </div>
            <div className="text-center">
              <div className="text-5xl mb-4">💡</div>
              <h3 className="font-bold text-lg text-foreground mb-2">Share Tips</h3>
              <p className="text-foreground/70">Exchange nutrition tips and fitness strategies</p>
            </div>
            <div className="text-center">
              <div className="text-5xl mb-4">🏆</div>
              <h3 className="font-bold text-lg text-foreground mb-2">Celebrate Wins</h3>
              <p className="text-foreground/70">Share your progress and celebrate milestones together</p>
            </div>
          </div>

          <div className="mt-12 text-center">
            <Link href="/signup">
              <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
                Join the Community
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary text-primary-foreground py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center">
                  <span className="text-accent-foreground font-bold">N</span>
                </div>
                <span className="font-bold">NUTRITRACK</span>
              </div>
              <p className="text-sm opacity-80">Track. Fuel. Grow.</p>
            </div>
            <div>
              <h4 className="font-bold mb-3">Product</h4>
              <ul className="space-y-2 text-sm opacity-80">
                <li>
                  <Link href="#features" className="hover:opacity-100">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="#benefits" className="hover:opacity-100">
                    Pricing
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-3">Company</h4>
              <ul className="space-y-2 text-sm opacity-80">
                <li>
                  <Link href="#" className="hover:opacity-100">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:opacity-100">
                    Blog
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-3">Legal</h4>
              <ul className="space-y-2 text-sm opacity-80">
                <li>
                  <Link href="#" className="hover:opacity-100">
                    Privacy
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:opacity-100">
                    Terms
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-primary-foreground/20 pt-8 text-sm text-center opacity-80">
            <p>&copy; 2025 NUTRITRACK. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
