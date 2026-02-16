"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

interface Activity {
  id: string;
  user: string;
  action: string;
  time: string;
  type: "question" | "answer" | "vote";
  uniqueKey?: string; // Add unique key for React rendering
}

const MOCK_ACTIVITIES: Activity[] = [
  {
    id: "1",
    user: "Ahmed M.",
    action: "weydii su'aal cusub",
    time: "2 daqiiqo kahor",
    type: "question",
  },
  {
    id: "2",
    user: "Fatima A.",
    action: "jawaab ka bixisay su'aal",
    time: "5 daqiiqo kahor",
    type: "answer",
  },
  {
    id: "3",
    user: "Mohamed K.",
    action: "u codeeyay jawaab",
    time: "8 daqiiqo kahor",
    type: "vote",
  },
  {
    id: "4",
    user: "Amina S.",
    action: "weydii su'aal cusub",
    time: "12 daqiiqo kahor",
    type: "question",
  },
  {
    id: "5",
    user: "Cabdi R.",
    action: "jawaab ka bixisay su'aal",
    time: "15 daqiiqo kahor",
    type: "answer",
  },
];

export default function LiveActivityFeed() {
  const [activities, setActivities] = useState<Activity[]>(
    MOCK_ACTIVITIES.slice(0, 3).map((activity, idx) => ({
      ...activity,
      uniqueKey: `${activity.id}-${idx}`,
    })),
  );
  const [currentIndex, setCurrentIndex] = useState(3);
  const [uniqueCounter, setUniqueCounter] = useState(3);

  useEffect(() => {
    const interval = setInterval(() => {
      setActivities((prev) => {
        const baseActivity =
          MOCK_ACTIVITIES[currentIndex % MOCK_ACTIVITIES.length];
        const newActivity = {
          ...baseActivity,
          uniqueKey: `${baseActivity.id}-${uniqueCounter}`,
        };
        const updated = [newActivity, ...prev.slice(0, 2)];
        setCurrentIndex((i) => i + 1);
        setUniqueCounter((c) => c + 1);
        return updated;
      });
    }, 8000); // Update every 8 seconds

    return () => clearInterval(interval);
  }, [currentIndex, uniqueCounter]);

  const getIcon = (type: Activity["type"]) => {
    switch (type) {
      case "question":
        return "❓";
      case "answer":
        return "💬";
      case "vote":
        return "⬆️";
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 mb-4">
        <div className="relative">
          <div className="w-2 h-2 bg-accent-500 rounded-full animate-pulse" />
          <div className="absolute inset-0 w-2 h-2 bg-accent-500 rounded-full animate-ping opacity-75" />
        </div>
        <h3 className="text-sm font-semibold text-foreground-muted uppercase tracking-wider">
          Firfircoon Hadda
        </h3>
      </div>

      <AnimatePresence mode="popLayout">
        {activities.map((activity) => (
          <motion.div
            key={activity.uniqueKey || activity.id}
            layout
            initial={{ opacity: 0, x: -20, height: 0 }}
            animate={{ opacity: 1, x: 0, height: "auto" }}
            exit={{ opacity: 0, x: 20, height: 0 }}
            transition={{
              duration: 0.3,
              layout: { duration: 0.2 },
            }}
            className="flex items-start gap-3 p-3 bg-surface-muted rounded-lg border border-border-subtle hover:border-border transition-colors"
          >
            <div className="text-xl flex-shrink-0 mt-0.5">
              {getIcon(activity.type)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-foreground">
                <span className="font-semibold">{activity.user}</span>{" "}
                {activity.action}
              </p>
              <p className="text-xs text-foreground-subtle mt-0.5">
                {activity.time}
              </p>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
