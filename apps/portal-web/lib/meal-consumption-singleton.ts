'use client'

import { getSupabaseClient } from '@/lib/supabase'

interface MealConsumptionState {
  consumedMeals: Set<string>
  loading: boolean
  error: string | null
}

class MealConsumptionSingleton {
  private static instance: MealConsumptionSingleton
  private subscribers: Set<(state: MealConsumptionState) => void> = new Set()
  private state: MealConsumptionState = {
    consumedMeals: new Set(),
    loading: false,
    error: null
  }
  private supabase = getSupabaseClient()
  private channel: any = null
  private currentUserId: string | null = null
  private currentDate: string | null = null
  private loadingPromise: Promise<void> | null = null

  private constructor() {}

  static getInstance(): MealConsumptionSingleton {
    if (!MealConsumptionSingleton.instance) {
      MealConsumptionSingleton.instance = new MealConsumptionSingleton()
    }
    return MealConsumptionSingleton.instance
  }

  subscribe(callback: (state: MealConsumptionState) => void): () => void {
    this.subscribers.add(callback)
    // Immediately send current state to new subscriber
    callback(this.state)

    return () => {
      this.subscribers.delete(callback)
    }
  }

  private notify(): void {
    this.subscribers.forEach(callback => callback(this.state))
  }

  private setState(newState: Partial<MealConsumptionState>): void {
    this.state = { ...this.state, ...newState }
    this.notify()
  }

  async initializeForUser(userId: string, date: string): Promise<void> {
    const cacheKey = `${userId}_${date}`
    
    // If we're already loading for this user and date, wait for it
    if (this.currentUserId === userId && this.currentDate === date) {
      if (this.loadingPromise) {
        await this.loadingPromise
      }
      return
    }

    // Clean up previous subscription if user/date changed
    if (this.currentUserId !== userId || this.currentDate !== date) {
      this.cleanup()
      this.currentUserId = userId
      this.currentDate = date
    }

    // Avoid duplicate loading
    if (this.loadingPromise) {
      await this.loadingPromise
      return
    }

    console.log(`🔄 MealConsumptionSingleton: Initializing for user ${userId} on date ${date}`)

    this.loadingPromise = this.loadData(userId, date)
    await this.loadingPromise
    this.loadingPromise = null
  }

  private async loadData(userId: string, date: string): Promise<void> {
    try {
      this.setState({ loading: true, error: null })

      // Load initial data
      const { data, error } = await this.supabase
        .from('meal_consumption_logs')
        .select('recipe_id')
        .eq('user_id', userId)
        .eq('consumed_at', date)

      if (error) {
        console.error('❌ MealConsumptionSingleton: Error loading data:', error)
        this.setState({ error: error.message, loading: false })
        return
      }

      const consumedMeals = new Set(data?.map((log: any) => log.recipe_id as string) || [])
      console.log(`✅ MealConsumptionSingleton: Loaded ${consumedMeals.size} consumed meals`)
      
      this.setState({ 
        consumedMeals, 
        loading: false,
        error: null 
      })

      // Setup real-time subscription
      this.setupRealtimeSubscription(userId)

    } catch (error) {
      console.error('❌ MealConsumptionSingleton: Unexpected error:', error)
      this.setState({ 
        error: error instanceof Error ? error.message : 'Unknown error',
        loading: false 
      })
    }
  }

