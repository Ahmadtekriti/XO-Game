"use client"

import type React from "react"
import { useState } from "react" // Import useState
import { Trophy, Cpu, Clock, User, Loader2 } from "lucide-react"
import { type Language, getTranslation } from "../translations"
import LeaderboardError from "./leaderboard-error"
import { Button } from "@/components/ui/button" // Import Button component

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
  const ms = entry.best_time || entry.bestTime || entry.time || entry.best_score_time || 0

  if (!ms && ms !== 0) {
    return "00:00"
  }

  if (ms < 1000 && entry.time && entry.time > 0) {
    const seconds = Math.floor(entry.time)
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`
  }

  const seconds = Math.floor(ms / 1000)
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60

  return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`
}

const INITIAL_DISPLAY_LIMIT = 10 // Changed from 13 to 10 as requested
const LOAD_MORE_INCREMENT = 10 // How many more entries to load each time

export const AILeaderboard: React.FC<AILeaderboardProps> = ({
  entries,
  language,
  currentPlayerName,
  isLoading = false,
  error = null,
  onRetry = () => {},
}) => {
  const [displayLimit, setDisplayLimit] = useState(INITIAL_DISPLAY_LIMIT) // State for visible entries

  const t = (key: string, replacements?: Record<string, string | number>) => {
    return getTranslation(language, key, replacements)
  }

  const aiEntries = Array.isArray(entries) ? entries.filter((entry) => entry.mode === "ai") : []

  const visibleAiEntries = aiEntries.slice(0, displayLimit) // Slice the entries for display
  const hasMoreEntries = aiEntries.length > displayLimit // Check if there are more entries

  const handleLoadMore = () => {
    setDisplayLimit((prevLimit) => prevLimit + LOAD_MORE_INCREMENT)
  }

  if (error) {
    return <LeaderboardError message={error} onRetry={onRetry} />
  }

  return (
    <div className="w-full bg-[#16213e] rounded-lg p-3 md:p-4">
      <div className="flex items-center justify-between mb-3 md:mb-4">
        <h3 className="text-base md:text-lg font-bold flex items-center gap-1 md:gap-2">
          <Trophy size={16} className="text-[#f7d02c]" />
          <span>AI Challenge Board</span>
        </h3>

        {isLoading && (
          <div className="flex items-center gap-1 md:gap-2 text-gray-400">
            <Loader2 size={14} className="animate-spin" />
            <span className="text-xs">Loading...</span>
          </div>
        )}
      </div>

      {isLoading && aiEntries.length === 0 ? (
        <div className="py-6 md:py-8 flex flex-col items-center justify-center gap-2 md:gap-3">
          <Loader2 size={24} className="animate-spin text-[#4ecdc4]" />
          <p className="text-xs md:text-sm text-gray-400">Loading leaderboard data...</p>
        </div>
      ) : aiEntries.length === 0 ? (
        <p className="text-center text-xs md:text-sm text-gray-400 py-3 md:py-4">{t("no_entries_yet")}</p>
      ) : (
        <div className="space-y-1 md:space-y-2">
          {visibleAiEntries.map(
            (
              entry,
              index, // Use visibleAiEntries here
            ) => (
              <div
                key={index}
                className={`flex flex-col p-2 md:p-3 rounded ${
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
                <div className="flex items-center justify-between mb-1 md:mb-2">
                  <div className="flex items-center gap-1 md:gap-2">
                    <div
                      className={`w-5 h-5 md:w-7 md:h-7 flex items-center justify-center rounded-full ${
                        index === 0
                          ? "bg-yellow-500 text-[#1a1a2e]"
                          : index === 1
                            ? "bg-gray-400 text-[#1a1a2e]"
                            : index === 2
                              ? "bg-amber-700 text-[#1a1a2e]"
                              : "bg-[#16213e]"
                      }`}
                    >
                      {index === 0 ? (
                        <Trophy size={12} />
                      ) : (
                        <span className="font-bold text-xs md:text-sm">{index + 1}</span>
                      )}
                    </div>
                    <div className="font-medium flex items-center gap-1 text-xs md:text-sm">
                      {entry.name}
                      {entry.name === currentPlayerName ? (
                        <User size={10} className="text-[#4ecdc4] opacity-70" />
                      ) : (
                        <Cpu size={10} className="text-[#ff6b6b] opacity-70" />
                      )}
                    </div>
                  </div>
                  <div className="font-bold text-xs md:text-sm">
                    <span className={entry.score < 0 ? "text-[#ff6b6b]" : "text-[#4ecdc4]"}>{entry.score}</span>{" "}
                    {t("points")}
                  </div>
                </div>

                {/* Bottom row with stats and time */}
                <div className="flex items-center justify-between mt-1">
                  <div className="text-2xs md:text-xs text-gray-400">
                    {entry.wins}W | {entry.ties}T | {entry.losses}L
                  </div>
                  <div className="flex items-center gap-1 bg-[#1a1a2e] px-1 md:px-2 py-0.5 md:py-1 rounded text-2xs md:text-xs">
                    <Clock size={8} className="text-[#f7d02c]" />
                    <span className="font-mono">{formatTime(entry)}</span>
                  </div>
                </div>
              </div>
            ),
          )}
          {hasMoreEntries && (
            <div className="flex justify-center mt-4">
              <Button onClick={handleLoadMore} variant="outline" className="text-xs md:text-sm bg-transparent">
                Load More
              </Button>
            </div>
          )}
          {!hasMoreEntries && aiEntries.length > INITIAL_DISPLAY_LIMIT && (
            <p className="text-center text-xs md:text-sm text-gray-400 py-2">No more entries</p>
          )}
        </div>
      )}
    </div>
  )
}
