/**
 * Type definitions matching backend models and API responses
 */

export interface User {
  id: string;
  username: string;
  email: string;
  is_staff: boolean;
  is_superuser: boolean;
}

export interface LetterType {
  id: string;
  name: string;
  slug: string;
  description: string;
  meta_schema: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface ContentBlock {
  id: string;
  block_type: 'text' | 'image' | 'rich_text';
  order: number;
  content: Record<string, any>;
  created_at: string;
}

export interface TextBlockContent {
  text: string;
}

export interface ImageBlockContent {
  url: string;
  caption?: string;
}

export interface RichTextBlockContent {
  html: string;
}

export interface Letter {
  id: string;
  title: string;
  description: string;
  recipient_name: string;
  slug: string;
  letter_type: LetterType;
  custom_properties: Record<string, any>;
  content_blocks: ContentBlock[];
  is_published: boolean;
  published_at: string | null;
  created_by?: User;
  created_at: string;
  updated_at: string;
  public_url?: string;
}

export interface LetterPublic {
  id: string;
  title: string;
  description: string;
  recipient_name: string;
  slug: string;
  letter_type: LetterType;
  custom_properties: Record<string, any>;
  content_blocks: ContentBlock[];
  created_at: string;
}

// API Request types
export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  message: string;
}

export interface CreateLetterRequest {
  title: string;
  description: string;
  recipient_name: string;
  letter_type_id: string;
  custom_properties?: Record<string, any>;
  content_blocks?: Array<{
    block_type: 'text' | 'image' | 'rich_text';
    order: number;
    content: Record<string, any>;
  }>;
}

export interface UpdateLetterRequest {
  title?: string;
  description?: string;
  recipient_name?: string;
  letter_type_id?: string;
  custom_properties?: Record<string, any>;
  is_published?: boolean;
  content_blocks?: Array<{
    block_type: 'text' | 'image' | 'rich_text';
    order: number;
    content: Record<string, any>;
  }>;
}

export interface CreateLetterTypeRequest {
  name: string;
  description: string;
  meta_schema?: Record<string, any>;
}

// API Error response
export interface APIError {
  error: string;
  details?: Record<string, any>;
}
