// Function to generate a score image as a data URL
export const generateScoreImage = async (
  playerName: string,
  finalScore: number,
  wins: number,
  ties: number,
  losses: number,
  time: string,
): Promise<string> => {
  const canvas = document.createElement("canvas")
  canvas.width = 800
  canvas.height = 450
  const ctx = canvas.getContext("2d")

  if (!ctx) {
    return "" // Return empty string if canvas context is not available
  }

  // Background
  ctx.fillStyle = "#1a1a2e" // Dark background
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  // Grid pattern (subtle)
  ctx.strokeStyle = "rgba(255, 255, 255, 0.05)"
  ctx.lineWidth = 1
  for (let i = 0; i < canvas.width; i += 20) {
    ctx.beginPath()
    ctx.moveTo(i, 0)
    ctx.lineTo(i, canvas.height)
    ctx.stroke()
    ctx.beginPath()
    ctx.moveTo(0, i)
    ctx.lineTo(canvas.width, i)
    ctx.stroke()
  }

  // Title
  ctx.font = "bold 48px Arial"
  ctx.fillStyle = "#f7d02c" // Yellow accent
  ctx.textAlign = "center"
  ctx.fillText("TIC-TAC-TOE CHALLENGE", canvas.width / 2, 80)

  // Player Name
  ctx.font = "bold 40px Arial"
  ctx.fillStyle = "#ffffff"
  ctx.fillText(`${playerName}'s Results`, canvas.width / 2, 150)

  // Score
  ctx.font = "bold 72px Arial"
  ctx.fillStyle = finalScore >= 0 ? "#4ecdc4" : "#ff6b6b" // Green for positive, red for negative
  ctx.fillText(`Score: ${finalScore}`, canvas.width / 2, 250)

  // Stats
  ctx.font = "30px Arial"
  ctx.fillStyle = "#ffffff"
  ctx.fillText(`Wins: ${wins} | Ties: ${ties} | Losses: ${losses}`, canvas.width / 2, 320)

  // Time
  ctx.font = "30px Arial"
  ctx.fillStyle = "#f7d02c"
  ctx.fillText(`Time: ${time}`, canvas.width / 2, 370)

  // Footer
  ctx.font = "20px Arial"
  ctx.fillStyle = "#888888"
  ctx.fillText("Can you beat this score? Play at xo-game.vercel.app", canvas.width / 2, 420)

  return canvas.toDataURL("image/png")
}

// Function to convert data URL to Blob
export const dataURLToBlob = (dataurl: string): Blob => {
  const arr = dataurl.split(",")
  const mimeMatch = arr[0].match(/:(.*?);/)
  const mime = mimeMatch ? mimeMatch[1] : "image/png"
  const bstr = atob(arr[1])
  let n = bstr.length
  const u8arr = new Uint8Array(n)
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n)
  }
  return new Blob([u8arr], { type: mime })
}
