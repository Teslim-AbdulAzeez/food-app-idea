"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Bell, Clock, Droplets, Zap } from "lucide-react"

interface Reminder {
  id: string
  reminder_type: string
  time: string
  enabled: boolean
}

const REMINDER_TEMPLATES = [
  { type: "meal-time", label: "Meal Time Reminder", icon: Clock, description: "Reminder to log your meals" },
  { type: "hydration", label: "Hydration Reminder", icon: Droplets, description: "Reminder to drink water" },
  { type: "workout", label: "Workout Reminder", icon: Zap, description: "Reminder for your workout" },
]

export function RemindersSection({ userId }: { userId: string }) {
  const [reminders, setReminders] = useState<Reminder[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    fetchReminders()
  }, [])

  const fetchReminders = async () => {
    try {
      const { data } = await supabase
        .from("reminders")
        .select("*")
        .eq("user_id", userId)
        .order("time", { ascending: true })
      setReminders(data || [])
    } catch (error) {
      console.error("Error fetching reminders:", error)
    } finally {
      setLoading(false)
    }
  }

  const addReminder = async (type: string) => {
    try {
      const { error } = await supabase.from("reminders").insert({
        user_id: userId,
        reminder_type: type,
        time: "09:00",
        enabled: true,
      })

      if (!error) {
        fetchReminders()
      }
    } catch (error) {
      console.error("Error adding reminder:", error)
    }
  }

  const updateReminder = async (id: string, time: string) => {
    try {
      await supabase.from("reminders").update({ time }).eq("id", id)
      fetchReminders()
    } catch (error) {
      console.error("Error updating reminder:", error)
    }
  }

  const toggleReminder = async (id: string, enabled: boolean) => {
    try {
      await supabase.from("reminders").update({ enabled: !enabled }).eq("id", id)
      fetchReminders()
    } catch (error) {
      console.error("Error toggling reminder:", error)
    }
  }

  const deleteReminder = async (id: string) => {
    try {
      await supabase.from("reminders").delete().eq("id", id)
      fetchReminders()
    } catch (error) {
      console.error("Error deleting reminder:", error)
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-foreground">Goal-Based Reminders</h1>

      {/* Quick Add Reminders */}
      <div className="grid md:grid-cols-3 gap-4">
        {REMINDER_TEMPLATES.map((template) => {
          const Icon = template.icon
          const exists = reminders.some((r) => r.reminder_type === template.type)

          return (
            <Card key={template.type} className={exists ? "border-accent/30 bg-accent/5" : ""}>
              <CardContent className="pt-6 text-center">
                <Icon className="w-8 h-8 mx-auto mb-3 text-accent" />
                <h3 className="font-semibold text-foreground mb-2">{template.label}</h3>
                <p className="text-xs text-foreground/70 mb-4">{template.description}</p>
                <Button
                  onClick={() => addReminder(template.type)}
                  disabled={exists}
                  size="sm"
                  className="w-full"
                  variant={exists ? "outline" : "default"}
                >
                  {exists ? "Added" : "Add Reminder"}
                </Button>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Active Reminders */}
      <Card>
        <CardHeader>
          <CardTitle>Your Reminders</CardTitle>
          <CardDescription>{reminders.length} reminders set</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-foreground/70">Loading reminders...</p>
          ) : reminders.length === 0 ? (
            <p className="text-foreground/70">No reminders set yet. Add one above!</p>
          ) : (
            <div className="space-y-4">
              {reminders.map((reminder) => {
                const template = REMINDER_TEMPLATES.find((t) => t.type === reminder.reminder_type)
                const Icon = template?.icon

                return (
                  <div
                    key={reminder.id}
                    className="p-4 border border-border rounded-lg flex items-center justify-between"
                  >
                    <div className="flex items-center gap-4">
                      {Icon && <Icon className="w-6 h-6 text-accent" />}
                      <div>
                        <p className="font-semibold text-foreground capitalize">
                          {reminder.reminder_type.replace("-", " ")}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <Clock size={14} className="text-foreground/60" />
                          <input
                            type="time"
                            value={reminder.time}
                            onChange={(e) => updateReminder(reminder.id, e.target.value)}
                            className="text-sm px-2 py-1 border border-border rounded bg-background text-foreground"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleReminder(reminder.id, reminder.enabled)}
                        className={`px-3 py-1 rounded text-sm font-medium transition ${
                          reminder.enabled
                            ? "bg-accent text-accent-foreground"
                            : "bg-background border border-border text-foreground/70"
                        }`}
                      >
                        {reminder.enabled ? "On" : "Off"}
                      </button>
                      <Button
                        onClick={() => deleteReminder(reminder.id)}
                        variant="outline"
                        size="sm"
                        className="text-red-500 hover:text-red-600"
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Reminder Benefits */}
      <Card className="bg-primary/5 border-primary/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-accent" />
            Why Set Reminders?
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <p className="font-semibold text-foreground">Stay Consistent</p>
            <p className="text-sm text-foreground/70">Reminders help you maintain your meal logging routine</p>
          </div>
          <div>
            <p className="font-semibold text-foreground">Reach Goals Faster</p>
            <p className="text-sm text-foreground/70">Regular hydration and meals fuel your workouts</p>
          </div>
          <div>
            <p className="font-semibold text-foreground">Build Habits</p>
            <p className="text-sm text-foreground/70">Consistent reminders help form lasting fitness habits</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
