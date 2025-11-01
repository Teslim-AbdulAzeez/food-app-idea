import { generateObject } from "ai"
import { z } from "zod"

const mealSuggestionSchema = z.object({
  meals: z
    .array(
      z.object({
        name: z.string().describe("Name of the Nigerian meal"),
        reason: z.string().describe("Why this meal suits their goal"),
        estimatedCalories: z.number().describe("Estimated calories per serving"),
        macros: z.object({
          protein: z.number().describe("Protein in grams"),
          carbs: z.number().describe("Carbs in grams"),
          fat: z.number().describe("Fat in grams"),
        }),
        portionSize: z.string().describe("Recommended portion"),
        localMeasurement: z.string().describe("Local measurement (cup, handful, etc)"),
        prepTime: z.number().describe("Prep time in minutes"),
        tags: z.array(z.string()).describe("Tags like quick, high-protein, etc"),
      }),
    )
    .min(3)
    .max(5),
  hydrationTip: z.string().describe("Daily hydration recommendation"),
  mealTiming: z.string().describe("Best time to eat these meals"),
})

export async function POST(req: Request) {
  try {
    const { fitnessGoal, dailyCalories, currentWeightKg } = await req.json()

    const goalDescription =
      {
        "muscle-gain": "building muscle mass and strength",
        "weight-loss": "losing weight while maintaining muscle",
        maintenance: "maintaining current weight and fitness",
      }[fitnessGoal] || "optimal health"

    const prompt = `You are a Nigerian nutrition expert specializing in gym fitness. 
    
Suggest 4-5 authentic Nigerian meals for someone with these goals:
- Goal: ${goalDescription}
- Target Daily Calories: ${dailyCalories}
- Current Weight: ${currentWeightKg}kg

Focus on traditional Nigerian foods like jollof rice, egusi soup, fufu, goat meat, beans, etc. 
Each meal should be practical for meal prep and have clear portion sizes using LOCAL measurements (cups, handfuls, plates, etc).
Ensure meals complement each other throughout the day and support their fitness goal.`

    const { object } = await generateObject({
      model: "openai/gpt-5",
      schema: mealSuggestionSchema,
      prompt,
      maxOutputTokens: 2000,
    })

    return Response.json(object)
  } catch (error) {
    console.error("Meal suggestion error:", error)
    return Response.json({ error: "Failed to generate meal suggestions" }, { status: 500 })
  }
}
