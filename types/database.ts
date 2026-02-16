export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          avatar_url: string | null;
          bio: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          avatar_url?: string | null;
          bio?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string | null;
          avatar_url?: string | null;
          bio?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      questions: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          content: string;
          post_type:
            | "question"
            | "discussion"
            | "media"
            | "resource"
            | "announcement";
          category: string;
          image_video_url: string | null;
          link_url: string | null;
          vote_count: number;
          comment_count: number;
          created_at: string;
          updated_at: string;
          view_count: number;
          is_answered: boolean;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          content: string;
          post_type:
            | "question"
            | "discussion"
            | "media"
            | "resource"
            | "announcement";
          category: string;
          image_video_url?: string | null;
          link_url?: string | null;
          vote_count?: number;
          comment_count?: number;
          created_at?: string;
          updated_at?: string;
          view_count?: number;
          is_answered?: boolean;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          content?: string;
          post_type?:
            | "question"
            | "discussion"
            | "media"
            | "resource"
            | "announcement";
          category?: string;
          image_video_url?: string | null;
          link_url?: string | null;
          vote_count?: number;
          comment_count?: number;
          created_at?: string;
          updated_at?: string;
          view_count?: number;
          is_answered?: boolean;
        };
      };
      answers: {
        Row: {
          id: string;
          question_id: string;
          parent_id: string | null;
          user_id: string;
          content: string;
          created_at: string;
          updated_at: string;
          is_accepted: boolean;
        };
        Insert: {
          id?: string;
          question_id: string;
          parent_id?: string | null;
          user_id: string;
          content: string;
          created_at?: string;
          updated_at?: string;
          is_accepted?: boolean;
        };
        Update: {
          id?: string;
          question_id?: string;
          parent_id?: string | null;
          user_id?: string;
          content?: string;
          created_at?: string;
          updated_at?: string;
          is_accepted?: boolean;
        };
      };
      votes: {
        Row: {
          id: string;
          user_id: string;
          votable_id: string;
          votable_type: "question" | "answer";
          value: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          votable_id: string;
          votable_type: "question" | "answer";
          value: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          votable_id?: string;
          votable_type?: "question" | "answer";
          value?: number;
          created_at?: string;
        };
      };
      email_subscribers: {
        Row: {
          id: string;
          email: string;
          created_at: string;
          is_active: boolean;
        };
        Insert: {
          id?: string;
          email: string;
          created_at?: string;
          is_active?: boolean;
        };
        Update: {
          id?: string;
          email?: string;
          created_at?: string;
          is_active?: boolean;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}
