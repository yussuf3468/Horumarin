"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { categories } from "@/utils/constants";

const STORAGE_KEY = "MIDEEYE-joined-topics";

type JoinedState = Record<string, boolean>;

export default function TopicsPage() {
  const [joined, setJoined] = useState<JoinedState>({});

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setJoined(JSON.parse(stored) as JoinedState);
      } catch {
        setJoined({});
      }
    }
  }, []);

  const toggleJoin = (id: string) => {
    setJoined((prev) => {
      const next = { ...prev, [id]: !prev[id] };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  };

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="max-w-6xl mx-auto">
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-bold mb-3">Bulshooyinka</h1>
          <p className="text-foreground-muted">
            Dooro bulshada kugu habboon oo la wadaag aqoontaada.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <Card key={category.id} className="overflow-hidden">
              <div className={`h-24 bg-gradient-to-r ${category.gradient}`} />
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl mb-1">{category.icon}</div>
                    <h3 className="text-lg font-bold text-foreground">
                      {category.name}
                    </h3>
                    <p className="text-xs text-foreground-subtle uppercase tracking-wide">
                      {category.nameEn}
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant={joined[category.id] ? "outline" : "primary"}
                    onClick={() => toggleJoin(category.id)}
                  >
                    {joined[category.id] ? "Ka bax" : "Ku biir"}
                  </Button>
                </div>

                <p className="text-sm text-foreground-muted">
                  {category.description}
                </p>

                <div className="flex items-center justify-between text-xs text-foreground-subtle">
                  <span>{category.members.toLocaleString()} xubnood</span>
                  <span>Mod: {category.moderator}</span>
                </div>

                <Link
                  href={`/topics/${category.id}`}
                  className="text-sm text-foreground-subtle hover:text-foreground transition-colors"
                >
                  Arki faahfaahin →
                </Link>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
