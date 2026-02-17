/**
 * ProfileBanner Component - Premium Profile Header
 *
 * Features:
 * - Cover image with edit capability
 * - Avatar with hover effects
 * - Profile stats
 * - Edit button for owner
 */

"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Avatar from "./Avatar";
import Button from "./Button";
import { cn } from "@/lib/utils";

interface ProfileBannerProps {
  userId: string;
  fullName: string | null;
  bio: string | null;
  avatarUrl: string | null;
  coverUrl?: string | null;
  reputation: number;
  postCount: number;
  answerCount: number;
  followerCount?: number;
  followingCount?: number;
  joinedDate: string;
  isOwner: boolean;
  onEditClick?: () => void;
}

export default function ProfileBanner({
  fullName,
  bio,
  avatarUrl,
  coverUrl,
  reputation,
  postCount,
  answerCount,
  followerCount = 0,
  followingCount = 0,
  joinedDate,
  isOwner,
  onEditClick,
}: ProfileBannerProps) {
  const [coverLoaded, setCoverLoaded] = useState(false);

  const formatJoinDate = (date: string) => {
    const d = new Date(date);
    return d.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  };

  return (
    <div className="relative">
      {/* Cover Image */}
      <div className="relative h-64 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 overflow-hidden">
        {coverUrl && (
          <motion.img
            src={coverUrl}
            alt="Cover"
            className={cn(
              "w-full h-full object-cover transition-opacity duration-500",
              coverLoaded ? "opacity-100" : "opacity-0",
            )}
            onLoad={() => setCoverLoaded(true)}
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
          />
        )}

        {/* Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

        {/* Edit Cover Button (Owner Only) */}
        {isOwner && (
          <button className="absolute top-4 right-4 px-4 py-2 bg-white/10 backdrop-blur-md rounded-lg text-white text-sm font-medium hover:bg-white/20 transition-colors">
            <svg
              className="w-4 h-4 inline mr-1.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            Change Cover
          </button>
        )}
      </div>

      {/* Profile Info Section */}
      <div className="max-w-6xl mx-auto px-6">
        <div className="relative -mt-20 pb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4">
            {/* Avatar */}
            <motion.div
              className="relative group"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="w-32 h-32 rounded-2xl ring-4 ring-white dark:ring-gray-900 overflow-hidden bg-white dark:bg-gray-800 shadow-xl">
                <Avatar
                  src={(avatarUrl as string | undefined) || undefined}
                  alt={fullName || "User"}
                  size="xl"
                  className="w-full h-full"
                />
              </div>

              {/* Upload overlay for owner */}
              {isOwner && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/50 transition-all rounded-2xl cursor-pointer">
                  <svg
                    className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </div>
              )}
            </motion.div>

            {/* Name & Bio */}
            <div className="flex-1 min-w-0">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                {fullName || "Anonymous User"}
              </h1>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
                {bio || "No bio yet"}
              </p>
              <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                <span className="flex items-center gap-1">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  Joined {formatJoinDate(joinedDate)}
                </span>
              </div>
            </div>

            {/* Edit Button (Owner Only) */}
            {isOwner && onEditClick && (
              <Button
                onClick={onEditClick}
                variant="secondary"
                className="mt-2 sm:mt-0"
              >
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
                Edit Profile
              </Button>
            )}
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mt-6 bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <StatCard label="Reputation" value={reputation} />
            <StatCard label="Posts" value={postCount} />
            <StatCard label="Answers" value={answerCount} />
            <StatCard label="Followers" value={followerCount} />
            <StatCard label="Following" value={followingCount} />
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="text-center">
      <div className="text-2xl font-bold text-gray-900 dark:text-white">
        {value.toLocaleString()}
      </div>
      <div className="text-sm text-gray-500 dark:text-gray-400">{label}</div>
    </div>
  );
}
