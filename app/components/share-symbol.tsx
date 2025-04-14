"use client"

import type React from "react"

import { useState, useEffect } from "react"

interface ShareSymbolProps {
  playerName: string
}

export const ShareSymbol: React.FC<ShareSymbolProps> = ({ playerName }) => {
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
    <div className="fixed bottom-6 right-6 z-10 pointer-events-auto">
      {copied ? (
        <div className="text-white text-sm bg-[#16213e] px-3 py-1 rounded-md shadow-lg">Link copied!</div>
      ) : (
        <div
          onClick={handleShare}
          className="w-8 h-8 cursor-pointer hover:opacity-80 transition-all transform hover:scale-110"
          aria-label="Share challenge"
        >
          <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="6" cy="12" r="2.5" fill="white" />
            <circle cx="18" cy="6" r="2.5" fill="white" />
            <circle cx="18" cy="18" r="2.5" fill="white" />
            <path d="M8.59 13.51L15.42 16.49" stroke="white" strokeWidth="1.5" />
            <path d="M15.41 7.51L8.59 10.49" stroke="white" strokeWidth="1.5" />
          </svg>
        </div>
      )}
    </div>
  )
}
