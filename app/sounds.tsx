import { Howl } from "howler"

// Initialize sounds
const xSound = new Howl({
  src: ["/sounds/x-sound.mp3"],
  volume: 0.5,
})

const oSound = new Howl({
  src: ["/sounds/o-sound.mp3"],
  volume: 0.5,
})

const winSound = new Howl({
  src: ["/sounds/win-sound.mp3"],
  volume: 0.5,
})

const drawSound = new Howl({
  src: ["/sounds/draw-sound.mp3"],
  volume: 0.5,
})

export const soundManager = {
  playXSound: () => {
    xSound.play()
  },
  playOSound: () => {
    oSound.play()
  },
  playWinSound: () => {
    winSound.play()
  },
  playDrawSound: () => {
    drawSound.play()
  },
}
