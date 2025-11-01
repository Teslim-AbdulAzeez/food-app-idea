"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Pointer as Spinner } from "lucide-react"

export default function AuthCallbackPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const supabase = createClient()

        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser()

        if (userError || !user) {
          setError("Authentication failed. Please try logging in again.")
          setTimeout(() => router.push("/auth/login"), 2000)
          return
        }

        router.push("/dashboard")
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred")
        setTimeout(() => router.push("/auth/login"), 2000)
      } finally {
        setIsLoading(false)
      }
    }

    handleCallback()
  }, [router])

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-secondary flex items-center justify-center px-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Authentication Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-red-500 text-sm">{error}</p>
            <p className="text-muted-foreground text-sm mt-2">Redirecting to login...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary flex items-center justify-center px-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <CardTitle>Confirming Your Email</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-4">
          <Spinner className="animate-spin text-accent" size={32} />
          <p className="text-muted-foreground">Setting up your account...</p>
        </CardContent>
      </Card>
    </div>
  )
}
