export type FunnelStage = 'top' | 'middle' | 'bottom';
export type PostType = 'entertaining' | 'inspiring' | 'educational' | 'connect' | 'promotional';
export type Goal = 'awareness' | 'nurturing' | 'converting';
export type Platform = 'whatsapp' | 'instagram' | 'facebook' | 'linkedin' | 'x';

export interface Post {
  id: string;
  date: string;
  content: string;
  postType: PostType;
  category: string;
  topic: string;
  goal: Goal;
  funnelStage: FunnelStage;
  virality: number; // 0-100 percentage
  platform: Platform;
  calendarId: string;
  createdAt?: string;
}

export interface Calendar {
  id: string;
  userId: string;
  inputText: string;
  businessType?: string;
  targetAudience?: string;
  platforms: Platform[];
  contentPillars: string[];
  funnelDistribution: {
    top: number;
    middle: number;
    bottom: number;
  };
  posts: Post[];
  createdAt: string;
  updatedAt: string;
}

export interface UserProfile {
  id: string;
  email: string;
  businessType?: string;
  industry?: string;
  businessSize?: string;
  goals?: string[];
  targetAudience?: string;
  createdAt: string;
}

export interface CalendarGenerationRequest {
  inputText: string;
  businessType?: string;
  targetAudience?: string;
  accountMaturity?: 'new' | 'established';
  platforms: Platform[];
}

