export type UserRole = 
  | 'org_owner_admin'
  | 'provider'
  | 'nurse_ma'
  | 'front_desk'
  | 'billing_specialist'
  | 'pa_coordinator'
  | 'lab_results'
  | 'auditor_ro'

export type TaskStatus = 'todo' | 'in_progress' | 'waiting' | 'done'
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent'
export type TaskType = 'patient_care' | 'administrative' | 'follow_up' | 'documentation'

export interface Organization {
  id: string
  name: string
  description?: string
  address?: string
  phone?: string
  email?: string
  settings: Record<string, any>
  created_at: string
  updated_at: string
}

export interface Profile {
  id: string
  email: string
  phone?: string
  first_name?: string
  last_name?: string
  role: UserRole
  organization_id?: string
  avatar_url?: string
  preferences: Record<string, any>
  is_active: boolean
  last_login?: string
  created_at: string
  updated_at: string
}

export interface Location {
  id: string
  organization_id: string
  name: string
  description?: string
  floor?: string
  room_number?: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Task {
  id: string
  title: string
  description?: string
  status: TaskStatus
  priority: TaskPriority
  type: TaskType
  assigned_to?: string
  created_by?: string
  organization_id: string
  location_id?: string
  patient_initials?: string
  patient_dob?: string
  mrn?: string
  due_date?: string
  completed_at?: string
  estimated_duration?: number
  tags?: string[]
  custom_fields: Record<string, any>
  waiting_reason?: string
  waiting_notes?: string
  created_at: string
  updated_at: string
}

export interface Channel {
  id: string
  organization_id: string
  name: string
  description?: string
  is_private: boolean
  created_by?: string
  created_at: string
  updated_at: string
}

export interface Message {
  id: string
  channel_id: string
  user_id: string
  content: string
  message_type: string
  metadata: Record<string, any>
  reply_to?: string
  created_at: string
  updated_at: string
}

export interface ChannelMember {
  channel_id: string
  user_id: string
  joined_at: string
}

// Database response types
export interface Database {
  public: {
    Tables: {
      organizations: {
        Row: Organization
        Insert: Omit<Organization, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Organization, 'id' | 'created_at' | 'updated_at'>>
      }
      profiles: {
        Row: Profile
        Insert: Omit<Profile, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Profile, 'id' | 'created_at' | 'updated_at'>>
      }
      locations: {
        Row: Location
        Insert: Omit<Location, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Location, 'id' | 'created_at' | 'updated_at'>>
      }
      tasks: {
        Row: Task
        Insert: Omit<Task, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Task, 'id' | 'created_at' | 'updated_at'>>
      }
      channels: {
        Row: Channel
        Insert: Omit<Channel, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Channel, 'id' | 'created_at' | 'updated_at'>>
      }
      messages: {
        Row: Message
        Insert: Omit<Message, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Message, 'id' | 'created_at' | 'updated_at'>>
      }
      channel_members: {
        Row: ChannelMember
        Insert: ChannelMember
        Update: Partial<ChannelMember>
      }
    }
  }
}
