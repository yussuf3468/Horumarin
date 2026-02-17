/**
 * SKELETON LOADER COMPONENT
 * Premium loading placeholder with shimmer animation
 */

import { cn } from "@/lib/utils";

interface SkeletonProps {
  className?: string;
  variant?: "text" | "circular" | "rectangular";
  width?: string | number;
  height?: string | number;
  animation?: "pulse" | "wave" | "none";
}

export default function Skeleton({
  className,
  variant = "rectangular",
  width,
  height,
  animation = "wave",
}: SkeletonProps) {
  const baseClasses = "bg-gray-200 dark:bg-gray-700";

  const variantClasses = {
    text: "rounded h-4",
    circular: "rounded-full",
    rectangular: "rounded-lg",
  };

  const animationClasses = {
    pulse: "animate-pulse",
    wave: "relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/30 dark:before:via-gray-600/30 before:to-transparent",
    none: "",
  };

  return (
    <div
      className={cn(
        baseClasses,
        variantClasses[variant],
        animationClasses[animation],
        className,
      )}
      style={{
        width: width,
        height: height,
      }}
    />
  );
}

// =====================
// COMPOUND SKELETONS
// =====================

/**
 * Feed Post Card Skeleton
 */
export function FeedPostSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 space-y-4 border border-gray-200 dark:border-gray-700">
      {/* Header */}
      <div className="flex items-center space-x-3">
        <Skeleton variant="circular" width={40} height={40} />
        <div className="flex-1 space-y-2">
          <Skeleton variant="text" width="30%" height={16} />
          <Skeleton variant="text" width="20%" height={12} />
        </div>
      </div>

      {/* Title */}
      <Skeleton variant="text" width="80%" height={24} />

      {/* Content */}
      <div className="space-y-2">
        <Skeleton variant="text" width="100%" height={16} />
        <Skeleton variant="text" width="95%" height={16} />
        <Skeleton variant="text" width="60%" height={16} />
      </div>

      {/* Footer */}
      <div className="flex items-center space-x-6 pt-2">
        <Skeleton variant="text" width={60} height={20} />
        <Skeleton variant="text" width={80} height={20} />
        <Skeleton variant="text" width={60} height={20} />
      </div>
    </div>
  );
}

/**
 * Profile Header Skeleton
 */
export function ProfileHeaderSkeleton() {
  return (
    <div className="space-y-4">
      {/* Cover Banner */}
      <Skeleton variant="rectangular" className="w-full h-48 rounded-t-xl" />

      {/* Avatar & Info */}
      <div className="px-6 -mt-16 pb-6">
        <div className="flex items-end space-x-4">
          <Skeleton
            variant="circular"
            width={120}
            height={120}
            className="ring-4 ring-white dark:ring-gray-900"
          />
          <div className="flex-1 space-y-3 pb-4">
            <Skeleton variant="text" width="40%" height={32} />
            <Skeleton variant="text" width="60%" height={16} />
          </div>
        </div>

        {/* Stats */}
        <div className="flex space-x-8 mt-6">
          <div className="space-y-2">
            <Skeleton variant="text" width={80} height={24} />
            <Skeleton variant="text" width={60} height={14} />
          </div>
          <div className="space-y-2">
            <Skeleton variant="text" width={80} height={24} />
            <Skeleton variant="text" width={60} height={14} />
          </div>
          <div className="space-y-2">
            <Skeleton variant="text" width={80} height={24} />
            <Skeleton variant="text" width={60} height={14} />
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Comment Skeleton
 */
export function CommentSkeleton() {
  return (
    <div className="flex space-x-3 p-4">
      <Skeleton variant="circular" width={32} height={32} />
      <div className="flex-1 space-y-2">
        <Skeleton variant="text" width="25%" height={14} />
        <Skeleton variant="text" width="100%" height={16} />
        <Skeleton variant="text" width="85%" height={16} />
        <div className="flex space-x-4 mt-2">
          <Skeleton variant="text" width={40} height={14} />
          <Skeleton variant="text" width={40} height={14} />
        </div>
      </div>
    </div>
  );
}

export function SkeletonCard() {
  return (
    <div className="p-6 bg-surface rounded-xl border border-border">
      <div className="flex items-start gap-4">
        <Skeleton variant="circular" width={48} height={48} />
        <div className="flex-1 space-y-3">
          <Skeleton variant="text" className="w-3/4" />
          <Skeleton variant="text" className="w-1/2" />
          <Skeleton variant="rectangular" height={100} className="mt-4" />
        </div>
      </div>
    </div>
  );
}
