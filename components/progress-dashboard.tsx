"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"

interface DailyStats {
  date: string
  calories: number
  protein: number
  carbs: number
  fat: number
  mealCount: number
  consistency: boolean
}

interface WeeklyData {
  days: DailyStats[]
  totalCalories: number
  avgProtein: number
  consistencyStreak: number
  bestDay: string
}

export function ProgressDashboard({ userId }: { userId: string }) {
  const [weeklyData, setWeeklyData] = useState<WeeklyData | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const fetchWeeklyData = async () => {
      try {
        // Get last 7 days of meal logs
        const last7Days = Array.from({ length: 7 }, (_, i) => {
          const date = new Date()
          date.setDate(date.getDate() - (6 - i))
          return date.toISOString().split("T")[0]
        })

        const { data: mealLogs } = await supabase
          .from("meal_logs")
          .select("logged_at, food_id, portions_consumed")
          .eq("user_id", userId)
          .gte("logged_at", new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())

        // Fetch food details for meals
        const foodIds = [...new Set((mealLogs || []).map((m) => m.food_id))]
        const { data: foods } = await supabase
          .from("nigerian_foods")
          .select("id, calories_per_serving, protein_g, carbs_g, fat_g")
          .in("id", foodIds.length > 0 ? foodIds : ["00000000-0000-0000-0000-000000000000"])

        // Calculate daily stats
        const dailyStats: Record<string, DailyStats> = {}
        last7Days.forEach((date) => {
          dailyStats[date] = {
            date,
            calories: 0,
            protein: 0,
            carbs: 0,
            fat: 0,
            mealCount: 0,
            consistency: false,
          }
        })

        mealLogs?.forEach((log) => {
          const logDate = log.logged_at.split("T")[0]
          const food = foods?.find((f) => f.id === log.food_id)

          if (food && dailyStats[logDate]) {
            dailyStats[logDate].calories += food.calories_per_serving * log.portions_consumed
            dailyStats[logDate].protein += food.protein_g * log.portions_consumed
            dailyStats[logDate].carbs += food.carbs_g * log.portions_consumed
            dailyStats[logDate].fat += food.fat_g * log.portions_consumed
            dailyStats[logDate].mealCount += 1
            dailyStats[logDate].consistency = true
          }
        })

        const days = Object.values(dailyStats)
        const consistencyDays = days.filter((d) => d.consistency).length

        // Calculate streak
        let streak = 0
        for (let i = days.length - 1; i >= 0; i--) {
          if (days[i].consistency) streak++
          else break
        }

        // Find best day
        const bestDay = days.reduce((prev, current) => (current.calories > prev.calories ? current : prev)).date

        setWeeklyData({
          days,
          totalCalories: days.reduce((sum, d) => sum + d.calories, 0),
          avgProtein: days.reduce((sum, d) => sum + d.protein, 0) / days.length,
          consistencyStreak: streak,
          bestDay,
        })
      } catch (error) {
        console.error("Error fetching weekly data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchWeeklyData()
  }, [userId, supabase])

  if (loading) {
    return <div className="text-center text-foreground/70">Loading your progress...</div>
  }

  if (!weeklyData) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-foreground/70">No data available yet. Start logging meals!</p>
        </CardContent>
      </Card>
    )
  }

  // Chart data
  const calorieChartData = weeklyData.days.map((d) => ({
    date: new Date(d.date).toLocaleDateString("en-US", { weekday: "short" }),
    calories: Math.round(d.calories),
  }))

  const macroChartData = weeklyData.days.map((d) => ({
    date: new Date(d.date).toLocaleDateString("en-US", { weekday: "short" }),
    protein: Math.round(d.protein),
    carbs: Math.round(d.carbs),
    fat: Math.round(d.fat),
  }))

  const consistencyData = [
    { name: "Logged Days", value: weeklyData.days.filter((d) => d.consistency).length },
    { name: "No Logs", value: 7 - weeklyData.days.filter((d) => d.consistency).length },
  ]

  const COLORS = ["#10B981", "#E5E7EB"]

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-foreground">Weekly Progress</h1>

      {/* Key Metrics */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card className="bg-accent/10 border-accent/30">
          <CardContent className="pt-6 text-center">
            <div className="text-3xl font-bold text-accent">{Math.round(weeklyData.totalCalories)}</div>
            <p className="text-sm text-foreground/70 mt-1">Total Calories</p>
          </CardContent>
        </Card>

        <Card className="bg-accent/10 border-accent/30">
          <CardContent className="pt-6 text-center">
            <div className="text-3xl font-bold text-accent">{Math.round(weeklyData.avgProtein)}</div>
            <p className="text-sm text-foreground/70 mt-1">Avg Protein (g)</p>
          </CardContent>
        </Card>

        <Card className="bg-accent/10 border-accent/30">
          <CardContent className="pt-6 text-center">
            <div className="text-3xl font-bold text-accent">{weeklyData.consistencyStreak}</div>
            <p className="text-sm text-foreground/70 mt-1">Day Streak</p>
          </CardContent>
        </Card>

        <Card className="bg-accent/10 border-accent/30">
          <CardContent className="pt-6 text-center">
            <div className="text-3xl font-bold text-accent">{weeklyData.days.filter((d) => d.consistency).length}</div>
            <p className="text-sm text-foreground/70 mt-1">Days Tracked</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Calorie Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Daily Calorie Intake</CardTitle>
            <CardDescription>7-day calorie trend</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={calorieChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="date" stroke="var(--color-foreground)" />
                <YAxis stroke="var(--color-foreground)" />
                <Tooltip />
                <Line type="monotone" dataKey="calories" stroke="#10B981" strokeWidth={2} dot={{ fill: "#10B981" }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Macro Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Weekly Macronutrients</CardTitle>
            <CardDescription>Protein, carbs, and fat breakdown</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={macroChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="date" stroke="var(--color-foreground)" />
                <YAxis stroke="var(--color-foreground)" />
                <Tooltip />
                <Legend />
                <Bar dataKey="protein" fill="#10B981" />
                <Bar dataKey="carbs" fill="#F97316" />
                <Bar dataKey="fat" fill="#6366F1" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Logging Consistency */}
        <Card>
          <CardHeader>
            <CardTitle>Logging Consistency</CardTitle>
            <CardDescription>Days tracked vs missed</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={consistencyData} cx="50%" cy="50%" innerRadius={80} outerRadius={120} dataKey="value">
                  {consistencyData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Daily Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Daily Meal Count</CardTitle>
            <CardDescription>Number of meals logged per day</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={weeklyData.days.map((d) => ({
                  date: new Date(d.date).toLocaleDateString("en-US", { weekday: "short" }),
                  meals: d.mealCount,
                }))}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="date" stroke="var(--color-foreground)" />
                <YAxis stroke="var(--color-foreground)" />
                <Tooltip />
                <Bar dataKey="meals" fill="#10B981" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Achievements */}
      <Card>
        <CardHeader>
          <CardTitle>This Week's Achievements</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="p-4 bg-background rounded-lg border border-accent/30">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🔥</span>
              <div>
                <p className="font-semibold text-foreground">{weeklyData.consistencyStreak} Day Streak!</p>
                <p className="text-sm text-foreground/70">Keep logging consistently</p>
              </div>
            </div>
          </div>

          <div className="p-4 bg-background rounded-lg border border-accent/30">
            <div className="flex items-center gap-3">
              <span className="text-2xl">📊</span>
              <div>
                <p className="font-semibold text-foreground">
                  Logged {weeklyData.days.filter((d) => d.consistency).length} days this week
                </p>
                <p className="text-sm text-foreground/70">Great tracking discipline!</p>
              </div>
            </div>
          </div>

          {weeklyData.consistencyStreak >= 3 && (
            <div className="p-4 bg-background rounded-lg border border-accent/30">
              <div className="flex items-center gap-3">
                <span className="text-2xl">🏆</span>
                <div>
                  <p className="font-semibold text-foreground">Consistency Champion</p>
                  <p className="text-sm text-foreground/70">
                    Maintain {weeklyData.consistencyStreak}+ day streak for bonus rewards
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
