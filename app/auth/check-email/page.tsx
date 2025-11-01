"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Mail } from "lucide-react"

export default function CheckEmailPage() {
  const [canResend, setCanResend] = useState(false)
  const [timer, setTimer] = useState(60)

  useEffect(() => {
    if (!canResend) {
      const interval = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            setCanResend(true)
            return 0
          }
          return prev - 1
        })
      }, 1000)
      return () => clearInterval(interval)
    }
  }, [canResend])

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary flex items-center justify-center px-4 py-8">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-3">
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center">
              <Mail className="text-accent" size={32} />
            </div>
          </div>
          <CardTitle className="text-2xl">Check Your Email</CardTitle>
          <CardDescription>
            We've sent a confirmation link to your email address. Click it to verify your account and get started.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="bg-accent/10 border border-accent/20 rounded-lg p-4 text-center">
            <p className="text-sm text-foreground/70">The link will redirect you to complete your account setup.</p>
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold text-sm text-foreground">Next Steps:</h3>
            <ol className="text-sm text-foreground/70 space-y-1 list-decimal list-inside">
              <li>Check your email inbox</li>
              <li>Click the confirmation link</li>
              <li>You'll be redirected to your dashboard</li>
            </ol>
          </div>

          <div className="pt-4 border-t border-border">
            <p className="text-xs text-foreground/60 mb-3">
              Didn't receive the email? Check your spam folder or try signing up again.
            </p>
            <Link href="/auth/sign-up" className="w-full block">
              <Button variant="outline" className="w-full bg-transparent">
                Back to Sign Up
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
