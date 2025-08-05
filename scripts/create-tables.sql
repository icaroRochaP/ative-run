-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  age INTEGER,
  gender VARCHAR(50),
  weight VARCHAR(50),
  height VARCHAR(50),
  primary_goal VARCHAR(100),
  subscription_status VARCHAR(50) DEFAULT 'trial',
  next_renewal DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create weight_updates table
CREATE TABLE IF NOT EXISTS weight_updates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  weight DECIMAL(5,2) NOT NULL,
  date DATE DEFAULT CURRENT_DATE,
  change DECIMAL(4,2),
  has_photo BOOLEAN DEFAULT FALSE,
  photo_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create workouts table
CREATE TABLE IF NOT EXISTS workouts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  emoji VARCHAR(10),
  exercises INTEGER DEFAULT 0,
  total_sets INTEGER DEFAULT 0,
  duration INTEGER, -- in minutes
  completed BOOLEAN DEFAULT FALSE,
  workout_date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create exercises table
CREATE TABLE IF NOT EXISTS exercises (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  workout_id UUID REFERENCES workouts(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  sets INTEGER DEFAULT 0,
  reps VARCHAR(50),
  weight VARCHAR(50),
  completed BOOLEAN DEFAULT FALSE,
  video_id VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create meal_plans table
CREATE TABLE IF NOT EXISTS meal_plans (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  day_of_week VARCHAR(20) NOT NULL,
  meal_type VARCHAR(50) NOT NULL, -- breakfast, lunch, dinner
  calories INTEGER NOT NULL,
  protein VARCHAR(20),
  carbs VARCHAR(20),
  fat VARCHAR(20),
  foods TEXT[], -- array of food items
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create progress_photos table
CREATE TABLE IF NOT EXISTS progress_photos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  photo_url TEXT NOT NULL,
  weight DECIMAL(5,2),
  date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_weight_updates_user_id ON weight_updates(user_id);
CREATE INDEX IF NOT EXISTS idx_weight_updates_date ON weight_updates(date DESC);
CREATE INDEX IF NOT EXISTS idx_workouts_user_id ON workouts(user_id);
CREATE INDEX IF NOT EXISTS idx_workouts_date ON workouts(workout_date DESC);
CREATE INDEX IF NOT EXISTS idx_exercises_workout_id ON exercises(workout_id);
CREATE INDEX IF NOT EXISTS idx_meal_plans_user_id ON meal_plans(user_id);
CREATE INDEX IF NOT EXISTS idx_progress_photos_user_id ON progress_photos(user_id);
CREATE INDEX IF NOT EXISTS idx_progress_photos_date ON progress_photos(date DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE weight_updates ENABLE ROW LEVEL SECURITY;
ALTER TABLE workouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE meal_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE progress_photos ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view own profile" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can view own weight updates" ON weight_updates FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own weight updates" ON weight_updates FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own weight updates" ON weight_updates FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own weight updates" ON weight_updates FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own workouts" ON workouts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own workouts" ON workouts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own workouts" ON workouts FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own workouts" ON workouts FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own exercises" ON exercises FOR SELECT USING (auth.uid() = (SELECT user_id FROM workouts WHERE id = workout_id));
CREATE POLICY "Users can insert own exercises" ON exercises FOR INSERT WITH CHECK (auth.uid() = (SELECT user_id FROM workouts WHERE id = workout_id));
CREATE POLICY "Users can update own exercises" ON exercises FOR UPDATE USING (auth.uid() = (SELECT user_id FROM workouts WHERE id = workout_id));
CREATE POLICY "Users can delete own exercises" ON exercises FOR DELETE USING (auth.uid() = (SELECT user_id FROM workouts WHERE id = workout_id));

CREATE POLICY "Users can view own meal plans" ON meal_plans FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own meal plans" ON meal_plans FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own meal plans" ON meal_plans FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own meal plans" ON meal_plans FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own progress photos" ON progress_photos FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own progress photos" ON progress_photos FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own progress photos" ON progress_photos FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own progress photos" ON progress_photos FOR DELETE USING (auth.uid() = user_id);
