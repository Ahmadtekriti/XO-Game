"use client"

import type React from "react"

import { useState } from "react"

interface GameSetupProps {
  gameMode: "single" | "multi"
  playerNames: { player1: string; player2: string }
  onUpdateSettings: (gameMode: "single" | "multi", playerNames: { player1: string; player2: string }) => void
}

export const GameSetup: React.FC<GameSetupProps> = ({ gameMode, playerNames, onUpdateSettings }) => {
  const [mode, setMode] = useState<"single" | "multi">(gameMode)
  const [player1Name, setPlayer1Name] = useState(playerNames.player1)
  const [player2Name, setPlayer2Name] = useState(playerNames.player2)

  // Apply changes immediately when mode changes
  const handleModeChange = (newMode: "single" | "multi") => {
    setMode(newMode)
    onUpdateSettings(newMode, {
      player1: player1Name.trim() || "YOU",
      player2: player2Name.trim() || (newMode === "single" ? "AI" : "PLAYER 2"),
    })
  }

  // Apply name changes when input loses focus
  const handleNameBlur = () => {
    onUpdateSettings(mode, {
      player1: player1Name.trim() || "YOU",
      player2: player2Name.trim() || (mode === "single" ? "AI" : "PLAYER 2"),
    })
  }

  return (
    <div className="w-full mb-6">
      <h2 className="text-xl font-semibold mb-3 text-center md:text-left">GAME MODE</h2>

      {/* Simple mode toggle */}
      <div className="flex gap-2 mb-4">
        <button
          type="button"
          className={`flex-1 py-2 rounded-md text-sm transition-colors ${
            mode === "single" ? "bg-[#ff5252] text-white" : "bg-[#2a2a2a] text-gray-300 hover:bg-[#333333]"
          }`}
          onClick={() => handleModeChange("single")}
        >
          VS AI
        </button>
        <button
          type="button"
          className={`flex-1 py-2 rounded-md text-sm transition-colors ${
            mode === "multi" ? "bg-[#4fc3f7] text-white" : "bg-[#2a2a2a] text-gray-300 hover:bg-[#333333]"
          }`}
          onClick={() => handleModeChange("multi")}
        >
          2 PLAYERS
        </button>
      </div>

      {/* Player names */}
      <div className="flex gap-2">
        <input
          type="text"
          value={player1Name}
          onChange={(e) => setPlayer1Name(e.target.value)}
          onBlur={handleNameBlur}
          placeholder="Player 1"
          className="flex-1 px-3 py-2 bg-[#2a2a2a] rounded-md text-white text-sm focus:outline-none focus:ring-1 focus:ring-[#ff5252]"
          maxLength={10}
        />
        <input
          type="text"
          value={player2Name}
          onChange={(e) => setPlayer2Name(e.target.value)}
          onBlur={handleNameBlur}
          placeholder={mode === "single" ? "AI" : "Player 2"}
          className="flex-1 px-3 py-2 bg-[#2a2a2a] rounded-md text-white text-sm focus:outline-none focus:ring-1 focus:ring-[#4fc3f7]"
          maxLength={10}
        />
      </div>
    </div>
  )
}
