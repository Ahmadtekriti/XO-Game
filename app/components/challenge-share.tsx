"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Trophy, Copy, Twitter, Facebook, Instagram } from "lucide-react"

interface ChallengeShareProps {
  playerName: string
  currentScore?: number
  onStartChallenge: () => void
}

export const ChallengeShare: React.FC<ChallengeShareProps> = ({ playerName, currentScore, onStartChallenge }) => {
  const [copySuccess, setCopySuccess] = useState(false)
  const [shareType, setShareType] = useState<string | null>(null)

  // Reset copy success message
  useEffect(() => {
    if (copySuccess) {
      const timer = setTimeout(() => {
        setCopySuccess(false)
        setShareType(null)
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [copySuccess])

  // Generate a challenge URL
  const generateChallengeURL = () => {
    // Create a base URL (in a real app, this would be your actual domain)
    const baseURL = window.location.origin || "https://xo-game.vercel.app"

    // Create a challenge message with the player's name
    const challengeMessage = `${playerName} challenges you to a 5-round Tic-Tac-Toe Challenge! Can you beat the AI?`

    // Return the URL with the challenge message and score as query parameters
    return `${baseURL}?challenge=${encodeURIComponent(challengeMessage)}&target=${currentScore || 100}`
  }

  // Share challenge link
  const shareChallengeLink = () => {
    const challengeURL = generateChallengeURL()

    // Try to use the Web Share API if available
    if (navigator.share) {
      navigator
        .share({
          title: "Tic-Tac-Toe Challenge",
          text: `${playerName} challenges you to a Tic-Tac-Toe Challenge!`,
          url: challengeURL,
        })
        .then(() => console.log("Successful share"))
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
        setCopySuccess(true)
        setShareType("challenge")
      })
      .catch((err) => {
        console.error("Failed to copy challenge link: ", err)
      })
  }

  // Share on Twitter
  const shareOnTwitter = () => {
    const text = `I challenge you to beat me in a 5-round Tic-Tac-Toe Challenge! Can you outsmart the AI?`
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(generateChallengeURL())}`
    window.open(url, "_blank")
  }

  // Share on Facebook
  const shareOnFacebook = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(generateChallengeURL())}&quote=${encodeURIComponent(`I challenge you to a 5-round Tic-Tac-Toe Challenge!`)}`
    window.open(url, "_blank")
  }

  // Share on Instagram (copy to clipboard with Instagram-specific message)
  const shareOnInstagram = () => {
    const text = `🎮 Tic-Tac-Toe Challenge 🎮\n\nI challenge you to beat me in a 5-round match against the AI!\n\nClick the link in my bio to play!\n\n#TicTacToe #Gaming #Challenge`

    navigator.clipboard
      .writeText(text)
      .then(() => {
        setCopySuccess(true)
        setShareType("instagram")
      })
      .catch((err) => {
        console.error("Failed to copy Instagram text: ", err)
      })
  }

  return (
    <div className="bg-[#16213e] rounded-lg p-4 w-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold flex items-center gap-2">
          <Trophy size={18} className="text-[#f7d02c]" />
          Challenge Friends
        </h3>
      </div>

      <p className="text-sm text-gray-300 mb-4">
        Challenge your friends to beat your score in a 5-round match against the AI!
      </p>

      <div className="flex flex-col gap-3">
        <button
          onClick={onStartChallenge}
          className="bg-[#f7d02c] text-[#1a1a2e] font-medium py-2 rounded-md hover:bg-[#e6c120] transition-colors flex items-center justify-center gap-2"
        >
          <Trophy size={16} />
          <span>Start Challenge</span>
        </button>

        <div className="text-center text-xs text-gray-400 my-2">- or share directly -</div>

        <button
          onClick={shareChallengeLink}
          className="bg-[#ff5252] text-white font-medium py-2 rounded-md hover:bg-[#ff3838] transition-colors flex items-center justify-center gap-2"
        >
          <Copy size={16} />
          <span>{shareType === "challenge" && copySuccess ? "Challenge Link Copied!" : "Share Challenge Link"}</span>
        </button>

        <div className="grid grid-cols-3 gap-2 mt-2">
          <button
            onClick={shareOnTwitter}
            className="flex items-center justify-center gap-1 bg-[#1DA1F2] hover:bg-[#1a94df] transition-colors py-2 rounded-md"
          >
            <Twitter size={14} />
            <span className="text-xs">Twitter</span>
          </button>

          <button
            onClick={shareOnFacebook}
            className="flex items-center justify-center gap-1 bg-[#4267B2] hover:bg-[#3b5998] transition-colors py-2 rounded-md"
          >
            <Facebook size={14} />
            <span className="text-xs">Facebook</span>
          </button>

          <button
            onClick={shareOnInstagram}
            className="flex items-center justify-center gap-1 bg-gradient-to-br from-[#833AB4] via-[#FD1D1D] to-[#FCAF45] hover:opacity-90 transition-colors py-2 rounded-md"
          >
            <Instagram size={14} />
            <span className="text-xs">{shareType === "instagram" && copySuccess ? "Copied!" : "Instagram"}</span>
          </button>
        </div>
      </div>
    </div>
  )
}
