-- Create reminders table
CREATE TABLE IF NOT EXISTS reminders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  reminder_type TEXT NOT NULL CHECK (reminder_type IN ('meal-time', 'hydration', 'workout')),
  time TEXT NOT NULL,
  enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Enable RLS on reminders
ALTER TABLE reminders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their reminders" ON reminders
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert reminders" ON reminders
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their reminders" ON reminders
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their reminders" ON reminders
  FOR DELETE USING (auth.uid() = user_id);
