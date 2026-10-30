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
          full_name: string
          avatar_path: string | null
          nim: string | null
          program_studi: string | null
          semester: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          full_name?: string
          avatar_path?: string | null
          nim?: string | null
          program_studi?: string | null
          semester?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          full_name?: string
          avatar_path?: string | null
          nim?: string | null
          program_studi?: string | null
          semester?: number
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      courses: {
        Row: {
          id: string
          user_id: string
          name: string
          code: string
          lecturer: string | null
          color: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id?: string
          name: string
          code: string
          lecturer?: string | null
          color?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          code?: string
          lecturer?: string | null
          color?: string | null
          created_at?: string
        }
        Relationships: []
      }
      files: {
        Row: {
          id: string
          user_id: string
          course_id: string | null
          name: string
          storage_path: string
          mime_type: string
          size_bytes: number
          kind: 'image' | 'document' | 'summary' | 'formula'
          created_at: string
        }
        Insert: {
          id?: string
          user_id?: string
          course_id?: string | null
          name: string
          storage_path: string
          mime_type: string
          size_bytes?: number
          kind?: 'image' | 'document' | 'summary' | 'formula'
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          course_id?: string | null
          name?: string
          storage_path?: string
          mime_type?: string
          size_bytes?: number
          kind?: 'image' | 'document' | 'summary' | 'formula'
          created_at?: string
        }
        Relationships: []
      }
      schedules: {
        Row: {
          id: string
          user_id: string
          course_id: string
          day_of_week: string
          start_time: string
          end_time: string
          room: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id?: string
          course_id: string
          day_of_week: string
          start_time: string
          end_time: string
          room: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          course_id?: string
          day_of_week?: string
          start_time?: string
          end_time?: string
          room?: string
          created_at?: string
        }
        Relationships: []
      }
      tasks: {
        Row: {
          id: string
          user_id: string
          course_id: string | null
          title: string
          description: string | null
          due_at: string
          priority: 'low' | 'medium' | 'high' | 'urgent'
          is_done: boolean
          created_at: string
        }
        Insert: {
          id?: string
          user_id?: string
          course_id?: string | null
          title: string
          description?: string | null
          due_at?: string
          priority?: 'low' | 'medium' | 'high' | 'urgent'
          is_done?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          course_id?: string | null
          title?: string
          description?: string | null
          due_at?: string
          priority?: 'low' | 'medium' | 'high' | 'urgent'
          is_done?: boolean
          created_at?: string
        }
        Relationships: []
      }
      exams: {
        Row: {
          id: string
          user_id: string
          course_id: string | null
          title: string
          scheduled_at: string
          room: string | null
          countdown_label: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id?: string
          course_id?: string | null
          title: string
          scheduled_at: string
          room?: string | null
          countdown_label?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          course_id?: string | null
          title?: string
          scheduled_at?: string
          room?: string | null
          countdown_label?: string | null
          created_at?: string
        }
        Relationships: []
      }
      chat_sessions: {
        Row: {
          id: string
          user_id: string
          title: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id?: string
          title?: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          created_at?: string
        }
        Relationships: []
      }
      chat_messages: {
        Row: {
          id: string
          session_id: string
          user_id: string
          role: 'user' | 'assistant'
          content: string
          attachment_file_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          session_id: string
          user_id?: string
          role: 'user' | 'assistant'
          content: string
          attachment_file_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          session_id?: string
          user_id?: string
          role?: 'user' | 'assistant'
          content?: string
          attachment_file_id?: string | null
          created_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
