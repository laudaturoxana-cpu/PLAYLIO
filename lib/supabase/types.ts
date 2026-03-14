export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          username: string
          full_name: string | null
          role: 'child' | 'parent'
          parent_id: string | null
          coins: number
          level: number
          xp: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          username: string
          full_name?: string | null
          role?: 'child' | 'parent'
          parent_id?: string | null
          coins?: number
          level?: number
          xp?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          username?: string
          full_name?: string | null
          role?: 'child' | 'parent'
          parent_id?: string | null
          coins?: number
          level?: number
          xp?: number
          updated_at?: string
        }
      }
      avatars: {
        Row: {
          id: string
          user_id: string
          hair_color: string
          hair_style: string
          skin_tone: string
          eye_color: string
          outfit_style: string
          outfit_color: string
          accessories: Json
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          hair_color?: string
          hair_style?: string
          skin_tone?: string
          eye_color?: string
          outfit_style?: string
          outfit_color?: string
          accessories?: Json
          updated_at?: string
        }
        Update: {
          hair_color?: string
          hair_style?: string
          skin_tone?: string
          eye_color?: string
          outfit_style?: string
          outfit_color?: string
          accessories?: Json
          updated_at?: string
        }
      }
      progress: {
        Row: {
          id: string
          user_id: string
          world: string
          level: number
          xp: number
          quests_completed: number
          time_played_seconds: number
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          world: string
          level?: number
          xp?: number
          quests_completed?: number
          time_played_seconds?: number
          updated_at?: string
        }
        Update: {
          level?: number
          xp?: number
          quests_completed?: number
          time_played_seconds?: number
          updated_at?: string
        }
      }
      learning_progress: {
        Row: {
          id: string
          user_id: string
          game_type: string
          item_id: string
          attempts: number
          correct: number
          mastered: boolean
          last_seen: string
        }
        Insert: {
          id?: string
          user_id: string
          game_type: string
          item_id: string
          attempts?: number
          correct?: number
          mastered?: boolean
          last_seen?: string
        }
        Update: {
          attempts?: number
          correct?: number
          mastered?: boolean
          last_seen?: string
        }
      }
      quests: {
        Row: {
          id: string
          world: string
          zone: string | null
          title: string
          description: string | null
          difficulty: 'easy' | 'medium' | 'hard' | 'special'
          reward_coins: number
          reward_item: string | null
          is_daily: boolean
          order_index: number
          is_active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          world: string
          zone?: string | null
          title: string
          description?: string | null
          difficulty?: 'easy' | 'medium' | 'hard' | 'special'
          reward_coins?: number
          reward_item?: string | null
          is_daily?: boolean
          order_index?: number
          is_active?: boolean
          created_at?: string
        }
        Update: {
          title?: string
          description?: string | null
          difficulty?: 'easy' | 'medium' | 'hard' | 'special'
          reward_coins?: number
          reward_item?: string | null
          is_daily?: boolean
          order_index?: number
          is_active?: boolean
        }
      }
      quest_completions: {
        Row: {
          id: string
          user_id: string
          quest_id: string
          completed_at: string
        }
        Insert: {
          id?: string
          user_id: string
          quest_id: string
          completed_at?: string
        }
        Update: Record<string, never>
      }
      inventory: {
        Row: {
          id: string
          user_id: string
          item_id: string
          item_type: 'furniture' | 'decoration' | 'wallpaper' | 'avatar_item' | 'special'
          acquired_at: string
        }
        Insert: {
          id?: string
          user_id: string
          item_id: string
          item_type: 'furniture' | 'decoration' | 'wallpaper' | 'avatar_item' | 'special'
          acquired_at?: string
        }
        Update: Record<string, never>
      }
      builder_state: {
        Row: {
          id: string
          user_id: string
          room_data: Json
          unlocked_rooms: string[]
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          room_data?: Json
          unlocked_rooms?: string[]
          updated_at?: string
        }
        Update: {
          room_data?: Json
          unlocked_rooms?: string[]
          updated_at?: string
        }
      }
      coin_transactions: {
        Row: {
          id: string
          user_id: string
          amount: number
          reason: string
          world: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          amount: number
          reason: string
          world?: string | null
          created_at?: string
        }
        Update: Record<string, never>
      }
      daily_rewards: {
        Row: {
          id: string
          user_id: string
          reward_date: string
          day_streak: number
          coins_earned: number
        }
        Insert: {
          id?: string
          user_id: string
          reward_date?: string
          day_streak?: number
          coins_earned?: number
        }
        Update: {
          day_streak?: number
          coins_earned?: number
        }
      }
      jump_scores: {
        Row: {
          id: string
          user_id: string
          level_id: string
          score: number
          stars: number
          time_ms: number | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          level_id: string
          score: number
          stars?: number
          time_ms?: number | null
          created_at?: string
        }
        Update: {
          score?: number
          stars?: number
          time_ms?: number | null
        }
      }
    }
    Functions: {
      add_coins: {
        Args: {
          p_user_id: string
          p_amount: number
          p_reason: string
          p_world?: string | null
        }
        Returns: void
      }
      record_learning: {
        Args: {
          p_user_id: string
          p_game_type: string
          p_item_id: string
          p_correct: boolean
        }
        Returns: void
      }
    }
    Enums: Record<string, never>
  }
}
