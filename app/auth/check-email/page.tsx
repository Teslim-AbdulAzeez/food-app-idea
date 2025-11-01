export default function CheckEmailPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary flex items-center justify-center px-4">
      <div className="text-center">
        <div className="text-6xl mb-4">📧</div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Check Your Email</h1>
        <p className="text-foreground/70 max-w-md">
          We've sent you a confirmation link. Please check your email to verify your account and get started.
        </p>
      </div>
    </div>
  )
}
