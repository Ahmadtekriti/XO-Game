"use client"

import type React from "react"
import { useState } from "react"
import { Trophy, Cpu, Clock, User, Loader2, ChevronDown } from "lucide-react"
import { type Language, getTranslation } from "../translations"
import LeaderboardError from "./leaderboard-error"
import { Button } from "@/components/ui/button"

type GameMode = "ai" | "friend"

type LeaderboardEntry = {
  name: string
  wins: number
  losses: number
  ties: number
  score: number
  // Make time fields flexible
  best_time?: number
  bestTime?: number
  time?: number
  best_score_time?: number
  mode: GameMode
  [key: string]: any // Allow any other fields
}

interface AILeaderboardProps {
  entries: LeaderboardEntry[]
  language: Language
  currentPlayerName: string
  isLoading?: boolean
  error?: string | null
  onRetry?: () => void
}

const formatTime = (entry: LeaderboardEntry) => {
  // Try to get time from any available field
  const ms = entry.best_time || entry.bestTime || entry.time || entry.best_score_time || 0

  // If time is missing or zero, show a default value
  if (!ms && ms !== 0) {
    return "00:00"
  }

  // Handle time stored in seconds (not milliseconds)
  // If the value is small (less than 1000) and entry.time exists, it's likely in seconds already
  if (ms < 1000 && entry.time && entry.time > 0) {
    const seconds = Math.floor(entry.time)
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`
  }

  // Normal case - convert milliseconds to minutes:seconds
  const seconds = Math.floor(ms / 1000)
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60

  return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`
}

const INITIAL_DISPLAY_COUNT = 10

export const AILeaderboard: React.FC<AILeaderboardProps> = ({
  entries,
  language,
  currentPlayerName,
  isLoading = false,
  error = null,
  onRetry = () => {},
}) => {
  const [showAll, setShowAll] = useState(false)

  // Helper function to get translation
  const t = (key: string, replacements?: Record<string, string | number>) => {
    return getTranslation(language, key, replacements)
  }

  // Filter to only show AI mode entries
  const aiEntries = Array.isArray(entries) ? entries.filter((entry) => entry.mode === "ai") : []

  // Determine which entries to display
  const displayedEntries = showAll ? aiEntries : aiEntries.slice(0, INITIAL_DISPLAY_COUNT)
  const hasMoreEntries = aiEntries.length > INITIAL_DISPLAY_COUNT

  // If there's an error, show the error component
  if (error) {
    return <LeaderboardError message={error} onRetry={onRetry} />
  }

  return (
    <div className="w-full bg-[#16213e] rounded-lg p-3">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-bold flex items-center gap-1">
          <Trophy size={14} className="text-[#f7d02c]" />
          <span>AI Challenge Board</span>
        </h3>

        {isLoading && (
          <div className="flex items-center gap-1 text-gray-400">
            <Loader2 size={12} className="animate-spin" />
            <span className="text-xs">Loading...</span>
          </div>
        )}
      </div>

      {isLoading && aiEntries.length === 0 ? (
        <div className="py-4 flex flex-col items-center justify-center gap-2">
          <Loader2 size={20} className="animate-spin text-[#4ecdc4]" />
          <p className="text-xs text-gray-400">Loading leaderboard data...</p>
        </div>
      ) : aiEntries.length === 0 ? (
        <p className="text-center text-xs text-gray-400 py-3">{t("no_entries_yet")}</p>
      ) : (
        <>
          <div className="space-y-1">
            {displayedEntries.map((entry, index) => (
              <div
                key={index}
                className={`flex flex-col p-2 rounded text-xs ${
                  entry.name === currentPlayerName
                    ? "bg-[#1e2a4a] border border-[#4ecdc4] border-opacity-30"
                    : index === 0
                      ? "bg-yellow-500 bg-opacity-20 border border-yellow-500 border-opacity-30"
                      : index === 1
                        ? "bg-gray-400 bg-opacity-20 border border-gray-400 border-opacity-30"
                        : index === 2
                          ? "bg-amber-700 bg-opacity-20 border border-amber-700 border-opacity-30"
                          : "bg-[#16213e]"
                }`}
              >
                {/* Top row with rank, name and score */}
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-1">
                    <div
                      className={`w-4 h-4 flex items-center justify-center rounded-full text-xs ${
                        index === 0
                          ? "bg-yellow-500 text-[#1a1a2e]"
                          : index === 1
                            ? "bg-gray-400 text-[#1a1a2e]"
                            : index === 2
                              ? "bg-amber-700 text-[#1a1a2e]"
                              : "bg-[#16213e]"
                      }`}
                    >
                      {index === 0 ? <Trophy size={10} /> : <span className="font-bold text-xs">{index + 1}</span>}
                    </div>
                    <div className="font-medium flex items-center gap-1">
                      <span className="truncate max-w-[100px]">{entry.name}</span>
                      {entry.name === currentPlayerName ? (
                        <User size={8} className="text-[#4ecdc4] opacity-70" />
                      ) : (
                        <Cpu size={8} className="text-[#ff6b6b] opacity-70" />
                      )}
                    </div>
                  </div>
                  <div className="font-bold">
                    <span className={entry.score < 0 ? "text-[#ff6b6b]" : "text-[#4ecdc4]"}>{entry.score}</span>{" "}
                    {t("points")}
                  </div>
                </div>

                {/* Bottom row with stats and time */}
                <div className="flex items-center justify-between">
                  <div className="text-xs text-gray-400">
                    {entry.wins}W | {entry.ties}T | {entry.losses}L
                  </div>
                  <div className="flex items-center gap-1 bg-[#1a1a2e] px-1 py-0.5 rounded text-xs">
                    <Clock size={6} className="text-[#f7d02c]" />
                    <span className="font-mono text-xs">{formatTime(entry)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Load More Button */}
          {hasMoreEntries && (
            <div className="flex justify-center mt-3">
              <Button
                onClick={() => setShowAll(!showAll)}
                variant="ghost"
                size="sm"
                className="text-xs text-gray-400 hover:text-white hover:bg-[#1e2a4a] h-7"
              >
                <ChevronDown size={12} className={`mr-1 transition-transform ${showAll ? "rotate-180" : ""}`} />
                {showAll ? "Show Less" : `Show More (${aiEntries.length - INITIAL_DISPLAY_COUNT})`}
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
