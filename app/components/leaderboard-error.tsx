"use client"

import type React from "react"

import { AlertCircle, RefreshCw } from "lucide-react"

interface LeaderboardErrorProps {
  message: string
  onRetry: () => void
}

const LeaderboardError: React.FC<LeaderboardErrorProps> = ({ message, onRetry }) => {
  return (
    <div className="bg-[#16213e] rounded-lg p-4 w-full">
      <div className="flex flex-col items-center justify-center gap-3 py-4">
        <AlertCircle size={24} className="text-[#ff6b6b]" />
        <div className="text-center">
          <p className="text-sm text-gray-300 mb-2">{message}</p>
          <p className="text-xs text-gray-400 mb-4">Game will continue to work offline</p>
        </div>
        <button
          onClick={onRetry}
          className="flex items-center gap-2 bg-[#ff6b6b] hover:bg-[#ff5252] text-white px-4 py-2 rounded-md transition-colors"
        >
          <RefreshCw size={16} />
          <span>Retry Connection</span>
        </button>
      </div>
    </div>
  )
}

export default LeaderboardError
