"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { LogOut } from "lucide-react"
import { MobileNav } from "@/components/mobile-nav"
import { MealSuggestions } from "@/components/meal-suggestions"
import { ProgressDashboard } from "@/components/progress-dashboard"
import { CommunitySection } from "@/components/community-section"
import { RemindersSection } from "@/components/reminders-section"

const TABS = ["meals", "progress", "suggestions", "reminders", "community", "profile"]

export function DashboardContent({ user, profile }: any) {
  const [activeTab, setActiveTab] = useState("meals")
  const [foodSearch, setFoodSearch] = useState("")
  const [foods, setFoods] = useState<any[]>([])
  const [mealType, setMealType] = useState("breakfast")
  const [portions, setPortions] = useState("1")
  const [todaysMeals, setTodaysMeals] = useState<any[]>([])
  const router = useRouter()
  const supabase = createClient()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/")
  }

  const searchFoods = async () => {
    if (!foodSearch.trim()) return
    const { data } = await supabase.from("nigerian_foods").select("*").ilike("name", `%${foodSearch}%`).limit(10)
    setFoods(data || [])
  }

  const addMeal = async (food: any) => {
    const { error } = await supabase.from("meal_logs").insert({
      user_id: user.id,
      food_id: food.id,
      portions_consumed: Number.parseFloat(portions),
      meal_type: mealType,
      logged_at: new Date().toISOString(),
    })

    if (!error) {
      setTodaysMeals([...todaysMeals, { ...food, portions_consumed: Number.parseFloat(portions), meal_type: mealType }])
      setFoodSearch("")
      setFoods([])
      setPortions("1")
    }
  }

  const calculateTotals = () => {
    return todaysMeals.reduce(
      (acc, meal) => ({
        calories: acc.calories + meal.calories_per_serving * meal.portions_consumed,
        protein: acc.protein + meal.protein_g * meal.portions_consumed,
        carbs: acc.carbs + meal.carbs_g * meal.portions_consumed,
        fat: acc.fat + meal.fat_g * meal.portions_consumed,
      }),
      { calories: 0, protein: 0, carbs: 0, fat: 0 },
    )
  }

  const totals = calculateTotals()

  return (
    <>
      {/* Navigation - Desktop and Mobile */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-primary/95 backdrop-blur border-b border-primary/20">
        <div className="max-w-7xl mx-auto px-4 py-3 md:py-4 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-accent-foreground font-bold text-sm md:text-base">N</span>
            </div>
            <span className="text-primary-foreground font-bold text-lg md:text-xl hidden sm:inline">NUTRITRACK</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1 lg:gap-6">
            {TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-2 rounded capitalize font-medium text-sm transition ${
                  activeTab === tab
                    ? "bg-accent text-accent-foreground"
                    : "text-primary-foreground hover:bg-primary-foreground/10"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Right Section - Desktop */}
          <div className="hidden md:flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="text-primary-foreground hover:bg-primary-foreground/20"
            >
              <LogOut size={18} />
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <MobileNav tabs={TABS} activeTab={activeTab} onTabChange={setActiveTab} onLogout={handleLogout} />
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-20 md:pt-24 pb-8 px-3 md:px-4 max-w-6xl mx-auto w-full">
        {/* Meals Tab */}
        {activeTab === "meals" && (
          <div className="space-y-4 md:space-y-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground">Log Your Meals</h1>
              <p className="text-sm text-foreground/70 mt-1">Search and add Nigerian foods to your daily log</p>
            </div>

            <Card className="w-full">
              <CardHeader className="pb-3 md:pb-6">
                <CardTitle className="text-lg md:text-xl">Search Nigerian Foods</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 md:space-y-4">
                <div className="flex flex-col sm:flex-row gap-2">
                  <Input
                    placeholder="e.g., jollof rice, egusi soup..."
                    value={foodSearch}
                    onChange={(e) => setFoodSearch(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && searchFoods()}
                    className="text-sm"
                  />
                  <Button onClick={searchFoods} className="bg-accent hover:bg-accent/90 w-full sm:w-auto">
                    Search
                  </Button>
                </div>

                {foods.length > 0 && (
                  <div className="grid gap-2 md:gap-3">
                    {foods.map((food) => (
                      <div
                        key={food.id}
                        className="p-3 md:p-4 border border-border rounded-lg hover:border-accent/50 transition"
                      >
                        <div className="flex justify-between items-start mb-2 gap-2">
                          <div className="min-w-0 flex-1">
                            <h3 className="font-semibold text-foreground text-sm md:text-base truncate">{food.name}</h3>
                            <p className="text-xs md:text-sm text-foreground/70">{food.local_measurement}</p>
                          </div>
                          <span className="text-accent font-bold text-sm md:text-base flex-shrink-0">
                            {food.calories_per_serving} kcal
                          </span>
                        </div>
                        <p className="text-xs text-foreground/60 mb-3">
                          P: {food.protein_g}g | C: {food.carbs_g}g | F: {food.fat_g}g
                        </p>

                        <div className="flex gap-2 items-end flex-wrap">
                          <div className="flex-1 min-w-[120px]">
                            <Label className="text-xs">Meal Type</Label>
                            <select
                              value={mealType}
                              onChange={(e) => setMealType(e.target.value)}
                              className="w-full px-2 py-1 border border-border rounded text-xs md:text-sm bg-background text-foreground"
                            >
                              <option value="breakfast">Breakfast</option>
                              <option value="lunch">Lunch</option>
                              <option value="dinner">Dinner</option>
                              <option value="snack">Snack</option>
                            </select>
                          </div>
                          <div className="flex-1 min-w-[100px]">
                            <Label className="text-xs">Portions</Label>
                            <Input
                              type="number"
                              min="0.5"
                              step="0.5"
                              value={portions}
                              onChange={(e) => setPortions(e.target.value)}
                              className="text-xs md:text-sm"
                            />
                          </div>
                          <Button
                            onClick={() => addMeal(food)}
                            size="sm"
                            className="bg-primary hover:bg-primary/90 flex-shrink-0"
                          >
                            Add
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {todaysMeals.length > 0 && (
              <Card className="w-full">
                <CardHeader className="pb-3 md:pb-6">
                  <CardTitle className="text-lg md:text-xl">Today's Meals</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 md:space-y-4">
                  <div className="space-y-2 md:space-y-3">
                    {todaysMeals.map((meal, idx) => (
                      <div key={idx} className="p-3 md:p-4 bg-background border border-border rounded">
                        <div className="flex justify-between gap-2">
                          <span className="font-semibold text-foreground text-sm md:text-base">{meal.name}</span>
                          <span className="text-accent text-sm md:text-base flex-shrink-0">
                            {meal.portions_consumed}
                          </span>
                        </div>
                        <p className="text-xs text-foreground/60 capitalize">{meal.meal_type}</p>
                      </div>
                    ))}
                  </div>

                  <Card className="bg-accent/10 border-accent/30">
                    <CardContent className="pt-4 md:pt-6">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4 text-center">
                        <div className="text-xs md:text-sm">
                          <div className="text-xl md:text-2xl font-bold text-accent">{totals.calories.toFixed(0)}</div>
                          <p className="text-xs text-foreground/70 mt-1">Calories</p>
                        </div>
                        <div className="text-xs md:text-sm">
                          <div className="text-xl md:text-2xl font-bold text-foreground">
                            {totals.protein.toFixed(1)}
                          </div>
                          <p className="text-xs text-foreground/70 mt-1">Protein (g)</p>
                        </div>
                        <div className="text-xs md:text-sm">
                          <div className="text-xl md:text-2xl font-bold text-foreground">{totals.carbs.toFixed(1)}</div>
                          <p className="text-xs text-foreground/70 mt-1">Carbs (g)</p>
                        </div>
                        <div className="text-xs md:text-sm">
                          <div className="text-xl md:text-2xl font-bold text-foreground">{totals.fat.toFixed(1)}</div>
                          <p className="text-xs text-foreground/70 mt-1">Fat (g)</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Progress Tab */}
        {activeTab === "progress" && <ProgressDashboard userId={user.id} />}

        {/* Suggestions Tab */}
        {activeTab === "suggestions" && <MealSuggestions fitnessGoal={profile?.fitness_goal} userId={user.id} />}

        {/* Reminders Tab */}
        {activeTab === "reminders" && <RemindersSection userId={user.id} />}

        {/* Community Tab */}
        {activeTab === "community" && <CommunitySection userId={user.id} />}

        {/* Profile Tab */}
        {activeTab === "profile" && (
          <Card className="w-full">
            <CardHeader>
              <CardTitle className="text-lg md:text-xl">Your Profile</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 md:space-y-6">
              <div>
                <Label className="text-foreground/70 text-sm">Name</Label>
                <p className="text-foreground font-semibold text-sm md:text-base">{profile?.name}</p>
              </div>
              <div>
                <Label className="text-foreground/70 text-sm">Email</Label>
                <p className="text-foreground font-semibold text-sm md:text-base break-all">{user.email}</p>
              </div>
              <div>
                <Label className="text-foreground/70 text-sm">Fitness Goal</Label>
                <p className="text-foreground font-semibold text-sm md:text-base capitalize">
                  {profile?.fitness_goal.replace("-", " ")}
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </>
  )
}
