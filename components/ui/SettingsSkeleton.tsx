/**
 * SettingsSkeleton Component
 *
 * Loading skeleton for settings pages
 * Shows: Header, form fields, and info sections
 */

import Card from "./Card";
import Skeleton from "./Skeleton";

export default function SettingsSkeleton() {
  return (
    <div className="min-h-screen bg-background py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Skeleton className="h-9 w-48 mb-2" />
          <Skeleton className="h-5 w-96" />
        </div>

        {/* Form Card */}
        <Card className="p-6 md:p-8">
          <div className="space-y-6">
            {/* Full Name Field */}
            <div>
              <Skeleton className="h-5 w-24 mb-2" />
              <Skeleton className="h-11 w-full" />
              <Skeleton className="h-4 w-48 mt-1" />
            </div>

            {/* Bio Field */}
            <div>
              <Skeleton className="h-5 w-16 mb-2" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-4 w-32 mt-1" />
            </div>

            {/* Avatar Field */}
            <div>
              <Skeleton className="h-5 w-32 mb-2" />
              <Skeleton className="w-32 h-32 rounded-lg mb-4" />
              <div className="flex gap-3 mb-2">
                <Skeleton className="h-10 w-32" />
                <Skeleton className="h-10 w-24" />
              </div>
              <Skeleton className="h-4 w-80" />
            </div>

            {/* Email Field */}
            <div>
              <Skeleton className="h-5 w-20 mb-2" />
              <Skeleton className="h-11 w-full" />
              <Skeleton className="h-4 w-40 mt-1" />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-4">
              <Skeleton className="h-11 flex-1" />
              <Skeleton className="h-11 flex-1" />
            </div>
          </div>
        </Card>

        {/* Info Card */}
        <div className="mt-6 p-4 rounded-lg bg-surface-muted border border-border">
          <Skeleton className="h-6 w-40 mb-2" />
          <div className="space-y-1">
            <Skeleton className="h-5 w-64" />
            <Skeleton className="h-5 w-72" />
            <Skeleton className="h-5 w-80" />
          </div>
        </div>
      </div>
    </div>
  );
}
