"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Heart, MessageSquare, Share2 } from "lucide-react"

interface CommunityTip {
  id: string
  user_id: string
  title: string
  content: string
  tip_type: string
  likes: number
  created_at: string
}

const MOTIVATIONAL_QUOTES = [
  "Your body can stand almost anything. It's your mind that you need to convince.",
  "Take care of your body. It's the only place you have to live.",
  "The difference between who you are and who you want to be is what you do.",
  "Consistency is the key to remarkable results.",
  "Don't watch the clock; do what it does. Keep going.",
  "Strong is the new skinny.",
  "Your health is an investment, not an expense.",
]

export function CommunitySection({ userId }: { userId: string }) {
  const [tips, setTips] = useState<CommunityTip[]>([])
  const [newTip, setNewTip] = useState("")
  const [selectedType, setSelectedType] = useState("nutrition")
  const [loading, setLoading] = useState(true)
  const [title, setTitle] = useState("")
  const supabase = createClient()

  useEffect(() => {
    fetchTips()
  }, [])

  const fetchTips = async () => {
    try {
      const { data } = await supabase
        .from("community_tips")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(10)
      setTips(data || [])
    } catch (error) {
      console.error("Error fetching tips:", error)
    } finally {
      setLoading(false)
    }
  }

  const submitTip = async () => {
    if (!title.trim() || !newTip.trim()) return

    try {
      const { error } = await supabase.from("community_tips").insert({
        user_id: userId,
        title,
        content: newTip,
        tip_type: selectedType,
      })

      if (!error) {
        setTitle("")
        setNewTip("")
        fetchTips()
      }
    } catch (error) {
      console.error("Error submitting tip:", error)
    }
  }

  const likeTip = async (tipId: string, currentLikes: number) => {
    try {
      await supabase
        .from("community_tips")
        .update({ likes: currentLikes + 1 })
        .eq("id", tipId)
      fetchTips()
    } catch (error) {
      console.error("Error liking tip:", error)
    }
  }

  const getRandomQuote = () => {
    return MOTIVATIONAL_QUOTES[Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length)]
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-foreground">Community Tips & Motivation</h1>

      {/* Daily Motivation */}
      <Card className="bg-gradient-to-r from-accent/20 to-primary/20 border-accent/30">
        <CardContent className="pt-6">
          <div className="text-center">
            <p className="text-sm text-foreground/70 mb-3 font-semibold">Today's Motivation</p>
            <p className="text-lg font-semibold text-foreground italic">"{getRandomQuote()}"</p>
            <p className="text-xs text-foreground/60 mt-4">Remember: You're stronger than you think!</p>
          </div>
        </CardContent>
      </Card>

      {/* Submit Tip Form */}
      <Card>
        <CardHeader>
          <CardTitle>Share Your Tips</CardTitle>
          <CardDescription>Help other gym enthusiasts with your nutrition and fitness knowledge</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="tip-title">Tip Title</Label>
            <Input
              id="tip-title"
              placeholder="e.g., Best time to eat jollof rice for muscle gain"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tip-content">Your Tip</Label>
            <textarea
              id="tip-content"
              placeholder="Share your knowledge..."
              value={newTip}
              onChange={(e) => setNewTip(e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground placeholder:text-foreground/50 focus:outline-none focus:ring-2 focus:ring-accent"
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tip-type">Category</Label>
            <select
              id="tip-type"
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
            >
              <option value="nutrition">Nutrition</option>
              <option value="fitness">Fitness</option>
              <option value="motivation">Motivation</option>
            </select>
          </div>

          <Button
            onClick={submitTip}
            disabled={!title.trim() || !newTip.trim()}
            className="w-full bg-accent hover:bg-accent/90"
          >
            Share Tip
          </Button>
        </CardContent>
      </Card>

      {/* Community Tips Feed */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-foreground">Community Tips Feed</h2>

        {loading ? (
          <p className="text-foreground/70">Loading tips...</p>
        ) : tips.length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-center text-foreground/70">
              No tips yet. Be the first to share!
            </CardContent>
          </Card>
        ) : (
          tips.map((tip) => (
            <Card key={tip.id} className="hover:border-accent/50 transition">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{tip.title}</CardTitle>
                    <CardDescription>
                      <span className="capitalize inline-block bg-primary/10 px-2 py-1 rounded text-xs mr-2">
                        {tip.tip_type}
                      </span>
                      {new Date(tip.created_at).toLocaleDateString()}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-foreground text-sm leading-relaxed">{tip.content}</p>

                <div className="flex items-center gap-4 pt-4 border-t border-border">
                  <button
                    onClick={() => likeTip(tip.id, tip.likes)}
                    className="flex items-center gap-2 text-foreground/70 hover:text-accent transition"
                  >
                    <Heart size={18} />
                    <span className="text-sm">{tip.likes}</span>
                  </button>
                  <button className="flex items-center gap-2 text-foreground/70 hover:text-accent transition">
                    <MessageSquare size={18} />
                    <span className="text-sm">Reply</span>
                  </button>
                  <button className="flex items-center gap-2 text-foreground/70 hover:text-accent transition ml-auto">
                    <Share2 size={18} />
                  </button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
