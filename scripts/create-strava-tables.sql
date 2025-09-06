-- Tabela para armazenar tokens do Strava
CREATE TABLE IF NOT EXISTS public.strava_tokens (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  access_token TEXT NOT NULL,
  refresh_token TEXT NOT NULL,
  expires_at INTEGER NOT NULL,
  token_type TEXT DEFAULT 'Bearer',
  
  -- Dados do atleta Strava
  strava_athlete_id BIGINT,
  athlete_username TEXT,
  athlete_firstname TEXT,
  athlete_lastname TEXT,
  athlete_profile TEXT,
  athlete_city TEXT,
  athlete_state TEXT,
  athlete_country TEXT,
  athlete_sex TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para otimização
CREATE INDEX IF NOT EXISTS idx_strava_tokens_athlete_id ON public.strava_tokens(strava_athlete_id);
CREATE INDEX IF NOT EXISTS idx_strava_tokens_expires_at ON public.strava_tokens(expires_at);

-- Tabela para armazenar atividades do Strava
CREATE TABLE IF NOT EXISTS public.strava_activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  strava_activity_id BIGINT UNIQUE NOT NULL,
  
  -- Dados básicos da atividade
  name TEXT,
  type TEXT, -- Run, Ride, Swim, etc.
  sport_type TEXT,
  distance REAL, -- em metros
  moving_time INTEGER, -- em segundos
  elapsed_time INTEGER, -- em segundos
  total_elevation_gain REAL, -- em metros
  
  -- Dados de performance
  average_speed REAL, -- m/s
  max_speed REAL, -- m/s
  average_heartrate REAL,
  max_heartrate REAL,
  average_cadence REAL,
  average_watts REAL,
  max_watts REAL,
  kilojoules REAL,
  
  -- Dados de localização
  start_latlng POINT,
  end_latlng POINT,
  location_city TEXT,
  location_state TEXT,
  location_country TEXT,
  
  -- Metadados
  start_date TIMESTAMPTZ,
  start_date_local TIMESTAMPTZ,
  achievement_count INTEGER DEFAULT 0,
  kudos_count INTEGER DEFAULT 0,
  comment_count INTEGER DEFAULT 0,
  athlete_count INTEGER DEFAULT 1,
  
  -- Dados brutos do Strava (JSON)
  raw_data JSONB,
  
  -- Status de processamento
  processed BOOLEAN DEFAULT FALSE,
  ai_analysis JSONB,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para otimização de consultas
CREATE INDEX IF NOT EXISTS idx_strava_activities_user_id ON public.strava_activities(user_id);
CREATE INDEX IF NOT EXISTS idx_strava_activities_strava_id ON public.strava_activities(strava_activity_id);
CREATE INDEX IF NOT EXISTS idx_strava_activities_start_date ON public.strava_activities(start_date);
CREATE INDEX IF NOT EXISTS idx_strava_activities_type ON public.strava_activities(type);
CREATE INDEX IF NOT EXISTS idx_strava_activities_processed ON public.strava_activities(processed);

-- Tabela para webhook subscriptions do Strava
CREATE TABLE IF NOT EXISTS public.strava_webhook_subscriptions (
  id SERIAL PRIMARY KEY,
  subscription_id INTEGER UNIQUE NOT NULL,
  callback_url TEXT NOT NULL,
  verify_token TEXT NOT NULL,
  hub_challenge TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  active BOOLEAN DEFAULT TRUE
);

-- Tabela para logs de eventos de webhook
CREATE TABLE IF NOT EXISTS public.strava_webhook_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subscription_id INTEGER,
  object_type TEXT, -- 'activity', 'athlete'
  object_id BIGINT,
  aspect_type TEXT, -- 'create', 'update', 'delete'
  owner_id BIGINT, -- Strava athlete ID
  event_time TIMESTAMPTZ,
  
  -- Dados brutos do evento
  raw_event JSONB,
  
  -- Status de processamento
  processed BOOLEAN DEFAULT FALSE,
  processed_at TIMESTAMPTZ,
  error_message TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para webhook events
CREATE INDEX IF NOT EXISTS idx_webhook_events_object ON public.strava_webhook_events(object_type, object_id);
CREATE INDEX IF NOT EXISTS idx_webhook_events_owner ON public.strava_webhook_events(owner_id);
CREATE INDEX IF NOT EXISTS idx_webhook_events_processed ON public.strava_webhook_events(processed);
CREATE INDEX IF NOT EXISTS idx_webhook_events_created ON public.strava_webhook_events(created_at);

-- Function para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para updated_at
CREATE TRIGGER update_strava_tokens_updated_at 
    BEFORE UPDATE ON public.strava_tokens 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_strava_activities_updated_at 
    BEFORE UPDATE ON public.strava_activities 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- RLS (Row Level Security) Policies
ALTER TABLE public.strava_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.strava_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.strava_webhook_events ENABLE ROW LEVEL SECURITY;

-- Policies para strava_tokens - usuários só podem ver seus próprios tokens
CREATE POLICY "Users can view own strava tokens" ON public.strava_tokens
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own strava tokens" ON public.strava_tokens
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own strava tokens" ON public.strava_tokens
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own strava tokens" ON public.strava_tokens
    FOR DELETE USING (auth.uid() = user_id);

-- Policies para strava_activities - usuários só podem ver suas próprias atividades
CREATE POLICY "Users can view own strava activities" ON public.strava_activities
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage all strava activities" ON public.strava_activities
    FOR ALL USING (auth.role() = 'service_role');

-- Policies para webhook events - apenas service role pode acessar
CREATE POLICY "Service role can manage webhook events" ON public.strava_webhook_events
    FOR ALL USING (auth.role() = 'service_role');

-- Comentários nas tabelas
COMMENT ON TABLE public.strava_tokens IS 'Armazena tokens OAuth do Strava para cada usuário';
COMMENT ON TABLE public.strava_activities IS 'Armazena atividades sincronizadas do Strava';
COMMENT ON TABLE public.strava_webhook_subscriptions IS 'Registra subscriptions de webhook do Strava';
COMMENT ON TABLE public.strava_webhook_events IS 'Log de eventos recebidos via webhook do Strava';