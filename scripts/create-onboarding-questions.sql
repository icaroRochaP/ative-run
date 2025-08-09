-- Create onboarding_questions table
CREATE TABLE IF NOT EXISTS onboarding_questions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  step_number INTEGER NOT NULL UNIQUE,
  question_type VARCHAR(50) NOT NULL, -- 'text', 'number', 'email', 'radio', 'checkbox', 'textarea'
  title VARCHAR(255) NOT NULL,
  subtitle VARCHAR(500),
  emoji VARCHAR(10),
  icon VARCHAR(50), -- lucide icon name
  field_name VARCHAR(100) NOT NULL,
  placeholder VARCHAR(255),
  required BOOLEAN DEFAULT TRUE,
  options JSONB, -- for radio/checkbox options
  validation JSONB, -- validation rules
  conditional_logic JSONB, -- show/hide based on other answers
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create onboarding_responses table
CREATE TABLE IF NOT EXISTS onboarding_responses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  question_id UUID REFERENCES onboarding_questions(id) ON DELETE CASCADE,
  response_value TEXT,
  response_array TEXT[], -- for checkbox responses
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, question_id)
);

-- Insert onboarding questions
INSERT INTO onboarding_questions (
  step_number, question_type, title, subtitle, emoji, icon, field_name, placeholder, required, options, validation
) VALUES
  (0, 'text', 'Nice to meet you!', 'How would you like to be addressed?', NULL, 'User', 'name', 'Enter your name...', TRUE, NULL, '{"minLength": 2}'),
  (1, 'number', 'How old are you?', NULL, NULL, 'User', 'age', 'Enter your age...', TRUE, NULL, '{"min": 10, "max": 120}'),
  (2, 'email', 'What is your email?', NULL, NULL, 'Mail', 'email', 'Enter your email...', TRUE, NULL, '{"pattern": "^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$"}'),
  (3, 'radio', 'What is your gender?', NULL, NULL, 'User', 'gender', NULL, TRUE, '["male","female","other"]', NULL),
  (4, 'number', 'What is your weight?', 'In kg', NULL, 'Dumbbell', 'weight', 'Enter your weight...', TRUE, NULL, '{"min": 30, "max": 300}'),
  (5, 'number', 'What is your height?', 'In cm', NULL, 'User', 'height', 'Enter your height...', TRUE, NULL, '{"min": 100, "max": 250}'),
  (6, 'radio', 'What is your primary goal?', NULL, NULL, 'Target', 'primaryGoal', NULL, TRUE, '["lose weight","gain muscle","improve health","other"]', NULL),
  (7, 'checkbox', 'What equipment do you have?', 'Select all that apply', NULL, 'Dumbbell', 'equipment', NULL, TRUE, '["Full gym", "Basic home equipment (dumbbells, bands, mat)", "Only bodyweight", "Other (specify)"]', NULL),
  (8, 'checkbox', 'Where do you tend to accumulate fat?', 'This helps us target specific areas', '🎯', NULL, 'fatAccumulation', NULL, FALSE, '["Belly", "Thighs", "Arms", "Back", "Hips", "Face/Neck", "Overall"]', NULL),
  (9, 'checkbox', 'Which areas would you like to focus on?', 'Select your priority areas for improvement', '💪', NULL, 'focusAreas', NULL, FALSE, '["Arms", "Abs", "Legs", "Glutes", "Back", "Chest", "Full body"]', NULL),
  (10, 'checkbox', 'What types of exercises do you prefer?', 'We''ll prioritize these in your plan', '🏃', NULL, 'exerciseTypes', NULL, FALSE, '["Strength training", "Cardio", "Yoga/Pilates", "HIIT", "Dance", "Swimming", "Outdoor activities"]', NULL),
  (11, 'radio', 'How would you describe your current activity level?', 'Be honest - this helps us create the right intensity', '⚡', NULL, 'currentActivity', NULL, TRUE, '["Sedentary (little to no exercise)", "Lightly active (light exercise 1-3 days/week)", "Moderately active (moderate exercise 3-5 days/week)", "Very active (hard exercise 6-7 days/week)", "Extremely active (very hard exercise, physical job)"]', NULL),
  (12, 'textarea', 'Do you have any genetic characteristics that affect your body?', 'For example: family history of obesity, diabetes, muscle building difficulties, etc.', '🧬', NULL, 'geneticCharacteristics', 'Describe any relevant family history or genetic factors...', FALSE, NULL, NULL),
  (13, 'checkbox', 'Do you have difficulty building muscle in any specific areas?', 'This helps us adjust your training approach', '💪', NULL, 'muscleDifficulties', NULL, FALSE, '["Arms", "Legs", "Chest", "Back", "Shoulders", "Core", "No specific difficulties"]', NULL),
  (14, 'checkbox', 'Do you have any posture issues?', 'We can include corrective exercises', '🧘', NULL, 'posture', NULL, FALSE, '["Forward head posture", "Rounded shoulders", "Anterior pelvic tilt", "Posterior pelvic tilt", "Scoliosis", "Lower back pain", "No issues"]', NULL),
  (15, 'radio', 'How many hours do you spend sitting per day?', 'This affects our exercise recommendations', '🪑', NULL, 'sittingTime', NULL, TRUE, '["Less than 2 hours", "2-4 hours", "4-6 hours", "6-8 hours", "More than 8 hours"]', NULL),
  (16, 'textarea', 'Do you have any health conditions or injuries?', 'Please list any conditions, medications, or physical limitations', '🏥', NULL, 'healthConditions', 'List any health conditions, injuries, or medications...', FALSE, NULL, NULL),
  (17, 'radio', 'Do you have a regular menstrual cycle?', 'This helps us adjust training intensity throughout the month', '🌸', NULL, 'menstrualCycle', NULL, FALSE, '["Yes, regular cycle", "Irregular cycle", "No cycle (menopause/other)", "Prefer not to answer", "Not applicable"]', '{"showIf": {"gender": "female"}}'),
  (18, 'text', 'What''s your ancestry/ethnicity?', 'Different ethnicities may have different nutritional needs', '🌍', NULL, 'ancestry', 'e.g., European, Asian, African, Latin American, Mixed...', FALSE, NULL, NULL),
  (19, 'radio', 'Personalized nutrition?', 'Would you like personalized dietary recommendations?', NULL, 'Apple', 'wantNutrition', NULL, TRUE, '["Yes", "No"]', NULL),
  (20, 'text', 'Where are you located?', 'This helps us suggest local food options and seasonal recommendations', '📍', NULL, 'location', 'City, Country', FALSE, NULL, NULL),
  (21, 'textarea', 'Do you take any supplements?', 'List any vitamins, proteins, or other supplements you currently use', '💊', NULL, 'supplements', 'List your current supplements...', FALSE, NULL, '{"showIf": {"wantNutrition": "yes"}}'),
  (22, 'radio', 'Are you interested in detox juices or cleanses?', 'We can include healthy detox options in your plan', '🥤', NULL, 'detoxJuices', NULL, FALSE, '["Yes, very interested", "Somewhat interested", "Not interested"]', '{"showIf": {"wantNutrition": "yes"}}'),
  (23, 'textarea', 'Do you have any dietary restrictions or allergies?', 'We''ll make sure to avoid these in your meal plans', '🚫', NULL, 'dietaryRestrictions', 'List any allergies, intolerances, or dietary restrictions...', FALSE, NULL, '{"showIf": {"wantNutrition": "yes"}}'),
  (24, 'textarea', 'What are your food preferences?', 'Tell us about foods you love, hate, or cultural preferences', '🍽️', NULL, 'foodPreferences', 'Describe your food preferences, favorite cuisines, foods to avoid...', FALSE, NULL, '{"showIf": {"wantNutrition": "yes"}}'),
  (25, 'radio', 'How active are you throughout the day?', 'This affects your caloric needs', '🚶', NULL, 'activityLevel', NULL, TRUE, '["Mostly sitting", "Some walking", "Moderately active", "Very active job"]', '{"showIf": {"wantNutrition": "yes"}}'),
  (26, 'radio', 'Do you currently follow any training program?', 'We''ll build upon what you''re already doing', '🏋️', NULL, 'currentTraining', NULL, TRUE, '["No training program", "Basic home workouts", "Gym routine", "Personal trainer", "Group classes", "Sports training"]', NULL),
  (27, 'radio', 'How many days per week can you commit to training?', 'Be realistic about your schedule', '📅', NULL, 'trainingFrequency', NULL, TRUE, '["1-2 days", "3-4 days", "5-6 days", "Every day"]', NULL),
  (28, 'radio', 'How much time can you dedicate per workout session?', 'We''ll design workouts that fit your schedule', '⏰', NULL, 'trainingDuration', NULL, TRUE, '["15-30 minutes", "30-45 minutes", "45-60 minutes", "60+ minutes"]', NULL),
  (29, 'textarea', 'Progress photos', 'Upload 4 photos: front, back, and sides (Optional)', NULL, 'Camera', 'photos', 'Describe what you''d like us to focus on...', FALSE, NULL, NULL),
  (30, 'textarea', 'Your vision', 'How would you like to see your body? Feel free to express yourself!', '✨', NULL, 'bodyVision', 'Let''s work on this together! Describe how you envision your transformation...', FALSE, NULL, NULL);

-- Enable RLS for onboarding tables
ALTER TABLE onboarding_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE onboarding_responses ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for onboarding_questions (public read)
CREATE POLICY "Anyone can view onboarding questions" ON onboarding_questions FOR SELECT USING (is_active = true);

-- Create RLS policies for onboarding_responses
CREATE POLICY "Users can view own responses" ON onboarding_responses FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own responses" ON onboarding_responses FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own responses" ON onboarding_responses FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own responses" ON onboarding_responses FOR DELETE USING (auth.uid() = user_id);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_onboarding_questions_step ON onboarding_questions(step_number);
CREATE INDEX IF NOT EXISTS idx_onboarding_questions_active ON onboarding_questions(is_active);
CREATE INDEX IF NOT EXISTS idx_onboarding_responses_user ON onboarding_responses(user_id);
CREATE INDEX IF NOT EXISTS idx_onboarding_responses_question ON onboarding_responses(question_id);
