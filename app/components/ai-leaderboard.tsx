"use client"

import type React from "react"
import { Trophy, Cpu, Clock, User, Loader2 } from "lucide-react"
import { type Language, getTranslation } from "../translations"
import LeaderboardError from "./leaderboard-error"

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

// Update the formatTime function to handle any time field and ensure it works with very small or zero values
const formatTime = (entry: LeaderboardEntry) => {
  // Try to get time from any available field
  const ms = entry.best_time || entry.bestTime || entry.time || entry.best_score_time || 0
  console.log(`Formatting time for ${entry.name}: ${ms} ms (type: ${typeof ms})`)

  // If time is missing, zero, or very small, show a default value
  if (!ms || ms <= 0) {
    return "00:00"
  }

  // For very small values that might be stored in seconds instead of milliseconds
  if (ms < 100) {
    console.log(`Time value for ${entry.name} is very small (${ms}), might be in seconds already`)
    const minutes = Math.floor(ms / 60)
    const seconds = Math.floor(ms % 60)
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
  }

  // Normal case - convert milliseconds to minutes:seconds
  const seconds = Math.floor(ms / 1000)
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60

  return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`
}

// Update the Leaderboard component to show score and time
export const AILeaderboard: React.FC<AILeaderboardProps> = ({
  entries,
  language,
  currentPlayerName,
  isLoading = false,
  error = null,
  onRetry = () => {},
}) => {
  // Add debugging to log the entries
  console.log("AILeaderboard entries:", entries)

  // Helper function to get translation
  const t = (key: string, replacements?: Record<string, string | number>) => {
    return getTranslation(language, key, replacements)
  }

  // Filter to only show AI mode entries
  const aiEntries = entries.filter((entry) => entry.mode === "ai")
  console.log("Filtered AI entries:", aiEntries)

  // If there's an error, show the error component
  if (error) {
    return <LeaderboardError message={error} onRetry={onRetry} />
  }

  return (
    <div className="w-full bg-[#16213e] rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold flex items-center gap-2">
          <Trophy size={18} className="text-[#f7d02c]" />
          <span>AI Challenge Board</span>
        </h3>

        {isLoading && (
          <div className="flex items-center gap-2 text-gray-400">
            <Loader2 size={14} className="animate-spin" />
            <span className="text-xs">Loading...</span>
          </div>
        )}
      </div>

      {isLoading && aiEntries.length === 0 ? (
        <div className="py-8 flex flex-col items-center justify-center gap-3">
          <Loader2 size={24} className="animate-spin text-[#4ecdc4]" />
          <p className="text-sm text-gray-400">Loading leaderboard data...</p>
        </div>
      ) : aiEntries.length === 0 ? (
        <p className="text-center text-gray-400 py-4">{t("no_entries_yet")}</p>
      ) : (
        <div className="space-y-2">
          {aiEntries.map((entry, index) => (
            <div
              key={index}
              className={`flex items-center justify-between p-3 rounded ${
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
              <div className="flex items-center gap-3">
                <div
                  className={`w-7 h-7 flex items-center justify-center rounded-full ${
                    index === 0
                      ? "bg-yellow-500 text-[#1a1a2e]"
                      : index === 1
                        ? "bg-gray-400 text-[#1a1a2e]"
                        : index === 2
                          ? "bg-amber-700 text-[#1a1a2e]"
                          : "bg-[#16213e]"
                  }`}
                >
                  {index === 0 ? <Trophy size={14} /> : <span className="font-bold text-sm">{index + 1}</span>}
                </div>
                <div>
                  <div className="font-medium flex items-center gap-1 text-sm">
                    {entry.name}
                    {entry.name === currentPlayerName ? (
                      <User size={12} className="text-[#4ecdc4] opacity-70" />
                    ) : (
                      <Cpu size={12} className="text-[#ff6b6b] opacity-70" />
                    )}
                  </div>
                  <div className="text-xs text-gray-400">
                    {t("wins")}: {entry.wins} | {t("ties")}: {entry.ties} | {t("losses")}: {entry.losses}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold text-sm">
                  <span className={entry.score < 0 ? "text-[#ff6b6b]" : "text-[#4ecdc4]"}>{entry.score}</span>{" "}
                  {t("points")}
                </div>
                <div className="text-xs text-gray-400 flex items-center justify-end gap-1">
                  <Clock size={10} />
                  {formatTime(entry)}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
