"use client";

import Link from "next/link";
import { formatDate } from "@/utils/helpers";
import Avatar from "@/components/ui/Avatar";
import LightboxImage from "@/components/ui/LightboxImage";
import Card from "@/components/ui/Card";
import SaveButton from "@/components/ui/SaveButton";
import { motion } from "framer-motion";

interface PostCardProps {
  id: string;
  author: {
    id: string;
    fullName: string | null;
    avatar_url?: string | null;
  };
  title: string;
  content: string;
  category: string;
  imageUrl?: string | null;
  linkUrl?: string | null;
  voteCount: number;
  commentCount: number;
  createdAt: string;
  userVote?: number;
  onVote?: (postId: string, value: number) => void;
  isOwner?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
  userId?: string | null;
  isSaved?: boolean;
}

export default function PostCard({
  id,
  author,
  title,
  content,
  category,
  imageUrl,
  linkUrl,
  voteCount,
  commentCount,
  createdAt,
  userVote = 0,
  onVote,
  isOwner = false,
  onEdit,
  onDelete,
  userId = null,
  isSaved = false,
}: PostCardProps) {
  const handleVote = (value: number) => {
    if (onVote) {
      onVote(id, value);
    }
  };

  return (
    <Card hover className="group overflow-hidden">
      <div className="p-4 sm:p-5">
        {/* Header: author + category + owner actions */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex items-center gap-2.5 min-w-0 flex-1">
            <Avatar
              src={author.avatar_url || undefined}
              alt={author.fullName || "User"}
              size="sm"
              className="w-8 h-8 shrink-0 ring-2 ring-border"
            />
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-semibold text-foreground truncate leading-tight">
                {author.fullName || "User"}
              </span>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="inline-flex px-2 py-0.5 rounded-md bg-primary/10 text-primary-400 text-[10px] font-semibold uppercase tracking-wide">
                  {category}
                </span>
                <span className="text-[10px] text-foreground-subtle">
                  {formatDate(createdAt)}
                </span>
              </div>
            </div>
          </div>

          {isOwner && (
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              {onEdit && (
                <button
                  onClick={onEdit}
                  className="p-1.5 rounded-lg hover:bg-surface-muted transition-colors text-foreground-subtle hover:text-primary-400"
                  title="Edit"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                </button>
              )}
              {onDelete && (
                <button
                  onClick={onDelete}
                  className="p-1.5 rounded-lg hover:bg-surface-muted transition-colors text-foreground-subtle hover:text-danger"
                  title="Delete"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
              )}
            </div>
          )}
        </div>

        {/* Title */}
        <Link href={`/questions/${id}`}>
          <h2 className="text-base sm:text-lg font-bold text-foreground hover:text-primary-400 mb-2 line-clamp-2 transition-colors leading-snug">
            {title}
          </h2>
        </Link>

        {/* Content Preview */}
        {content && (
          <p className="text-sm text-foreground-muted mb-3 line-clamp-2 leading-relaxed">
            {content}
          </p>
        )}

        {/* Image */}
        {imageUrl && (
          <div className="mb-3 -mx-4 sm:-mx-5 rounded-none overflow-hidden">
            <LightboxImage
              src={imageUrl}
              alt={title}
              className="w-full"
              aspectRatio="16 / 9"
            />
          </div>
        )}

        {/* Link Preview */}
        {linkUrl && (
          <a
            href={linkUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 p-3 bg-surface-muted rounded-xl border border-border hover:border-primary/30 transition-colors mb-3"
          >
            <svg
              className="w-4 h-4 text-foreground-subtle shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
            <span className="text-xs text-primary-400 truncate font-medium">
              {linkUrl}
            </span>
          </a>
        )}

        {/* Vote momentum bar */}
        {voteCount > 0 && (
          <div className="mb-3 h-0.5 rounded-full bg-surface-muted overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary-500 to-primary-400 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, voteCount * 5)}%` }}
            />
          </div>
        )}

        {/* Action Bar */}
        <div className="flex items-center gap-1.5 pt-2.5 border-t border-border/60">
          {/* Vote */}
          <motion.button
            onClick={() => handleVote(1)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              userVote === 1
                ? "bg-primary/15 text-primary-400 border border-primary/30"
                : "text-foreground-muted hover:text-primary-400 hover:bg-primary/10 border border-transparent"
            }`}
            whileTap={{ scale: 0.92 }}
          >
            <motion.svg
              className="w-4 h-4"
              fill={userVote === 1 ? "currentColor" : "none"}
              stroke={userVote === 1 ? "none" : "currentColor"}
              viewBox="0 0 24 24"
              strokeWidth={2}
              animate={userVote === 1 ? { scale: [1, 1.25, 1] } : {}}
              transition={{ duration: 0.25 }}
            >
              {userVote === 1 ? (
                <path
                  fillRule="evenodd"
                  d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656"
                  clipRule="evenodd"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              )}
            </motion.svg>
            <span>{voteCount}</span>
          </motion.button>

          {/* Comments */}
          <Link
            href={`/questions/${id}`}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-foreground-muted hover:text-primary-400 hover:bg-primary/10 transition-all border border-transparent"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
            <span>{commentCount}</span>
          </Link>

          <div className="flex-1" />

          {/* Save */}
          <SaveButton
            postId={id}
            userId={userId}
            initialSaved={isSaved}
            variant="inline"
          />
        </div>
      </div>
    </Card>
  );
}
