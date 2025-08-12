// Function to generate a shareable score card image
export const generateScoreImage = async (
  playerName: string,
  score: number,
  wins: number,
  ties: number,
  losses: number,
  time: string,
): Promise<string> => {
  // Create a canvas element
  const canvas = document.createElement("canvas")
  const ctx = canvas.getContext("2d")

  if (!ctx) {
    console.error("Canvas context not available")
    return ""
  }

  // Set canvas dimensions
  canvas.width = 1200
  canvas.height = 630

  // Background
  ctx.fillStyle = "#1a1a2e"
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  // Add grid pattern background
  ctx.strokeStyle = "rgba(255, 255, 255, 0.05)"
  ctx.lineWidth = 1

  // Draw vertical lines
  for (let x = 20; x < canvas.width; x += 20) {
    ctx.beginPath()
    ctx.moveTo(x, 0)
    ctx.lineTo(x, canvas.height)
    ctx.stroke()
  }

  // Draw horizontal lines
  for (let y = 20; y < canvas.height; y += 20) {
    ctx.beginPath()
    ctx.moveTo(0, y)
    ctx.lineTo(canvas.width, y)
    ctx.stroke()
  }

  // Add game title
  ctx.fillStyle = "white"
  ctx.font = "bold 60px Arial, sans-serif"
  ctx.textAlign = "center"
  ctx.fillText("TIC-TAC-TOE CHALLENGE", canvas.width / 2, 100)

  // Add player name
  ctx.font = "bold 40px Arial, sans-serif"
  ctx.fillText(`${playerName}'s Score`, canvas.width / 2, 170)

  // Add score
  ctx.font = "bold 120px Arial, sans-serif"
  ctx.fillStyle = score > 0 ? "#4ecdc4" : "#ff6b6b"
  ctx.fillText(`${score}`, canvas.width / 2, 320)
  ctx.fillStyle = "white"
  ctx.font = "30px Arial, sans-serif"
  ctx.fillText("POINTS", canvas.width / 2, 370)

  // Add stats
  const statsY = 450
  const statsSpacing = 200

  // Wins
  ctx.fillStyle = "#ff6b6b"
  ctx.font = "bold 50px Arial, sans-serif"
  ctx.textAlign = "center"
  ctx.fillText(`${wins}`, canvas.width / 2 - statsSpacing, statsY)
  ctx.fillStyle = "white"
  ctx.font = "25px Arial, sans-serif"
  ctx.fillText("WINS", canvas.width / 2 - statsSpacing, statsY + 40)

  // Ties
  ctx.fillStyle = "#f7d02c"
  ctx.font = "bold 50px Arial, sans-serif"
  ctx.fillText(`${ties}`, canvas.width / 2, statsY)
  ctx.fillStyle = "white"
  ctx.font = "25px Arial, sans-serif"
  ctx.fillText("TIES", canvas.width / 2, statsY + 40)

  // Losses
  ctx.fillStyle = "#4ecdc4"
  ctx.font = "bold 50px Arial, sans-serif"
  ctx.fillText(`${losses}`, canvas.width / 2 + statsSpacing, statsY)
  ctx.fillStyle = "white"
  ctx.font = "25px Arial, sans-serif"
  ctx.fillText("LOSSES", canvas.width / 2 + statsSpacing, statsY + 40)

  // Add time
  ctx.fillStyle = "white"
  ctx.font = "30px Arial, sans-serif"
  ctx.fillText(`Time: ${time}`, canvas.width / 2, 540)

  // Add call to action
  ctx.fillStyle = "rgba(255, 255, 255, 0.7)"
  ctx.font = "25px Arial, sans-serif"
  ctx.fillText("Play now and beat this score!", canvas.width / 2, 590)

  // Draw XO symbols
  // X symbol
  ctx.strokeStyle = "#ff6b6b"
  ctx.lineWidth = 10
  ctx.beginPath()
  ctx.moveTo(100, 100)
  ctx.lineTo(200, 200)
  ctx.stroke()
  ctx.beginPath()
  ctx.moveTo(200, 100)
  ctx.lineTo(100, 200)
  ctx.stroke()

  // O symbol
  ctx.strokeStyle = "#4ecdc4"
  ctx.lineWidth = 10
  ctx.beginPath()
  ctx.arc(1050, 150, 60, 0, Math.PI * 2)
  ctx.stroke()

  // Convert canvas to data URL
  return canvas.toDataURL("image/png")
}

// Function to convert data URL to Blob
export const dataURLToBlob = (dataURL: string): Blob => {
  const arr = dataURL.split(",")
  const mime = arr[0].match(/:(.*?);/)![1]
  const bstr = atob(arr[1])
  let n = bstr.length
  const u8arr = new Uint8Array(n)

  while (n--) {
    u8arr[n] = bstr.charCodeAt(n)
  }

  return new Blob([u8arr], { type: mime })
}
