import type React from "react"
import { Trophy, Cpu, Clock } from "lucide-react"

type GameMode = "ai" | "friend"

type LeaderboardEntry = {
  name: string
  wins: number
  losses: number
  ties: number
  score: number
  bestTime: number
  mode: GameMode
}

interface LeaderboardProps {
  entries: LeaderboardEntry[]
}

// Update the formatTime function to handle different time field names and ensure it always returns a formatted time
const formatTime = (ms: number | undefined | null) => {
  if (!ms || ms === 0) return "00:00" // Return "00:00" instead of "N/A" when time is 0 or null
  const seconds = Math.floor(ms / 1000)
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`
}

// Update the Leaderboard component to show score and time
export const Leaderboard: React.FC<LeaderboardProps> = ({ entries }) => {
  // Filter to only show AI mode entries
  const aiEntries = entries.filter((entry) => entry.mode === "ai")

  return (
    <div className="w-full">
      {aiEntries.length === 0 ? (
        <p className="text-center text-gray-400 py-4">No entries yet. Play against AI to appear on the leaderboard!</p>
      ) : (
        <div className="space-y-2">
          {aiEntries.map((entry, index) => (
            <div
              key={index}
              className={`flex items-center justify-between p-3 rounded ${
                index === 0
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
                    <Cpu size={12} className="text-[#ff6b6b] opacity-70" />
                  </div>
                  <div className="text-xs text-gray-400">
                    W: {entry.wins} | T: {entry.ties} | L: {entry.losses}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold text-sm">
                  <span className="text-[#4ecdc4]">{entry.score}</span> pts
                </div>
                <div className="text-xs text-gray-400 flex items-center justify-end gap-1">
                  <Clock size={10} />
                  {formatTime(entry.bestTime)}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
