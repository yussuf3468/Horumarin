import type { Database } from "./database";

export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type Question = Database["public"]["Tables"]["questions"]["Row"];
export type Answer = Database["public"]["Tables"]["answers"]["Row"];
export type Vote = Database["public"]["Tables"]["votes"]["Row"];
export type EmailSubscriber =
  Database["public"]["Tables"]["email_subscribers"]["Row"];

export type Post = Question;
export type PostType = Question["post_type"];

export type QuestionWithProfile = Question & {
  profile: Profile;
  answers_count: number;
  votes_sum: number;
};

export type AnswerWithProfile = Answer & {
  profile: Profile;
  votes_sum: number;
};

export type Category = {
  id: string;
  name: string;
  nameEn: string;
  icon: string;
  gradient: string;
  description: string;
  banner: string;
  members: number;
  moderator: string;
};
