"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader } from "lucide-react"

interface MealSuggestion {
  meals: Array<{
    name: string
    reason: string
    estimatedCalories: number
    macros: {
      protein: number
      carbs: number
      fat: number
    }
    portionSize: string
    localMeasurement: string
    prepTime: number
    tags: string[]
  }>
  hydrationTip: string
  mealTiming: string
}

export function MealSuggestions({
  fitnessGoal,
  userId,
}: {
  fitnessGoal: string
  userId: string
}) {
  const [suggestions, setSuggestions] = useState<MealSuggestion | null>(null)
  const [loading, setLoading] = useState(false)

  const generateSuggestions = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/suggest-meals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fitnessGoal,
          dailyCalories: fitnessGoal === "muscle-gain" ? 2800 : fitnessGoal === "weight-loss" ? 1800 : 2200,
          currentWeightKg: 75,
        }),
      })

      const data = await response.json()
      setSuggestions(data)
    } catch (error) {
      console.error("Error generating suggestions:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-foreground">AI-Powered Meal Suggestions</h2>
        <Button onClick={generateSuggestions} disabled={loading} className="bg-accent hover:bg-accent/90">
          {loading ? (
            <>
              <Loader className="animate-spin mr-2" size={18} />
              Generating...
            </>
          ) : (
            "Generate Suggestions"
          )}
        </Button>
      </div>

      {suggestions && (
        <>
          {/* Hydration and Timing Tips */}
          <div className="grid md:grid-cols-2 gap-4">
            <Card className="bg-accent/10 border-accent/30">
              <CardContent className="pt-6">
                <div className="text-sm">
                  <p className="font-semibold text-foreground mb-2">💧 Hydration</p>
                  <p className="text-foreground/80">{suggestions.hydrationTip}</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-accent/10 border-accent/30">
              <CardContent className="pt-6">
                <div className="text-sm">
                  <p className="font-semibold text-foreground mb-2">⏰ Meal Timing</p>
                  <p className="text-foreground/80">{suggestions.mealTiming}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Suggested Meals */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Recommended Meals</h3>
            {suggestions.meals.map((meal, idx) => (
              <Card key={idx} className="hover:border-accent/50 transition">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg text-foreground">{meal.name}</CardTitle>
                      <CardDescription>{meal.reason}</CardDescription>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-accent">{meal.estimatedCalories}</div>
                      <p className="text-xs text-foreground/70">calories</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Macros */}
                  <div className="grid grid-cols-3 gap-4">
                    <div className="p-3 bg-background rounded border border-border">
                      <p className="text-xs text-foreground/70 font-semibold">PROTEIN</p>
                      <p className="text-lg font-bold text-foreground">{meal.macros.protein}g</p>
                    </div>
                    <div className="p-3 bg-background rounded border border-border">
                      <p className="text-xs text-foreground/70 font-semibold">CARBS</p>
                      <p className="text-lg font-bold text-foreground">{meal.macros.carbs}g</p>
                    </div>
                    <div className="p-3 bg-background rounded border border-border">
                      <p className="text-xs text-foreground/70 font-semibold">FAT</p>
                      <p className="text-lg font-bold text-foreground">{meal.macros.fat}g</p>
                    </div>
                  </div>

                  {/* Portion and Timing */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-foreground/70 font-semibold mb-1">PORTION SIZE</p>
                      <p className="text-foreground">{meal.portionSize}</p>
                      <p className="text-xs text-foreground/60">{meal.localMeasurement}</p>
                    </div>
                    <div>
                      <p className="text-xs text-foreground/70 font-semibold mb-1">PREP TIME</p>
                      <p className="text-foreground">{meal.prepTime} minutes</p>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2">
                    {meal.tags.map((tag, i) => (
                      <span key={i} className="text-xs px-3 py-1 bg-primary/10 text-primary rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
