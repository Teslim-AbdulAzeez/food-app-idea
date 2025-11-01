-- Create profiles table with user preferences
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  fitness_goal TEXT NOT NULL CHECK (fitness_goal IN ('muscle-gain', 'weight-loss', 'maintenance')),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create Nigerian foods database
CREATE TABLE IF NOT EXISTS nigerian_foods (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  calories_per_serving FLOAT NOT NULL,
  protein_g FLOAT NOT NULL,
  carbs_g FLOAT NOT NULL,
  fat_g FLOAT NOT NULL,
  serving_size TEXT NOT NULL,
  local_measurement TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create meals log table
CREATE TABLE IF NOT EXISTS meal_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  food_id UUID NOT NULL REFERENCES nigerian_foods(id) ON DELETE CASCADE,
  portions_consumed FLOAT NOT NULL,
  meal_type TEXT NOT NULL CHECK (meal_type IN ('breakfast', 'lunch', 'dinner', 'snack')),
  logged_at TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create daily goals table
CREATE TABLE IF NOT EXISTS daily_goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  target_calories INT NOT NULL,
  target_protein_g FLOAT NOT NULL,
  target_carbs_g FLOAT NOT NULL,
  target_fat_g FLOAT NOT NULL,
  UNIQUE(user_id, date),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create community tips table
CREATE TABLE IF NOT EXISTS community_tips (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  tip_type TEXT NOT NULL CHECK (tip_type IN ('nutrition', 'fitness', 'motivation')),
  likes INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE nigerian_foods ENABLE ROW LEVEL SECURITY;
ALTER TABLE meal_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_tips ENABLE ROW LEVEL SECURITY;

-- Profiles RLS Policies
CREATE POLICY "Users can view their own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert their profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Nigerian foods is public readable
CREATE POLICY "Foods are readable by all authenticated users" ON nigerian_foods
  FOR SELECT USING (true);

-- Meal logs RLS
CREATE POLICY "Users can view their meal logs" ON meal_logs
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert meal logs" ON meal_logs
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their meal logs" ON meal_logs
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their meal logs" ON meal_logs
  FOR DELETE USING (auth.uid() = user_id);

-- Daily goals RLS
CREATE POLICY "Users can view their goals" ON daily_goals
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert goals" ON daily_goals
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their goals" ON daily_goals
  FOR UPDATE USING (auth.uid() = user_id);

-- Community tips RLS
CREATE POLICY "Community tips are readable by all" ON community_tips
  FOR SELECT USING (true);
CREATE POLICY "Users can insert their tips" ON community_tips
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their tips" ON community_tips
  FOR UPDATE USING (auth.uid() = user_id);
