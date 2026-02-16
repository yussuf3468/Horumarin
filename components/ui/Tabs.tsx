/**
 * TABS COMPONENT
 * Tabbed interface with animated indicator
 */

"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface Tab {
  id: string;
  label: string;
  content: React.ReactNode;
  icon?: React.ReactNode;
}

interface TabsProps {
  tabs: Tab[];
  defaultTab?: string;
  variant?: "default" | "pills";
  className?: string;
}

export default function Tabs({
  tabs,
  defaultTab,
  variant = "default",
  className,
}: TabsProps) {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id);

  const activeTabContent = tabs.find((tab) => tab.id === activeTab)?.content;

  return (
    <div className={cn("w-full", className)}>
      {/* Tab Headers */}
      <div
        className={cn(
          "flex gap-1",
          variant === "default" && "border-b border-border",
          variant === "pills" && "p-1 bg-surface-muted rounded-lg",
        )}
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "relative px-4 py-2.5 font-medium transition-colors duration-200",
              variant === "default" &&
                "hover:text-primary-600 dark:hover:text-primary-400",
              variant === "pills" && "rounded-md",
              activeTab === tab.id
                ? variant === "default"
                  ? "text-primary-600 dark:text-primary-400"
                  : "bg-surface text-foreground shadow-sm"
                : "text-foreground-muted",
            )}
          >
            <span className="relative z-10 flex items-center gap-2">
              {tab.icon}
              {tab.label}
            </span>

            {/* Active indicator for default variant */}
            {variant === "default" && activeTab === tab.id && (
              <motion.div
                layoutId="activeTab"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600 dark:bg-primary-400"
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="mt-4"
      >
        {activeTabContent}
      </motion.div>
    </div>
  );
}
