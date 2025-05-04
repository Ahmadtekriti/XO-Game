"use client"

import type React from "react"

import { AlertCircle, RefreshCw } from "lucide-react"

interface LeaderboardErrorProps {
  message: string
  onRetry: () => void
}

const LeaderboardError: React.FC<LeaderboardErrorProps> = ({ message, onRetry }) => {
  return (
    <div className="bg-[#16213e] rounded-lg p-3 md:p-4 w-full">
      <div className="flex flex-col items-center justify-center gap-2 md:gap-3 py-3 md:py-4">
        <AlertCircle size={20} className="text-[#ff6b6b]" />
        <div className="text-center">
          <p className="text-xs md:text-sm text-gray-300 mb-1 md:mb-2">{message}</p>
          <p className="text-2xs md:text-xs text-gray-400 mb-3 md:mb-4">Game will continue to work offline</p>
        </div>
        <button
          onClick={onRetry}
          className="flex items-center gap-1 md:gap-2 bg-[#ff6b6b] hover:bg-[#ff5252] text-white px-3 py-1 md:px-4 md:py-2 rounded-md transition-colors text-xs md:text-sm"
        >
          <RefreshCw size={14} />
          <span>Retry Connection</span>
        </button>
      </div>
    </div>
  )
}

export default LeaderboardError
