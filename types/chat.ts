export type MessageRole = 'user' | 'assistant'

export interface Message {
  id: string
  role: MessageRole
  content: string
  timestamp: Date
}

export interface ChatMetadata {
  message_count: number
  last_message_at: Date
}

export interface ChatData {
  messages: Message[]
  metadata: ChatMetadata
}

export interface Chat {
  id: string
  userId: string
  title: string
  chatData: ChatData
  createdAt: string
  updatedAt: string
} 