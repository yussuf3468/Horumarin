/**
 * DashboardSkeleton Component
 *
 * Loading skeleton for the dashboard page that matches the actual layout
 * Shows: Welcome section, stats grid, quick actions, categories, and recent questions
 */

import Card from "./Card";
import Skeleton from "./Skeleton";

export default function DashboardSkeleton() {
  return (
    <div className="relative min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Welcome Section */}
        <div className="mb-8">
          <Skeleton className="h-10 w-80 mb-2" />
          <Skeleton className="h-6 w-64" />
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="p-6">
              <Skeleton className="w-12 h-12 rounded-lg mb-4" />
              <Skeleton className="h-8 w-16 mb-1" />
              <Skeleton className="h-5 w-40" />
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mb-12">
          <Skeleton className="h-8 w-40 mb-6" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2].map((i) => (
              <Card key={i} className="p-6">
                <div className="flex items-center gap-4">
                  <Skeleton className="w-10 h-10 rounded" />
                  <div className="flex-1">
                    <Skeleton className="h-6 w-32 mb-1" />
                    <Skeleton className="h-5 w-48" />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Categories */}
        <div className="mb-12">
          <Skeleton className="h-8 w-32 mb-6" />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="rounded-xl p-4 bg-surface-subtle">
                <Skeleton className="w-8 h-8 rounded mx-auto mb-2" />
                <Skeleton className="h-4 w-16 mx-auto" />
              </div>
            ))}
          </div>
        </div>

        {/* Recent Questions */}
        <div>
          <div className="flex justify-between items-center mb-6">
            <Skeleton className="h-8 w-40" />
            <Skeleton className="h-9 w-28" />
          </div>

          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <Card key={i} className="p-6">
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-5 w-full mb-1" />
                <Skeleton className="h-5 w-2/3 mb-4" />
                <div className="flex gap-4">
                  <Skeleton className="h-5 w-24" />
                  <Skeleton className="h-5 w-32" />
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
