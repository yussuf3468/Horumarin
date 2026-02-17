/**
 * ActivityHeatmap Component - GitHub-style contribution graph
 *
 * Shows user activity over the past year in a calendar-style heatmap
 */

"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ActivityData {
  date: string;
  count: number;
}

interface ActivityHeatmapProps {
  data: ActivityData[];
  className?: string;
}

export default function ActivityHeatmap({
  data,
  className,
}: ActivityHeatmapProps) {
  const { weeks, maxCount } = useMemo(() => {
    // Generate last 53 weeks (1 year)
    const today = new Date();
    const oneYearAgo = new Date(today);
    oneYearAgo.setDate(today.getDate() - 365);

    // Create activity map
    const activityMap = new Map<string, number>();
    data.forEach((item) => {
      const dateKey = item.date.split("T")[0]; // Get YYYY-MM-DD
      activityMap.set(dateKey, item.count);
    });

    // Generate weeks
    const weeksArray: { date: Date; count: number }[][] = [];
    let currentWeek: { date: Date; count: number }[] = [];
    let maxActivityCount = 0;

    for (let i = 0; i < 365; i++) {
      const date = new Date(oneYearAgo);
      date.setDate(oneYearAgo.getDate() + i);

      const dateKey = date.toISOString().split("T")[0];
      const count = activityMap.get(dateKey) || 0;

      if (count > maxActivityCount) maxActivityCount = count;

      currentWeek.push({ date, count });

      if (date.getDay() === 6 || i === 364) {
        // Saturday or last day
        weeksArray.push([...currentWeek]);
        currentWeek = [];
      }
    }

    return { weeks: weeksArray, maxCount: maxActivityCount };
  }, [data]);

  const getIntensity = (count: number): number => {
    if (count === 0) return 0;
    if (maxCount === 0) return 0;
    const percentage = count / maxCount;
    if (percentage > 0.75) return 4;
    if (percentage > 0.5) return 3;
    if (percentage > 0.25) return 2;
    return 1;
  };

  const getColor = (intensity: number): string => {
    const colors = [
      "bg-gray-100 dark:bg-gray-800",
      "bg-green-200 dark:bg-green-900",
      "bg-green-400 dark:bg-green-700",
      "bg-green-600 dark:bg-green-600",
      "bg-green-700 dark:bg-green-500",
    ];
    return colors[intensity];
  };

  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
          Activity Overview
        </h3>
        <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
          <span>Less</span>
          {[0, 1, 2, 3, 4].map((level) => (
            <div
              key={level}
              className={cn("w-3 h-3 rounded-sm", getColor(level))}
            />
          ))}
          <span>More</span>
        </div>
      </div>

      {/* Heatmap Grid */}
      <div className="overflow-x-auto pb-2">
        <div className="inline-flex gap-1">
          {weeks.map((week, weekIndex) => (
            <div key={weekIndex} className="flex flex-col gap-1">
              {week.map((day, dayIndex) => {
                const intensity = getIntensity(day.count);
                return (
                  <motion.div
                    key={`${weekIndex}-${dayIndex}`}
                    className={cn(
                      "w-3 h-3 rounded-sm cursor-pointer",
                      getColor(intensity),
                      "hover:ring-2 hover:ring-blue-500 hover:ring-offset-1 transition-all",
                    )}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: weekIndex * 0.01 + dayIndex * 0.001 }}
                    whileHover={{ scale: 1.3 }}
                    title={`${day.date.toLocaleDateString()}: ${day.count} ${day.count === 1 ? "contribution" : "contributions"}`}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * Compact version for sidebar or small spaces
 */
export function ActivityHeatmapcompact({ data }: { data: ActivityData[] }) {
  const { dayData, maxCount } = useMemo(() => {
    // Get last 90 days only
    const today = new Date();
    const ninetyDaysAgo = new Date(today);
    ninetyDaysAgo.setDate(today.getDate() - 90);

    const activityMap = new Map<string, number>();
    data.forEach((item) => {
      const dateKey = item.date.split("T")[0];
      activityMap.set(dateKey, item.count);
    });

    const days: { date: Date; count: number }[] = [];
    let maxActivityCount = 0;

    for (let i = 0; i < 90; i++) {
      const date = new Date(ninetyDaysAgo);
      date.setDate(ninetyDaysAgo.getDate() + i);

      const dateKey = date.toISOString().split("T")[0];
      const count = activityMap.get(dateKey) || 0;

      if (count > maxActivityCount) maxActivityCount = count;
      days.push({ date, count });
    }

    return { dayData: days, maxCount: maxActivityCount };
  }, [data]);

  const getIntensity = (count: number): number => {
    if (count === 0) return 0;
    if (maxCount === 0) return 0;
    const percentage = count / maxCount;
    if (percentage > 0.66) return 3;
    if (percentage > 0.33) return 2;
    return 1;
  };

  const getColor = (intensity: number): string => {
    const colors = [
      "bg-gray-100 dark:bg-gray-800",
      "bg-blue-300 dark:bg-blue-800",
      "bg-blue-500 dark:bg-blue-600",
      "bg-blue-700 dark:bg-blue-500",
    ];
    return colors[intensity];
  };

  return (
    <div className="flex gap-0.5 flex-wrap">
      {dayData.map((day, index) => (
        <div
          key={index}
          className={cn(
            "w-2 h-2 rounded-sm",
            getColor(getIntensity(day.count)),
          )}
          title={`${day.date.toLocaleDateString()}: ${day.count}`}
        />
      ))}
    </div>
  );
}
