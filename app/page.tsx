"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import {
  Volume2,
  VolumeX,
  Users,
  Cpu,
  Trophy,
  Play,
  RefreshCw,
  Copy,
  Twitter,
  Facebook,
  Instagram,
  Award,
  Edit2,
  Share2,
} from "lucide-react"
import { soundManager } from "./sounds"
import { type Language, languageDirections, getTranslation } from "./translations"
import { LanguageSelector } from "./components/language-selector"
import { AILeaderboard } from "./components/ai-leaderboard"

// Add this import at the top of the file
import { generateScoreImage, dataURLToBlob } from "./utils/generate-score-image"
// Import Supabase functions
import { fetchLeaderboard, saveLeaderboardEntry, type LeaderboardEntry } from "./lib/supabase"

// Add this import at the top of the file
import TestInsert from "./components/test-insert"

// Add the import at the top of the file, with the other imports
// Remove the import statements for the test components
// Remove these lines:
// import SupabaseTest from "./components/supabase-test"
// import SimpleSupabaseTest from "./components/simple-supabase-test"

type GameMode = "ai" | "friend"

export default function TicTacToe() {
  // Language state
  const [language, setLanguage] = useState<Language>("en")

  // Game mode selection
  const [gameMode, setGameMode] = useState<GameMode>("ai")

  // Challenge mode
  const [inChallenge, setInChallenge] = useState(false)
  const [challengeComplete, setChallengeComplete] = useState(false)
  const [finalScore, setFinalScore] = useState(0)

  // Share popup
  const [showSharePopup, setShowSharePopup] = useState(false)
  const [copySuccess, setCopySuccess] = useState(false)
  const [shareType, setShareType] = useState<string | null>(null)

  // Add a new state variable for the share popup
  const [showShareButtonPopup, setShowShareButtonPopup] = useState(false)

  // Player rank
  const [playerRank, setPlayerRank] = useState<number | null>(null)
  const [currentPoints, setCurrentPoints] = useState(0)

  // Round tracking
  const [currentRound, setCurrentRound] = useState(1)
  const totalRounds = 5

  // Time tracking
  const [gameStartTime, setGameStartTime] = useState<number | null>(null)
  const [gameTime, setGameTime] = useState<number | null>(null)
  const [bestTime, setBestTime] = useState<number | null>(null)

  // Timer state
  const [elapsedTime, setElapsedTime] = useState(0)
  const [timerActive, setTimerActive] = useState(false)

  // Player name
  const [playerName, setPlayerName] = useState("You")
  const [friendName, setFriendName] = useState("Friend")
  const [isEditingName, setIsEditingName] = useState(false)
  const [isEditingFriendName, setIsEditingFriendName] = useState(false)
  const nameInputRef = useRef<HTMLInputElement>(null)
  const friendNameInputRef = useRef<HTMLInputElement>(null)
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [isLoadingLeaderboard, setIsLoadingLeaderboard] = useState(true)
  // Add this to the existing state variables in the component
  const [leaderboardError, setLeaderboardError] = useState<string | null>(null)

  // Game state
  const [board, setBoard] = useState(Array(9).fill(null))
  const [currentPlayer, setCurrentPlayer] = useState<"X" | "O">("X")
  const [isComputerTurn, setIsComputerTurn] = useState(false)
  const [gameOver, setGameOver] = useState(false)
  const [winningLine, setWinningLine] = useState<number[] | null>(null)
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [countdown, setCountdown] = useState<number | null>(null)
  const [scores, setScores] = useState({
    player1: 0,
    player2: 0,
    tie: 0,
  })

  // Timer ref for cleanup
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  // Challenge states
  const [challengeMessage, setChallengeMessage] = useState<string>("")
  const [showChallengeModal, setShowChallengeModal] = useState(false)
  const [targetScore, setTargetScore] = useState<number | null>(null)

  // Helper function to get translation
  const t = (key: string, replacements?: Record<string, string | number>) => {
    return getTranslation(language, key, replacements)
  }

  // Update the loadLeaderboard function inside the useEffect
  useEffect(() => {
    async function loadLeaderboard() {
      setIsLoadingLeaderboard(true)
      setLeaderboardError(null)

      try {
        const data = await fetchLeaderboard()
        console.log("Fetched leaderboard data:", data)

        // Ensure each entry has a best_time field
        const processedData = data.map((entry) => {
          // Use any available time field
          const timeValue = entry.best_time || entry.bestTime || entry.time || entry.best_score_time || 0
          return {
            ...entry,
            best_time: timeValue,
          }
        })

        console.log("Processed leaderboard data:", processedData)
        setLeaderboard(processedData)
      } catch (error) {
        console.error("Error loading leaderboard:", error)
        setLeaderboardError("Failed to load leaderboard. Please try again later.")
      } finally {
        setIsLoadingLeaderboard(false)
      }
    }

    loadLeaderboard()
  }, [])

  // Add a retry function
  const retryLoadLeaderboard = () => {
    async function loadLeaderboard() {
      setIsLoadingLeaderboard(true)
      setLeaderboardError(null)

      try {
        const data = await fetchLeaderboard()

        // Ensure each entry has a best_time field
        const processedData = data.map((entry) => {
          // Use any available time field
          const timeValue = entry.best_time || entry.bestTime || entry.time || entry.best_score_time || 0
          return {
            ...entry,
            best_time: timeValue,
          }
        })

        setLeaderboard(processedData)
      } catch (error) {
        console.error("Error loading leaderboard:", error)
        setLeaderboardError("Failed to load leaderboard. Please try again later.")
      } finally {
        setIsLoadingLeaderboard(false)
      }
    }

    loadLeaderboard()
  }

  // Start game timer when making first move
  useEffect(() => {
    if (board.some((cell) => cell !== null) && gameStartTime === null && !gameOver) {
      setGameStartTime(Date.now())
    }
  }, [board, gameStartTime, gameOver])

  // Focus input when editing starts
  useEffect(() => {
    if (isEditingName && nameInputRef.current) {
      nameInputRef.current.focus()
    }
  }, [isEditingName])

  // Focus friend input when editing starts
  useEffect(() => {
    if (isEditingFriendName && friendNameInputRef.current) {
      friendNameInputRef.current.focus()
    }
  }, [isEditingFriendName])

  // Update player rank when leaderboard changes
  useEffect(() => {
    if (leaderboard.length > 0) {
      const playerIndex = leaderboard.findIndex((entry) => entry.name === playerName)
      if (playerIndex !== -1) {
        setPlayerRank(playerIndex + 1)
        setCurrentPoints(leaderboard[playerIndex].score)
      } else {
        setPlayerRank(null)
        setCurrentPoints(0)
      }
    } else {
      setPlayerRank(null)
      setCurrentPoints(0)
    }
  }, [leaderboard, playerName])

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

  // Check for challenge parameters in URL
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search)
      const challengeParam = params.get("challenge")
      const targetParam = params.get("target")

      if (challengeParam) {
        // Show a welcome message with the challenge
        setChallengeMessage(decodeURIComponent(challengeParam))
        if (targetParam) {
          setTargetScore(Number.parseInt(targetParam, 10))
        }
        setShowChallengeModal(true)
      }
    }
  }, [])

  // Handle document click to close name editing
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isEditingName && nameInputRef.current && !nameInputRef.current.contains(event.target as Node)) {
        endNameEditing()
      }
      if (
        isEditingFriendName &&
        friendNameInputRef.current &&
        !friendNameInputRef.current.contains(event.target as Node)
      ) {
        endFriendNameEditing()
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isEditingName, isEditingFriendName])

  // Start name editing
  const startNameEditing = () => {
    setIsEditingName(true)
  }

  // End name editing
  const endNameEditing = () => {
    setIsEditingName(false)
    // Ensure name is not empty
    if (!playerName.trim()) {
      setPlayerName("You")
    }
  }

  // Start friend name editing
  const startFriendNameEditing = () => {
    if (gameMode === "friend") {
      setIsEditingFriendName(true)
    }
  }

  // End friend name editing
  const endFriendNameEditing = () => {
    setIsEditingFriendName(false)
    // Ensure name is not empty
    if (!friendName.trim()) {
      setFriendName("Friend")
    }
  }

  // Handle name input key press
  const handleNameKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      endNameEditing()
    }
  }

  // Handle friend name input key press
  const handleFriendNameKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      endFriendNameEditing()
    }
  }

  // Copy score to clipboard with image
  const copyScoreToClipboard = async () => {
    try {
      const scoreText = `I scored ${finalScore} points in Tic-Tac-Toe Challenge! ${scores.player1} wins, ${scores.tie} ties, ${scores.player2} losses in ${formatTimer(elapsedTime)}. Can you beat that?`

      // Generate score image
      const scoreImage = await generateScoreImage(
        playerName,
        finalScore,
        scores.player1,
        scores.tie,
        scores.player2,
        formatTimer(elapsedTime),
      )

      // Try to use the Clipboard API with images if available
      if (navigator.clipboard && typeof ClipboardItem !== "undefined") {
        try {
          const blob = dataURLToBlob(scoreImage)
          const baseURL = window.location.origin || "https://xo-game.vercel.app"
          const challengeURL = `${baseURL}?challenge=${encodeURIComponent(scoreText)}`

          // Create a ClipboardItem with both text and image
          const clipboardContent = new ClipboardItem({
            "text/plain": new Blob([`${scoreText}\n\nPlay here: ${challengeURL}`], { type: "text/plain" }),
            [blob.type]: blob,
          })

          await navigator.clipboard.write([clipboardContent])
          setCopySuccess(true)
          setShareType("clipboard")
        } catch (err) {
          console.error("Failed to copy with image: ", err)
          // Fall back to text-only copy
          fallbackToTextCopy(scoreText)
        }
      } else {
        // Fall back to text-only copy
        fallbackToTextCopy(scoreText)
      }
    } catch (error) {
      console.error("Error in copyScoreToClipboard:", error)
      fallbackToTextCopy(`I scored ${finalScore} points in Tic-Tac-Toe Challenge! Can you beat that?`)
    }
  }

  // Fallback function for text-only copy
  const fallbackToTextCopy = (text: string) => {
    const baseURL = window.location.origin || "https://xo-game.vercel.app"
    const challengeURL = `${baseURL}?challenge=${encodeURIComponent(text)}`

    navigator.clipboard
      .writeText(`${text}\n\nPlay here: ${challengeURL}`)
      .then(() => {
        setCopySuccess(true)
        setShareType("clipboard")
      })
      .catch((err) => {
        console.error("Failed to copy: ", err)
      })
  }

  // Share on social media with image
  const shareOnSocialMedia = async (platform: "twitter" | "facebook" | "instagram" | "tiktok") => {
    try {
      // Generate score image
      const scoreImage = await generateScoreImage(
        playerName,
        finalScore,
        scores.player1,
        scores.tie,
        scores.player2,
        formatTimer(elapsedTime),
      )

      const baseURL = window.location.origin || "https://xo-game.vercel.app"
      const scoreText = `I scored ${finalScore} points in Tic-Tac-Toe Challenge! ${scores.player1} wins, ${scores.tie} ties, ${scores.player2} losses in ${formatTimer(elapsedTime)}. Can you beat that?`
      const challengeURL = `${baseURL}?challenge=${encodeURIComponent(scoreText)}`

      // Create a temporary link to download the image for platforms that don't support direct image sharing
      const downloadImage = () => {
        const link = document.createElement("a")
        link.href = scoreImage
        link.download = `tictactoe-score-${playerName}.png`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      }

      switch (platform) {
        case "twitter":
          // Twitter doesn't support direct image upload via URL, so we'll just share text and URL
          window.open(
            `https://twitter.com/intent/tweet?text=${encodeURIComponent(scoreText)}&url=${encodeURIComponent(challengeURL)}`,
            "_blank",
          )
          // Offer image download
          downloadImage()
          break

        case "facebook":
          // Facebook sharing
          window.open(
            `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(challengeURL)}&quote=${encodeURIComponent(scoreText)}`,
            "_blank",
          )
          // Offer image download
          downloadImage()
          break

        case "instagram":
        case "tiktok":
          // For Instagram and TikTok, we'll download the image and copy text
          downloadImage()

          const platformText =
            platform === "instagram"
              ? `🎮 Tic-Tac-Toe Challenge Results 🎮\n\nScore: ${finalScore} points\nWins: ${scores.player1} | Ties: ${scores.tie} | Losses: ${scores.player2}\nTime: ${formatTimer(elapsedTime)}\n\nPlay here: ${challengeURL}\n\n#TicTacToe #Gaming #Challenge`
              : `Just scored ${finalScore} points in the Tic-Tac-Toe Challenge! 🎮\n${scores.player1} wins, ${scores.tie} ties, ${scores.player2} losses in ${formatTimer(elapsedTime)}.\nCan you beat my score? Play here: ${challengeURL}\n\n#TicTacToe #GamingChallenge #BeatsMyScore`

          navigator.clipboard
            .writeText(platformText)
            .then(() => {
              setCopySuccess(true)
              setShareType(platform)
            })
            .catch((err) => {
              console.error(`Failed to copy ${platform} text: `, err)
            })
          break
      }
    } catch (error) {
      console.error(`Error in shareOn${platform.charAt(0).toUpperCase() + platform.slice(1)}:`, error)
    }
  }

  // Generate a challenge URL with more details
  const generateChallengeURL = () => {
    // Create a base URL (in a real app, this would be your actual domain)
    const baseURL = window.location.origin || "https://xo-game.vercel.app"

    // Create a challenge message with the player's name, score, and stats
    let challengeMessage

    if (challengeComplete) {
      // If challenge is complete, share the final results
      challengeMessage = `${playerName} challenges you to beat their score of ${finalScore} points in a 5-round Tic-Tac-Toe Challenge! (${scores.player1} wins, ${scores.tie} ties, ${scores.player2} losses in ${formatTimer(elapsedTime)})`
    } else if (inChallenge) {
      // If challenge is in progress, share the current progress
      challengeMessage = `${playerName} challenges you to a 5-round Tic-Tac-Toe Challenge! They're currently at Round ${currentRound} with ${scores.player1} wins, ${scores.tie} ties, and ${scores.player2} losses.`
    } else {
      // Default challenge message
      challengeMessage = `${playerName} challenges you to a 5-round Tic-Tac-Toe Challenge! Can you beat the AI?`
    }

    // Return the URL with the challenge message and score as query parameters
    return `${baseURL}?challenge=${encodeURIComponent(challengeMessage)}&target=${finalScore || 100}`
  }

  // Update the share challenge link function
  const shareChallengeLink = () => {
    // Show the share popup instead of immediately sharing
    setShowShareButtonPopup(true)
  }

  // Handle the actual sharing after popup is shown
  const handleShare = async (method: "clipboard" | "webshare" | "twitter" | "facebook" | "instagram") => {
    try {
      // Generate a challenge URL with the player's name
      const baseURL = window.location.origin || "https://xo-game.vercel.app"

      // Create bilingual challenge messages
      const arabicChallenge = `${playerName} يتحداك للفوز في لعبة إكس-أو! هل يمكنك الفوز؟`
      const englishChallenge = `${playerName} challenges you to beat them in Tic-Tac-Toe! Can you win?`
      const bilingualChallenge = `${arabicChallenge}\n\n${englishChallenge}`

      const challengeURL = `${baseURL}?challenge=${encodeURIComponent(bilingualChallenge)}`

      // Generate score image if in challenge mode
      let scoreImage = ""
      if (inChallenge || challengeComplete) {
        scoreImage = await generateScoreImage(
          playerName,
          finalScore || currentPoints,
          scores.player1,
          scores.tie,
          scores.player2,
          formatTimer(elapsedTime),
        )
      }

      switch (method) {
        case "clipboard":
        default:
          // Create a bilingual full text with both Arabic and English
          const arabicFullText = `${arabicChallenge} العب هنا: ${challengeURL}`
          const englishFullText = `${englishChallenge} Play here: ${challengeURL}`
          const bilingualFullText = `${arabicFullText}\n\n${englishFullText}`

          if (scoreImage && (inChallenge || challengeComplete)) {
            // Try to copy with image if available
            try {
              const blob = dataURLToBlob(scoreImage)

              if (navigator.clipboard && typeof ClipboardItem !== "undefined") {
                const clipboardContent = new ClipboardItem({
                  "text/plain": new Blob([bilingualFullText], { type: "text/plain" }),
                  [blob.type]: blob,
                })

                await navigator.clipboard.write([clipboardContent])
                setCopySuccess(true)
                setShareType("challenge")
              } else {
                // Fall back to text-only copy
                navigator.clipboard
                  .writeText(bilingualFullText)
                  .then(() => {
                    setCopySuccess(true)
                    setShareType("challenge")
                  })
                  .catch((err) => {
                    console.error("Failed to copy challenge link: ", err)
                    fallbackClipboardCopy(bilingualFullText)
                  })

                // Offer image download
                const link = document.createElement("a")
                link.href = scoreImage
                link.download = `tictactoe-challenge-${playerName}.png`
                document.body.appendChild(link)
                link.click()
                document.body.removeChild(link)
              }
            } catch (err) {
              console.error("Failed to copy with image: ", err)
              fallbackClipboardCopy(bilingualFullText)
            }
          } else {
            // Text-only copy
            navigator.clipboard
              .writeText(bilingualFullText)
              .then(() => {
                setCopySuccess(true)
                setShareType("challenge")
              })
              .catch((err) => {
                console.error("Failed to copy challenge link: ", err)
                fallbackClipboardCopy(bilingualFullText)
              })
          }
          break

        case "twitter":
          // Twitter has character limits, so we'll use just English with a hint of Arabic
          const twitterText = `${arabicChallenge} | ${englishChallenge}`
          window.open(
            `https://twitter.com/intent/tweet?text=${encodeURIComponent(twitterText)}&url=${encodeURIComponent(challengeURL)}`,
            "_blank",
          )

          // If we have a score image, offer it for download
          if (scoreImage && (inChallenge || challengeComplete)) {
            const link = document.createElement("a")
            link.href = scoreImage
            link.download = `tictactoe-challenge-${playerName}.png`
            document.body.appendChild(link)
            document.body.removeChild(link)
          }
          break

        case "facebook":
          // Facebook can handle more text
          const fbText = `${arabicChallenge}\n\n${englishChallenge}`
          window.open(
            `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(challengeURL)}&quote=${encodeURIComponent(fbText)}`,
            "_blank",
          )

          // If we have a score image, offer it for download
          if (scoreImage && (inChallenge || challengeComplete)) {
            const link = document.createElement("a")
            link.href = scoreImage
            link.download = `tictactoe-challenge-${playerName}.png`
            document.body.appendChild(link)
            document.body.removeChild(link)
          }
          break

        case "instagram":
          // For Instagram, include both languages and hashtags in both languages
          const instaText = `${arabicChallenge}\n\n${englishChallenge}\n\nالعب هنا | Play here: ${challengeURL}\n\n#XO #تحدي #لعبة #TicTacToe #Gaming #Challenge`

          navigator.clipboard
            .writeText(instaText)
            .then(() => {
              setCopySuccess(true)
              setShareType("instagram")
            })
            .catch((err) => {
              console.error("Failed to copy Instagram text: ", err)
            })

          // If we have a score image, offer it for download
          if (scoreImage && (inChallenge || challengeComplete)) {
            const link = document.createElement("a")
            link.href = scoreImage
            link.download = `tictactoe-challenge-${playerName}.png`
            document.body.appendChild(link)
            document.body.removeChild(link)
          }
          break

        case "webshare":
          if (navigator.share) {
            const shareData: any = {
              title: "Tic-Tac-Toe Challenge | تحدي إكس-أو",
              text: bilingualChallenge,
              url: challengeURL,
            }

            // Try to add image to share if available
            if (scoreImage && (inChallenge || challengeComplete)) {
              try {
                const blob = dataURLToBlob(scoreImage)
                const file = new File([blob], `tictactoe-challenge-${playerName}.png`, { type: blob.type })
                shareData.files = [file]
              } catch (err) {
                console.error("Failed to add image to share: ", err)
              }
            }

            navigator.share(shareData).catch((error) => {
              console.log("Error sharing:", error)
            })
          }
          break
      }

      // Close the popup after a short delay
      setTimeout(() => {
        setShowShareButtonPopup(false)
      }, 500)
    } catch (error) {
      console.error("Error in handleShare:", error)
    }
  }

  // Fallback clipboard copy function
  const fallbackClipboardCopy = (text: string) => {
    // Fallback for older browsers
    const textArea = document.createElement("textarea")
    textArea.value = text
    document.body.appendChild(textArea)
    textArea.focus()
    textArea.select()
    try {
      document.execCommand("copy")
      setCopySuccess(true)
      setShareType("challenge")
    } catch (e) {
      console.error("Fallback clipboard copy failed:", e)
    }
    document.body.removeChild(textArea)
  }

  // Add a new function to handle direct friend challenges
  // Add this after the shareChallengeLink function
  const challengeFriends = () => {
    // If not in challenge mode or challenge not complete, start a new challenge
    if (!inChallenge && !challengeComplete) {
      startChallenge()
      return
    }

    // If challenge is in progress but not complete, show a confirmation
    if (inChallenge && !challengeComplete) {
      if (
        window.confirm(
          "Challenge in progress. Do you want to share your current progress or complete the challenge first?",
        )
      ) {
        shareChallengeLink()
      }
      return
    }

    // If challenge is complete, share the results
    shareChallengeLink()
  }

  // Calculate score using the updated formula with higher time penalty:
  // (Wins×100) + (Ties×50) - (Losses×50) - (Time×1.5)
  const calculateChallengeScore = (wins: number, ties: number, losses: number, timeInSeconds: number) => {
    console.log(`Calculating score with: Wins=${wins}, Ties=${ties}, Losses=${losses}, Time=${timeInSeconds}`)
    const score = wins * 100 + ties * 50 - losses * 50 - timeInSeconds * 1.5
    console.log(`Raw score: ${score}, Rounded: ${Math.round(score)}`)
    return Math.round(score) // Round to nearest whole number
  }

  // Start a 5-round challenge
  const startChallenge = () => {
    // Reset scores and game state
    setScores({
      player1: 0,
      player2: 0,
      tie: 0,
    })
    setCurrentRound(1)
    setInChallenge(true)
    setChallengeComplete(false)
    setFinalScore(0)
    setElapsedTime(0)
    setTimerActive(true)
    // Reset current points display
    setCurrentPoints(0)
    startNewGame()
  }

  // Reset the current challenge
  const resetChallenge = () => {
    // Clear any existing timers
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }

    // Reset timer
    setElapsedTime(0)
    setTimerActive(true)

    // Reset all score-related states
    setScores({
      player1: 0,
      player2: 0,
      tie: 0,
    })
    setCurrentPoints(0)
    setFinalScore(0)
    setCurrentRound(1)
    setInChallenge(true)
    setChallengeComplete(false)

    // Reset game state
    startNewGame()
  }

  // Update leaderboard with new win
  const updateLeaderboard = async (winner: string) => {
    // Only update leaderboard for AI mode
    if (gameMode === "ai") {
      const currentTime = gameTime || 0

      // Find existing entry in local state
      const existingEntry = leaderboard.find((entry) => entry.name === playerName && entry.mode === "ai")

      // Prepare the updated entry data
      let newWins = winner === "X" ? 1 : 0
      let newLosses = winner === "O" ? 1 : 0
      let newTies = 0
      let newBestTime = winner === "X" ? currentTime : 0

      if (existingEntry) {
        newWins = winner === "X" ? existingEntry.wins + 1 : existingEntry.wins
        newLosses = winner === "O" ? existingEntry.losses + 1 : existingEntry.losses
        newTies = existingEntry.ties
        newBestTime =
          winner === "X" && (existingEntry.best_time > currentTime || existingEntry.best_time === 0)
            ? currentTime
            : existingEntry.best_time
      }

      const newScore = calculateChallengeScore(newWins, newTies, newLosses, currentTime / 1000)

      // Create the entry to save to Supabase
      const entryToSave: LeaderboardEntry = {
        name: playerName,
        wins: newWins,
        losses: newLosses,
        ties: newTies,
        score: newScore,
        best_time: newBestTime,
        mode: "ai",
      }

      // Save to Supabase
      try {
        const savedEntry = await saveLeaderboardEntry(entryToSave)

        // Refresh the leaderboard
        const updatedLeaderboard = await fetchLeaderboard()
        setLeaderboard(updatedLeaderboard)
      } catch (error) {
        console.error("Error updating leaderboard:", error)

        // Update local state as fallback
        if (existingEntry) {
          setLeaderboard((prev) =>
            prev
              .map((entry) => {
                if (entry.name === playerName && entry.mode === "ai") {
                  return {
                    ...entry,
                    wins: newWins,
                    losses: newLosses,
                    score: newScore,
                    best_time: newBestTime,
                  }
                }
                return entry
              })
              .sort((a, b) => b.score - a.score),
          )
        } else {
          setLeaderboard((prev) => [...prev, entryToSave].sort((a, b) => b.score - a.score))
        }
      }
    }
  }

  // Change game mode
  const changeGameMode = (mode: GameMode) => {
    if (mode === gameMode) return

    // Always reset challenge state when changing modes
    setInChallenge(false)
    setChallengeComplete(false)

    setGameMode(mode)
    startNewGame()
    setScores({
      player1: 0,
      player2: 0,
      tie: 0,
    })
    setCurrentRound(1)
  }

  // Play sound helper using the SoundManager
  const playSound = (soundType: "x" | "o" | "win" | "draw") => {
    if (!soundEnabled) return

    try {
      switch (soundType) {
        case "x":
          soundManager.playXSound()
          break
        case "o":
          soundManager.playOSound()
          break
        case "win":
          soundManager.playWinSound()
          break
        case "draw":
          soundManager.playDrawSound()
          break
      }
    } catch (e) {
      console.log("Error playing sound:", e)
    }
  }

  // Toggle sound
  const toggleSound = () => {
    setSoundEnabled(!soundEnabled)
  }

  // Check for winner
  const checkWinner = (board: (string | null)[]) => {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8], // Rows
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8], // Columns
      [0, 4, 8],
      [2, 4, 6], // Diagonals
    ]

    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i]
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        setWinningLine(lines[i])
        return board[a]
      }
    }

    // Check for tie
    if (!board.includes(null)) {
      return "tie"
    }

    return null
  }

  // Handle player move
  const handleCellClick = (index: number) => {
    // Don't allow moves if cell is filled or game is over
    if (board[index] || gameOver) return

    // In AI mode, don't allow moves during computer's turn
    if (gameMode === "ai" && isComputerTurn) return

    const newBoard = [...board]
    newBoard[index] = currentPlayer
    setBoard(newBoard)
    playSound(currentPlayer.toLowerCase() as "x" | "o")

    const winner = checkWinner(newBoard)
    if (winner) {
      handleGameEnd(winner)
    } else {
      if (gameMode === "ai") {
        setIsComputerTurn(true)
      } else {
        // Switch player in friend mode
        setCurrentPlayer(currentPlayer === "X" ? "O" : "X")
      }
    }
  }

  // Find a winning move for the given player
  const findWinningMove = (currentBoard: (string | null)[], player: string) => {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8], // Rows
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8], // Columns
      [0, 4, 8],
      [2, 4, 6], // Diagonals
    ]

    for (const line of lines) {
      const [a, b, c] = line
      // Check if there are two of the player's symbols and one empty cell
      const cells = [currentBoard[a], currentBoard[b], currentBoard[c]]
      const playerCount = cells.filter((cell) => cell === player).length
      const nullCount = cells.filter((cell) => cell === null).length

      if (playerCount === 2 && nullCount === 1) {
        // Find the empty cell and return its index
        if (currentBoard[a] === null) return a
        if (currentBoard[b] === null) return b
        if (currentBoard[c] === null) return c
      }
    }

    return -1 // No winning move found
  }

  // Find the best move for AI
  const findBestMove = (currentBoard: (string | null)[]) => {
    // 1. Try to win: Check if AI can win in the next move
    const winningMove = findWinningMove(currentBoard, "O")
    if (winningMove !== -1) return winningMove

    // 2. Block: Check if player can win in the next move and block it
    const blockingMove = findWinningMove(currentBoard, "X")

    if (blockingMove !== -1) return blockingMove

    // 3. Take center if available
    if (currentBoard[4] === null) return 4

    // 4. Take corners if available
    const corners = [0, 2, 6, 8]
    const availableCorners = corners.filter((corner) => currentBoard[corner] === null)
    if (availableCorners.length > 0) {
      return availableCorners[Math.floor(Math.random() * availableCorners.length)]
    }

    // 5. Take any available side
    const sides = [1, 3, 5, 7]
    const availableSides = sides.filter((side) => currentBoard[side] === null)
    if (availableSides.length > 0) {
      return availableSides[Math.floor(Math.random() * availableSides.length)]
    }

    // 6. Fallback to random move (should never reach here with the above strategy)
    const emptyCells = currentBoard
      .map((cell, index) => (cell === null ? index : null))
      .filter((index) => index !== null) as number[]

    return emptyCells[Math.floor(Math.random() * emptyCells.length)]
  }

  // Computer move
  useEffect(() => {
    if (gameMode === "ai" && isComputerTurn && !gameOver) {
      const timeoutId = setTimeout(() => {
        makeComputerMove()
      }, 600)

      return () => clearTimeout(timeoutId)
    }
  }, [isComputerTurn, gameOver, gameMode])

  // Auto restart countdown
  useEffect(() => {
    // Only start countdown when game is over and no countdown is active
    if (gameOver && countdown === null) {
      console.log("Starting countdown from 4")
      setCountdown(4)
      return
    }

    // Handle countdown ticking
    if (countdown !== null) {
      // Clear any existing timer first
      if (timerRef.current) {
        clearTimeout(timerRef.current)
        timerRef.current = null
      }

      if (countdown > 0) {
        console.log(`Countdown: ${countdown}`)
        // Set up next countdown tick
        timerRef.current = setTimeout(() => {
          setCountdown(countdown - 1)
        }, 1000)
      } else {
        console.log("Countdown reached 0, proceeding to next action")
        // Countdown reached zero, proceed to next action
        handleCountdownComplete()
      }
    }

    // Cleanup function
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
        timerRef.current = null
      }
    }
  }, [gameOver, countdown])

  // Separate function to handle countdown completion
  const handleCountdownComplete = () => {
    console.log("Handling countdown completion")
    // Clear the timer reference
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }

    // Reset countdown state
    setCountdown(null)

    // Start new game when countdown reaches 0
    if (inChallenge && currentRound < totalRounds) {
      console.log(`Starting round ${currentRound + 1}`)
      // Start next round
      startNextRound()
    } else if (inChallenge && currentRound >= totalRounds) {
      console.log("Challenge complete, calculating final score")
      // Challenge complete
      setTimerActive(false) // Stop the timer

      // Calculate final score using the new formula
      const finalScore = calculateChallengeScore(
        scores.player1, // wins
        scores.tie, // ties
        scores.player2, // losses
        elapsedTime, // time in seconds
      )

      console.log(
        `Score calculation: Wins: ${scores.player1}, Ties: ${scores.tie}, Losses: ${scores.player2}, Time: ${elapsedTime}`,
      )
      console.log(`Final score calculated: ${finalScore}`)

      setFinalScore(finalScore)
      setChallengeComplete(true)
      setInChallenge(false)

      // Update leaderboard with final challenge score
      if (gameMode === "ai") {
        updateLeaderboardWithFinalScore(finalScore)
      }

      // Show share popup
      setShowSharePopup(true)

      // Don't reset scores until the user closes the popup
      // This ensures the share popup shows the correct statistics
    } else {
      console.log("Starting new game")
      // Reset game after all rounds
      startNewGame()
      setCurrentRound(1)
    }
  }

  // Function to update leaderboard with final score
  const updateLeaderboardWithFinalScore = async (finalScore: number) => {
    try {
      console.log("Updating leaderboard with final score:", finalScore)
      console.log("Current game stats - Wins:", scores.player1, "Ties:", scores.tie, "Losses:", scores.player2)

      // Create the entry to save to Supabase with better error handling
      const entryToSave: LeaderboardEntry = {
        name: playerName,
        wins: scores.player1,
        losses: scores.player2,
        ties: scores.tie,
        score: finalScore,
        mode: "ai",
      }

      // Add time data with multiple field names for compatibility
      const timeInMs = elapsedTime * 1000 || 0
      entryToSave.best_time = timeInMs
      entryToSave.bestTime = timeInMs
      entryToSave.best_score_time = timeInMs
      // Don't include 'time' field as it doesn't exist in the schema

      console.log("Prepared entry to save:", entryToSave)

      // Save to Supabase
      const savedEntry = await saveLeaderboardEntry(entryToSave)
      console.log("Save result:", savedEntry)

      // Refresh the leaderboard
      console.log("Refreshing leaderboard data")
      const updatedLeaderboard = await fetchLeaderboard()
      setLeaderboard(updatedLeaderboard)
      console.log("Leaderboard updated with", updatedLeaderboard.length, "entries")
    } catch (error) {
      console.error("Error updating leaderboard with final score:", error)

      // Update local state as fallback
      const existingEntry = leaderboard.find((entry) => entry.name === playerName && entry.mode === "ai")

      if (existingEntry) {
        setLeaderboard((prev) =>
          prev
            .map((entry) => {
              if (entry.name === playerName && entry.mode === "ai") {
                // Only update if this score is better
                if (finalScore > entry.score) {
                  return {
                    ...entry,
                    wins: scores.player1,
                    losses: scores.player2,
                    ties: scores.tie,
                    score: finalScore,
                    best_time: elapsedTime * 1000, // Convert to ms for consistency
                  }
                }
                return entry
              }
              return entry
            })
            .sort((a, b) => b.score - a.score),
        )
      } else {
        // Add new entry to leaderboard
        const newEntry: LeaderboardEntry = {
          name: playerName,
          wins: scores.player1,
          losses: scores.player2,
          ties: scores.tie,
          score: finalScore,
          best_time: elapsedTime * 1000 || 0, // Ensure we're setting a value even if it's 0
          mode: "ai",
        }
        setLeaderboard((prev) => [...prev, newEntry].sort((a, b) => b.score - a.score))
      }
    }
  }

  // Make computer move
  const makeComputerMove = () => {
    const emptyCells = board
      .map((cell, index) => (cell === null ? index : null))
      .filter((index) => index !== null) as number[]

    if (emptyCells.length === 0) return

    let bestMove: number

    // 70% chance to make the optimal move, 30% chance to make a random move
    // But always make the optimal move if it's a winning move or a blocking move
    const winningMove = findWinningMove(board, "O")
    const blockingMove = findWinningMove(board, "X")

    if (winningMove !== -1) {
      // Always take a winning move
      bestMove = winningMove
    } else if (blockingMove !== -1) {
      // Always block player's winning move
      bestMove = blockingMove
    } else if (Math.random() < 0.3) {
      // 30% chance to make a random move instead of the optimal one
      bestMove = emptyCells[Math.floor(Math.random() * emptyCells.length)]
    } else {
      // Otherwise make the strategic move
      bestMove = findBestMove(board)
    }

    const newBoard = [...board]
    newBoard[bestMove] = "O"
    setBoard(newBoard)
    playSound("o")
    setIsComputerTurn(false)

    const winner = checkWinner(newBoard)
    if (winner) {
      handleGameEnd(winner)
    }
  }

  // Handle game end
  const handleGameEnd = (result: string) => {
    // Don't process if already in game over state
    if (gameOver) {
      console.log("Game already over, ignoring handleGameEnd call")
      return
    }

    console.log(`Game ended with result: ${result}`)
    setGameOver(true)

    // Stop timer if challenge is complete
    if (inChallenge && currentRound >= totalRounds) {
      setTimerActive(false)
    }

    // Calculate game time
    if (gameStartTime !== null) {
      const endTime = Date.now()
      const timeTaken = endTime - gameStartTime
      setGameTime(timeTaken)

      // Update best time if this is faster
      if (bestTime === null || timeTaken < bestTime) {
        setBestTime(timeTaken)
      }
    }

    if (result === "X") {
      setScores((prev) => ({ ...prev, player1: prev.player1 + 1 }))
      if (gameMode === "ai" && !inChallenge) {
        updateLeaderboard("X")
      }
      playSound("win")
    } else if (result === "O") {
      setScores((prev) => ({ ...prev, player2: prev.player2 + 1 }))
      if (gameMode === "ai" && !inChallenge) {
        updateLeaderboard("O")
      }
      playSound("win")
    } else if (result === "tie") {
      setScores((prev) => ({ ...prev, tie: prev.tie + 1 }))
      playSound("draw")
    }
  }

  // Start next round
  const startNextRound = () => {
    console.log("Starting next round")
    // Clear any existing timers first
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }

    // Reset game state for next round
    setBoard(Array(9).fill(null))
    setCurrentPlayer("X")
    setIsComputerTurn(false)
    setGameOver(false)
    setWinningLine(null)
    setGameStartTime(null)
    setGameTime(null)

    // Increment round counter
    setCurrentRound((prev) => prev + 1)

    // Timer continues running between rounds
    console.log("Next round setup complete")
  }

  // Start new game
  const startNewGame = () => {
    console.log("Starting new game")
    // Clear any existing timers
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }

    // Reset all game state
    setBoard(Array(9).fill(null))
    setCurrentPlayer("X")
    setIsComputerTurn(false)
    setGameOver(false)
    setWinningLine(null)
    setCountdown(null)
    setGameStartTime(null)
    setGameTime(null)

    console.log("New game setup complete")
  }

  // Format time in seconds
  const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000)
    const tenths = Math.floor((ms % 1000) / 100)
    return `${seconds}.${tenths}s`
  }

  // Check if cell is in winning line
  const isWinningCell = (index: number) => {
    return winningLine !== null && winningLine.includes(index)
  }

  // Skip countdown and proceed to next round immediately
  const skipCountdown = () => {
    // Clear any existing timers
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }

    // Reset countdown state
    setCountdown(null)

    // Proceed to next action immediately
    handleCountdownComplete()
  }

  // Get game status message
  const getStatusMessage = () => {
    if (challengeComplete) {
      return (
        <div className="flex flex-col items-center">
          <div className="text-2xl font-bold mb-2">{t("challenge_complete")}</div>
          <div className="text-xl">
            {t("final_score")}:{" "}
            <span className={finalScore > 0 ? "text-[#4ecdc4]" : "text-[#ff6b6b]"}>{finalScore}</span>
          </div>
        </div>
      )
    }

    if (gameOver) {
      if (countdown !== null) {
        let winMessage = t("draw")

        if (winningLine) {
          const winner = board[winningLine[0]]
          if (winner === "X") {
            winMessage = t("you_win")
          } else {
            winMessage = gameMode === "ai" ? t("ai_wins") : t("friend_wins")
          }
        }

        const nextMessage =
          inChallenge && currentRound < totalRounds
            ? t("next_round", { round: currentRound + 1, countdown })
            : inChallenge && currentRound >= totalRounds
              ? t("calculating_score", { countdown })
              : t("new_game", { countdown })

        return (
          <div className="flex flex-col items-center">
            <div>{winMessage}</div>
            <div className="text-sm mt-2 text-gray-400">{nextMessage}</div>
            <button
              onClick={skipCountdown}
              className="mt-4 px-4 py-2 bg-[#f7d02c] text-[#1a1a2e] rounded-md font-medium hover:bg-[#e6c120] transition-colors"
            >
              {inChallenge && currentRound < totalRounds ? t("next_round_button") : t("skip_countdown")}
            </button>
          </div>
        )
      }

      if (winningLine) {
        const winner = board[winningLine[0]]
        if (winner === "X") {
          return t("you_win")
        } else {
          return gameMode === "ai" ? t("ai_wins") : t("friend_wins")
        }
      }

      return t("draw")
    }

    if (inChallenge) {
      return (
        <div className="flex flex-col items-center">
          <div className="text-sm text-[#4ecdc4] mb-1">{t("challenge_mode")}</div>
          {gameMode === "ai"
            ? isComputerTurn
              ? t("ai_thinking")
              : t("your_turn")
            : currentPlayer === "X"
              ? t("your_turn")
              : t("friends_turn")}
        </div>
      )
    }

    if (gameMode === "ai") {
      return isComputerTurn ? t("ai_thinking") : t("your_turn")
    } else {
      return currentPlayer === "X" ? t("your_turn") : t("friends_turn")
    }
  }

  // Render X symbol
  const renderX = (index: number) => (
    <svg
      viewBox="0 0 100 100"
      className={`w-full h-full mx-auto transition-all duration-300 ${isWinningCell(index) ? "scale-110 text-[#ff6b6b] animate-pulse" : "text-[#ff6b6b]"}`}
    >
      <line
        x1="20"
        y1="20"
        x2="80"
        y2="80"
        stroke="currentColor"
        strokeWidth="12"
        strokeLinecap="round"
        className="animate-draw-line"
      />
      <line
        x1="80"
        y1="20"
        x2="20"
        y2="80"
        stroke="currentColor"
        strokeWidth="12"
        strokeLinecap="round"
        className="animate-draw-line-delayed"
      />
    </svg>
  )

  // Render O symbol
  const renderO = (index: number) => (
    <svg
      viewBox="0 0 100 100"
      className={`w-full h-full mx-auto transition-all duration-300 ${isWinningCell(index) ? "scale-110 animate-pulse" : ""}`}
    >
      <circle cx="50" cy="50" r="30" stroke="#4ecdc4" strokeWidth="12" fill="none" className="animate-draw-circle" />
    </svg>
  )

  // Format timer display
  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    if (timerActive) {
      interval = setInterval(() => {
        setElapsedTime((prev) => prev + 1)
      }, 1000)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [timerActive])

  // Main game UI
  return (
    <div
      className="min-h-screen flex flex-col bg-[#1a1a2e] text-white relative overflow-hidden p-4 pt-16 md:pt-24 justify-center"
      dir={languageDirections[language]}
    >
      {/* Remove the test components from the JSX
Remove these sections:
{/* Simple Supabase Test */}
      {/* <div className="fixed top-20 left-4 right-4 z-50 max-w-md mx-auto">
  <SimpleSupabaseTest />
</div> */}
      {/* Background pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5 pointer-events-none"></div>

      {/* Language selector */}
      <div className="fixed top-4 right-4 z-20">
        <LanguageSelector currentLanguage={language} onLanguageChange={setLanguage} />
      </div>

      {/* Larger Share Button in a new position */}
      <button
        onClick={shareChallengeLink}
        className="fixed top-4 left-4 z-20 bg-[#f7d02c] hover:bg-[#e6c120] text-[#1a1a2e] p-4 rounded-lg shadow-lg transition-all flex items-center justify-center gap-2 font-medium"
        aria-label={t("share")}
      >
        <Share2 size={24} />
        <span>{t("share")}</span>
      </button>

      {/* Game title */}
      <h1 className="text-4xl md:text-5xl font-bold mb-8 tracking-wider text-center">{t("game_title")}</h1>

      {/* Sound toggle */}
      <button
        onClick={toggleSound}
        className="absolute top-4 right-20 p-2 text-gray-400 hover:text-white transition-colors"
        aria-label={soundEnabled ? "Mute sound" : "Enable sound"}
      >
        {soundEnabled ? <Volume2 size={24} /> : <VolumeX size={24} />}
      </button>

      {/* Main game area - three column layout */}
      <div className="flex flex-col lg:flex-row w-full max-w-7xl mx-auto gap-8 items-start justify-center flex-grow my-4">
        {/* Scoreboard - left column */}
        <div className="lg:w-1/4 flex flex-col items-center lg:items-start order-2 lg:order-1">
          {/* Game mode selection - moved to left column */}
          <h2 className="text-xl font-semibold mb-3 text-center lg:text-left">{t("game_mode")}</h2>

          <div className="flex flex-col gap-2 mb-6 w-full">
            <button
              onClick={() => changeGameMode("ai")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                gameMode === "ai"
                  ? "bg-[#ff6b6b] text-[#1a1a2e] font-medium"
                  : "bg-[#16213e] text-gray-300 hover:bg-[#1e2a4a]"
              }`}
            >
              <Cpu size={18} />
              <span>{t("you_vs_ai")}</span>
            </button>

            <button
              onClick={() => changeGameMode("friend")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                gameMode === "friend"
                  ? "bg-[#4ecdc4] text-[#1a1a2e] font-medium"
                  : "bg-[#16213e] text-gray-300 hover:bg-[#1e2a4a]"
              }`}
            >
              <Users size={18} />
              <span>{t("you_vs_friend")}</span>
            </button>
          </div>

          {/* Challenge button - changes to Reset Challenge when in challenge mode */}
          <button
            onClick={inChallenge ? resetChallenge : startChallenge}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg mb-6 transition-colors bg-[#f7d02c] text-[#1a1a2e] font-medium hover:bg-[#e6c120]"
          >
            {inChallenge ? (
              <>
                <RefreshCw size={18} />
                <span>{t("reset_challenge")}</span>
              </>
            ) : (
              <>
                <Play size={18} />
                <span>{t("start_challenge")}</span>
              </>
            )}
          </button>

          <h2 className="text-xl font-semibold mb-3 text-center lg:text-left">{t("round_score")}</h2>

          {/* Enhanced score display with points and rank */}
          <div className="flex flex-col gap-4 w-full">
            <div className="bg-[#16213e] rounded-lg p-4 w-full relative overflow-hidden">
              {/* Background accent */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#ff6b6b10] to-[#4ecdc410] opacity-50"></div>

              {/* Player names */}
              <div className="flex justify-between items-center mb-4 relative z-10">
                {/* Improved player name editing */}
                <div className="flex items-center gap-2">
                  <div
                    className={`w-4 h-4 rounded-full ${scores.player1 > 0 ? "bg-[#ff6b6b]" : "bg-gray-600"} shadow-md`}
                  ></div>

                  {isEditingName ? (
                    <input
                      ref={nameInputRef}
                      type="text"
                      value={playerName}
                      onChange={(e) => setPlayerName(e.target.value)}
                      onBlur={endNameEditing}
                      onKeyDown={handleNameKeyPress}
                      className="bg-transparent border-b border-[#ff6b6b] text-white focus:outline-none px-1 py-0 w-24 font-medium"
                      maxLength={15}
                      autoFocus
                    />
                  ) : (
                    <div className="flex flex-col items-start cursor-pointer group" onClick={startNameEditing}>
                      <span className="font-medium">{playerName}</span>
                      <span className="text-gray-400 text-xs italic">{t("edit_name")}</span>
                      <Edit2
                        size={12}
                        className="text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity absolute top-1 right-1"
                      />
                    </div>
                  )}
                </div>

                {/* Improved friend name editing */}
                <div className="flex items-center gap-2">
                  {gameMode === "friend" ? (
                    isEditingFriendName ? (
                      <input
                        ref={friendNameInputRef}
                        type="text"
                        value={friendName}
                        onChange={(e) => setFriendName(e.target.value)}
                        onBlur={endFriendNameEditing}
                        onKeyDown={handleFriendNameKeyPress}
                        className="bg-transparent border-b border-[#4ecdc4] text-white focus:outline-none px-1 py-0 w-24 font-medium text-right"
                        maxLength={15}
                        autoFocus
                      />
                    ) : (
                      <div
                        className="flex flex-col items-end cursor-pointer group"
                        onClick={() => gameMode === "friend" && startFriendNameEditing()}
                      >
                        <span className="font-medium">{gameMode === "friend" ? friendName : "AI"}</span>
                        {gameMode === "friend" && (
                          <span className="text-gray-400 text-xs italic">{t("edit_name")}</span>
                        )}
                      </div>
                    )
                  ) : (
                    <span className="font-medium">AI</span>
                  )}
                  <div
                    className={`w-4 h-4 rounded-full ${scores.player2 > 0 ? "bg-[#4ecdc4]" : "bg-gray-600"} shadow-md`}
                  ></div>
                </div>
              </div>

              {/* Score display */}
              <div className="flex justify-center items-center relative z-10">
                <div className="flex items-center">
                  <div
                    className={`text-5xl font-bold text-[#ff6b6b] ${scores.player1 > scores.player2 ? "scale-110" : ""} transition-transform`}
                  >
                    {scores.player1}
                  </div>
                  <div className="mx-4 text-4xl text-gray-500 font-light">:</div>
                  <div
                    className={`text-5xl font-bold text-[#4ecdc4] ${scores.player2 > scores.player1 ? "scale-110" : ""} transition-transform`}
                  >
                    {scores.player2}
                  </div>
                </div>
              </div>

              {/* Ties and round info */}
              <div className="mt-4 flex flex-col items-center relative z-10">
                {scores.tie > 0 && (
                  <div className="text-center text-sm text-gray-300 bg-[#ffffff10] px-3 py-1 rounded-full mb-2">
                    {scores.tie} {scores.tie === 1 ? t("ties").slice(0, -1) : t("ties")}
                  </div>
                )}

                {inChallenge && (
                  <div className="text-center text-xs font-medium bg-[#f7d02c] text-[#1a1a2e] px-3 py-1 rounded-full">
                    {t("next_round", { round: currentRound, countdown: totalRounds })}
                  </div>
                )}
              </div>

              {/* Points and rank info */}
              {gameMode === "ai" && (playerRank || inChallenge || challengeComplete) && (
                <div className="mt-4 pt-3 border-t border-[#ffffff20] flex justify-between items-center text-sm">
                  <div>
                    <span className="text-gray-400">{t("points")}:</span>
                    <span
                      className={`ml-1 font-medium ${currentPoints > 0 ? "text-[#4ecdc4]" : currentPoints < 0 ? "text-[#ff6b6b]" : "text-white"}`}
                    >
                      {currentPoints}
                    </span>
                  </div>
                  {playerRank && (
                    <div className="flex items-center">
                      <span className="text-gray-400 mr-1">{t("rank")}:</span>
                      <span
                        className={`font-medium ${
                          playerRank === 1
                            ? "text-yellow-400"
                            : playerRank === 2
                              ? "text-gray-300"
                              : playerRank === 3
                                ? "text-amber-700"
                                : "text-white"
                        }`}
                      >
                        #{playerRank}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Game area - middle column */}
        <div className="lg:w-2/4 flex flex-col items-center order-1 lg:order-2">
          {/* Game status */}
          <div
            className={`mb-3 text-xl md:text-2xl tracking-wider text-center transition-all duration-300 ${gameOver || challengeComplete ? "font-bold text-2xl md:text-3xl" : "font-light"}`}
          >
            {getStatusMessage()}
          </div>

          {/* Timer display */}
          {inChallenge && (
            <div className="mb-4 text-lg font-mono bg-[#16213e] px-4 py-1 rounded-md">
              {t("time")}: {formatTimer(elapsedTime)}
            </div>
          )}

          {/* Game board */}
          <div className="w-full max-w-md aspect-square mx-auto">
            <div className="grid grid-cols-3 gap-2 h-full">
              {board.map((cell, index) => (
                <div
                  key={index}
                  onClick={() => handleCellClick(index)}
                  className={`aspect-square flex items-center justify-center cursor-pointer transition-all duration-200 relative ${!cell && !gameOver && !(gameMode === "ai" && isComputerTurn) ? "hover:bg-[#16213e]" : ""} ${isWinningCell(index) ? "bg-[#16213e] ring-2 ring-white ring-opacity-50" : ""}`}
                  style={{
                    borderTop: index >= 3 ? "2px solid rgba(255,255,255,0.15)" : "none",
                    borderBottom: index < 6 ? "2px solid rgba(255,255,255,0.15)" : "none",
                    borderLeft: index % 3 !== 0 ? "2px solid rgba(255,255,255,0.15)" : "none",
                    borderRight: index % 3 !== 2 ? "2px solid rgba(255,255,255,0.15)" : "none",
                  }}
                >
                  <div className="w-3/4 h-3/4">
                    {cell === "X" && renderX(index)}
                    {cell === "O" && renderO(index)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* AI Leaderboard - right column */}
        <div className="lg:w-1/4 flex flex-col items-center lg:items-start order-3">
          <h2 className="text-xl font-semibold mb-3 text-center lg:text-left">AI Challenge Board</h2>
          <AILeaderboard
            entries={leaderboard}
            language={language}
            currentPlayerName={playerName}
            isLoading={isLoadingLeaderboard}
            error={leaderboardError}
            onRetry={retryLoadLeaderboard}
          />
        </div>
      </div>

      {/* Share Score Popup */}
      {showSharePopup && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
          <div className="bg-[#16213e] rounded-lg p-6 max-w-md w-full animate-fade-in shadow-xl border border-[#ffffff20]">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">{t("share_challenge")}</h3>
              <button
                onClick={() => {
                  setShowSharePopup(false)
                  // Only reset scores after closing the popup
                  setScores({
                    player1: 0,
                    player2: 0,
                    tie: 0,
                  })
                  startNewGame()
                }}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            {/* Challenge Results Summary Card */}
            <div className="bg-[#1a1a2e] p-4 rounded-md mb-4">
              <div className="flex items-center justify-center gap-2 mb-3">
                <Award size={20} className="text-[#f7d02c]" />
                <h4 className="text-lg font-bold">{t("challenge_results")}</h4>
              </div>

              <div className="text-center mb-4">
                <span className="text-gray-400">{t("final_score")}:</span>
                <span className={`text-2xl font-bold ml-2 ${finalScore >= 0 ? "text-[#4ecdc4]" : "text-[#ff6b6b]"}`}>
                  {finalScore}
                </span>
              </div>

              <div className="grid grid-cols-4 gap-2 text-sm">
                <div className="bg-[#16213e] rounded p-2 text-center">
                  <div className="text-[#ff6b6b] font-bold text-xl">{scores.player1}</div>
                  <div className="text-gray-400 text-xs">{t("wins")}</div>
                </div>
                <div className="bg-[#16213e] rounded p-2 text-center">
                  <div className="text-gray-300 font-bold text-xl">{scores.tie}</div>
                  <div className="text-gray-400 text-xs">{t("ties")}</div>
                </div>
                <div className="bg-[#16213e] rounded p-2 text-center">
                  <div className="text-[#4ecdc4] font-bold text-xl">{scores.player2}</div>
                  <div className="text-gray-400 text-xs">{t("losses")}</div>
                </div>
                <div className="bg-[#16213e] rounded p-2 text-center">
                  <div className="text-[#f7d02c] font-bold text-xl">{formatTimer(elapsedTime)}</div>
                  <div className="text-gray-400 text-xs">{t("time")}</div>
                </div>
              </div>

              {playerRank && (
                <div className="mt-3 text-center bg-[#16213e] rounded p-2">
                  <span className="text-gray-400">{t("leaderboard_rank")}:</span>
                  <span
                    className={`font-bold ml-1 ${
                      playerRank === 1
                        ? "text-yellow-400"
                        : playerRank === 2
                          ? "text-gray-300"
                          : playerRank === 3
                            ? "text-amber-700"
                            : "text-white"
                    }`}
                  >
                    #{playerRank}
                  </span>
                </div>
              )}
            </div>

            {/* Share options */}
            <div className="flex flex-col gap-3">
              <button
                onClick={copyScoreToClipboard}
                className="flex items-center justify-center gap-2 bg-[#ffffff15] hover:bg-[#ffffff25] transition-colors py-2 rounded-md"
              >
                <Copy size={16} />
                <span>{shareType === "clipboard" && copySuccess ? t("copied") : t("copy_clipboard")}</span>
              </button>

              <p className="text-xs text-center text-gray-400 mb-2">{t("share_includes_image")}</p>

              <div className="grid grid-cols-4 gap-2">
                <button
                  onClick={shareOnTwitter}
                  className="flex flex-col items-center justify-center gap-1 bg-[#1DA1F2] hover:bg-[#1a94df] transition-colors py-2 rounded-md"
                >
                  <Twitter size={16} />
                  <span className="text-xs">Twitter</span>
                </button>

                <button
                  onClick={shareOnFacebook}
                  className="flex flex-col items-center justify-center gap-1 bg-[#4267B2] hover:bg-[#3b5998] transition-colors py-2 rounded-md"
                >
                  <Facebook size={16} />
                  <span className="text-xs">Facebook</span>
                </button>

                <button
                  onClick={shareOnInstagram}
                  className="flex flex-col items-center justify-center gap-1 bg-gradient-to-br from-[#833AB4] via-[#FD1D1D] to-[#FCAF45] hover:opacity-90 transition-colors py-2 rounded-md"
                >
                  <Instagram size={16} />
                  <span className="text-xs">
                    {shareType === "instagram" && copySuccess ? t("copied") : "Instagram"}
                  </span>
                </button>

                <button
                  onClick={shareOnTikTok}
                  className="flex flex-col items-center justify-center gap-1 bg-black hover:bg-gray-900 transition-colors py-2 rounded-md"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M19.321 5.562a5.124 5.124 0 0 1-5.121-5.12h-4.08v16.02c0 1.555-1.26 2.815-2.815 2.815a2.815 2.815 0 0 1 0-5.63c.252 0 .495.033.727.095V9.58a6.932 6.932 0 0 0-.727-.038 6.876 6.876 0 0 0-6.875 6.875A6.876 6.876 0 0 0 7.305 23.29a6.876 6.876 0 0 0 6.875-6.875V9.58c1.227.957 2.77 1.523 4.44 1.523v-4.08c.234 0 .467-.012.7-.036v3.356a8.885 8.885 0 0 0 4.08-.941v4.007a9.353 9.353 0 0 1-4.08.941V5.562z"
                      fill="currentColor"
                    />
                  </svg>
                  <span className="text-xs">{shareType === "tiktok" && copySuccess ? t("copied") : "TikTok"}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Share Button Popup */}
      {showShareButtonPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
          <div className="bg-[#16213e] rounded-lg p-6 max-w-md w-full animate-fade-in shadow-xl border border-[#f7d02c] border-opacity-50">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-white">{t("share_challenge")}</h3>
              <button onClick={() => setShowShareButtonPopup(false)} className="text-gray-400 hover:text-white">
                ✕
              </button>
            </div>

            <div className="bg-[#1a1a2e] p-4 rounded-md mb-4">
              <div className="flex items-center justify-center mb-3">
                <Share2 size={24} className="text-[#f7d02c] mr-2" />
                <h4 className="text-lg font-bold">{t("challenge_friends")}</h4>
              </div>

              <p className="text-white mb-4" dir={languageDirections[language]}>
                {t("challenge_friends_desc")}
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <button
                onClick={() => handleShare("clipboard")}
                className="flex items-center justify-center gap-2 bg-[#f7d02c] text-[#1a1a2e] font-medium py-3 rounded-md hover:bg-[#e6c120] transition-colors"
              >
                <Copy size={18} />
                <span>{shareType === "challenge" && copySuccess ? t("copied") : t("copy_link")}</span>
              </button>

              {navigator.share && (
                <button
                  onClick={() => handleShare("webshare")}
                  className="flex items-center justify-center gap-2 bg-[#ffffff15] hover:bg-[#ffffff25] transition-colors py-2 rounded-md"
                >
                  <Share2 size={18} />
                  <span>{t("share_device")}</span>
                </button>
              )}

              <div className="grid grid-cols-3 gap-2 mt-2">
                <button
                  onClick={() => handleShare("twitter")}
                  className="flex items-center justify-center gap-1 bg-[#1DA1F2] hover:bg-[#1a94df] transition-colors py-2 rounded-md"
                >
                  <Twitter size={16} />
                  <span className="text-xs">Twitter</span>
                </button>

                <button
                  onClick={() => handleShare("facebook")}
                  className="flex items-center justify-center gap-1 bg-[#4267B2] hover:bg-[#3b5998] transition-colors py-2 rounded-md"
                >
                  <Facebook size={16} />
                  <span className="text-xs">Facebook</span>
                </button>

                <button
                  onClick={() => handleShare("instagram")}
                  className="flex items-center justify-center gap-1 bg-gradient-to-br from-[#833AB4] via-[#FD1D1D] to-[#FCAF45] hover:opacity-90 transition-colors py-2 rounded-md"
                >
                  <Instagram size={16} />
                  <span className="text-xs">
                    {shareType === "instagram" && copySuccess ? t("copied") : "Instagram"}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Challenge Modal */}
      {showChallengeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
          <div className="bg-[#16213e] rounded-lg p-6 max-w-md w-full animate-fade-in shadow-xl border border-[#ff5252] border-opacity-50">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-[#ff5252]">{t("challenge_received")}</h3>
              <button onClick={() => setShowChallengeModal(false)} className="text-gray-400 hover:text-white">
                ✕
              </button>
            </div>

            <div className="bg-[#1a1a2e] p-4 rounded-md mb-4">
              <div className="flex items-center justify-center mb-3">
                <Trophy size={24} className="text-[#f7d02c] mr-2" />
                <h4 className="text-lg font-bold">{t("round_challenge")}</h4>
              </div>

              <p className="text-white mb-4">{challengeMessage}</p>

              {targetScore && (
                <div className="text-center bg-[#16213e] p-3 rounded-md">
                  <span className="text-gray-400">{t("target_score")}:</span>
                  <span className="text-2xl font-bold ml-2 text-[#ff5252]">{targetScore}</span>
                  <p className="text-xs text-gray-400 mt-1">{t("beat_score")}</p>
                </div>
              )}
            </div>

            <div className="flex flex-col gap-3">
              <button
                onClick={() => {
                  setShowChallengeModal(false)
                  setGameMode("ai")
                  startChallenge()
                }}
                className="bg-[#ff5252] text-white font-medium py-3 rounded-md hover:bg-[#ff3838] transition-colors flex items-center justify-center gap-2"
              >
                <Trophy size={18} />
                <span>{t("accept_challenge")}</span>
              </button>

              <button
                onClick={() => setShowChallengeModal(false)}
                className="bg-[#16213e] text-gray-300 font-medium py-2 rounded-md hover:bg-[#1e2a4a] transition-colors"
              >
                {t("maybe_later")}
              </button>
            </div>
          </div>
        </div>
      )}
      <TestInsert />
    </div>
  )
}

// Update the share functions to use the new methods
// Replace the existing shareOnTwitter, shareOnFacebook, etc. with these:

const shareOnTwitter = () => {
  shareOnSocialMedia("twitter")
}

const shareOnFacebook = () => {
  shareOnSocialMedia("facebook")
}

const shareOnInstagram = () => {
  shareOnSocialMedia("instagram")
}

const shareOnTikTok = () => {
  shareOnSocialMedia("tiktok")
}
