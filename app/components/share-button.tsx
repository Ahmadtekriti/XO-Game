"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Share2 } from "lucide-react"

interface ShareButtonProps {
  playerName: string
}

export const ShareButton: React.FC<ShareButtonProps> = ({ playerName }) => {
  const [copied, setCopied] = useState(false)

  // Reset copied state after 2 seconds
  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => {
        setCopied(false)
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [copied])

  const handleShare = () => {
    // Generate a challenge URL with the player's name
    const baseURL = window.location.origin || "https://xo-game.vercel.app"
    const challengeMessage = `${playerName} is challenging you to beat them in Tic-Tac-Toe! Can you win?`
    const challengeURL = `${baseURL}?challenge=${encodeURIComponent(challengeMessage)}`

    // Try to use the Web Share API if available
    if (navigator.share) {
      navigator
        .share({
          title: "Tic-Tac-Toe Challenge",
          text: challengeMessage,
          url: challengeURL,
        })
        .catch((error) => {
          console.log("Error sharing:", error)
          // Fall back to clipboard
          copyToClipboard(challengeURL)
        })
    } else {
      // Fall back to clipboard
      copyToClipboard(challengeURL)
    }
  }

  // Helper function to copy to clipboard
  const copyToClipboard = (text: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        setCopied(true)
      })
      .catch((err) => {
        console.error("Failed to copy challenge link: ", err)
      })
  }

  return (
    <button
      onClick={handleShare}
      className="fixed bottom-6 right-6 z-10 bg-[#ff5252] hover:bg-[#ff3838] text-white p-4 rounded-full shadow-lg transition-all transform hover:scale-110 flex items-center justify-center"
      aria-label="Share challenge"
    >
      {copied ? <span className="text-sm whitespace-nowrap px-2">Link copied!</span> : <Share2 size={24} />}
    </button>
  )
}