  private setupRealtimeSubscription(userId: string): void {
    if (this.channel) {
      console.log('🧹 MealConsumptionSingleton: Cleaning up existing channel')
      this.supabase.removeChannel(this.channel)
    }

    const channelName = `meal_consumption_${userId}`
    console.log(`🔗 MealConsumptionSingleton: Setting up real-time subscription: ${channelName}`)

    this.channel = this.supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'meal_consumption_logs',
          filter: `user_id=eq.${userId}`
        },
        (payload: any) => {
          console.log('📡 MealConsumptionSingleton: Real-time event received:', payload)
          this.handleRealtimeEvent(payload)
        }
      )
      .subscribe((status: any) => {
        console.log(`📡 MealConsumptionSingleton: Subscription status: ${status}`)
      })
  }

  private handleRealtimeEvent(payload: any): void {
    const { eventType, new: newRecord, old: oldRecord } = payload

    switch (eventType) {
      case 'INSERT':
        if (newRecord?.recipe_id && newRecord?.consumed_at === this.currentDate) {
          console.log(`➕ MealConsumptionSingleton: Adding consumed meal: ${newRecord.recipe_id}`)
          const newConsumedMeals = new Set(this.state.consumedMeals)
          newConsumedMeals.add(newRecord.recipe_id)
          this.setState({ consumedMeals: newConsumedMeals })
        }
        break

      case 'DELETE':
        if (oldRecord?.recipe_id && oldRecord?.consumed_at === this.currentDate) {
          console.log(`➖ MealConsumptionSingleton: Removing consumed meal: ${oldRecord.recipe_id}`)
          const newConsumedMeals = new Set(this.state.consumedMeals)
          newConsumedMeals.delete(oldRecord.recipe_id)
          this.setState({ consumedMeals: newConsumedMeals })
        }
        break

      case 'UPDATE':
        // Handle updates if needed
        console.log('🔄 MealConsumptionSingleton: Update event received')
        break
    }
  }

  async consumeMeal(userId: string, mealId: string, date: string): Promise<void> {
    try {
      console.log(`🍽️ MealConsumptionSingleton: Consuming meal ${mealId}`)
      
      // Optimistic update
      const newConsumedMeals = new Set(this.state.consumedMeals)
      newConsumedMeals.add(mealId)
      this.setState({ consumedMeals: newConsumedMeals })

      const { error } = await this.supabase
        .from('meal_consumption_logs')
        .insert({
          user_id: userId,
          recipe_id: mealId,
          consumed_at: date
        })

      if (error) {
        console.error('❌ MealConsumptionSingleton: Error consuming meal:', error)
        // Revert optimistic update
        const revertedMeals = new Set(this.state.consumedMeals)
        revertedMeals.delete(mealId)
        this.setState({ consumedMeals: revertedMeals, error: error.message })
      }
    } catch (error) {
      console.error('❌ MealConsumptionSingleton: Unexpected error consuming meal:', error)
      // Revert optimistic update
      const revertedMeals = new Set(this.state.consumedMeals)
      revertedMeals.delete(mealId)
      this.setState({ 
        consumedMeals: revertedMeals, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      })
    }
  }

  async unConsumeMeal(userId: string, mealId: string, date: string): Promise<void> {
    try {
      console.log(`🚫 MealConsumptionSingleton: Unconsuming meal ${mealId}`)
      
      // Optimistic update
      const newConsumedMeals = new Set(this.state.consumedMeals)
      newConsumedMeals.delete(mealId)
      this.setState({ consumedMeals: newConsumedMeals })

      const { error } = await this.supabase
        .from('meal_consumption_logs')
        .delete()
        .eq('user_id', userId)
        .eq('recipe_id', mealId)
        .eq('consumed_at', date)

      if (error) {
        console.error('❌ MealConsumptionSingleton: Error unconsuming meal:', error)
        // Revert optimistic update
        const revertedMeals = new Set(this.state.consumedMeals)
        revertedMeals.add(mealId)
        this.setState({ consumedMeals: revertedMeals, error: error.message })
      }
    } catch (error) {
      console.error('❌ MealConsumptionSingleton: Unexpected error unconsuming meal:', error)
      // Revert optimistic update
      const revertedMeals = new Set(this.state.consumedMeals)
      revertedMeals.add(mealId)
      this.setState({ 
        consumedMeals: revertedMeals, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      })
    }
  }

  isMealConsumed(mealId: string): boolean {
    return this.state.consumedMeals.has(mealId)
  }

  getState(): MealConsumptionState {
    return this.state
  }

  cleanup(): void {
    if (this.channel) {
      console.log('🧹 MealConsumptionSingleton: Cleaning up channel')
      this.supabase.removeChannel(this.channel)
      this.channel = null
    }
    this.currentUserId = null
    this.currentDate = null
    this.loadingPromise = null
  }
}

export default MealConsumptionSingleton
