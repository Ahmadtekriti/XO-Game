// This file provides a fallback sound implementation using the Web Audio API
// which is more reliable than using audio files that might not exist

export class SoundManager {
  private audioContext: AudioContext | null = null
  private initialized = false

  constructor() {
    // Initialize on demand to avoid autoplay restrictions
    this.init = this.init.bind(this)
    this.playXSound = this.playXSound.bind(this)
    this.playOSound = this.playOSound.bind(this)
    this.playWinSound = this.playWinSound.bind(this)
    this.playDrawSound = this.playDrawSound.bind(this)
  }

  init() {
    if (this.initialized) return

    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      this.initialized = true
    } catch (e) {
      console.log("Web Audio API not supported:", e)
    }
  }

  private createOscillator(type: OscillatorType, frequency: number, duration: number) {
    if (!this.audioContext) return

    try {
      const oscillator = this.audioContext.createOscillator()
      const gainNode = this.audioContext.createGain()

      oscillator.type = type
      oscillator.frequency.value = frequency

      gainNode.gain.value = 0.1
      gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + duration)

      oscillator.connect(gainNode)
      gainNode.connect(this.audioContext.destination)

      oscillator.start()
      oscillator.stop(this.audioContext.currentTime + duration)
    } catch (e) {
      console.log("Error creating sound:", e)
    }
  }

  playXSound() {
    this.init()
    if (!this.audioContext) return

    // X sound: higher pitched click
    this.createOscillator("sine", 660, 0.1)
  }

  playOSound() {
    this.init()
    if (!this.audioContext) return

    // O sound: lower pitched tone
    this.createOscillator("sine", 440, 0.15)
  }

  playWinSound() {
    this.init()
    if (!this.audioContext) return

    // Win sound: ascending notes
    const now = this.audioContext.currentTime
    ;[440, 554, 659].forEach((freq, i) => {
      setTimeout(() => {
        this.createOscillator("sine", freq, 0.2)
      }, i * 150)
    })
  }

  playDrawSound() {
    this.init()
    if (!this.audioContext) return

    // Draw sound: two-tone sound
    this.createOscillator("sine", 440, 0.2)
    setTimeout(() => {
      this.createOscillator("sine", 330, 0.2)
    }, 200)
  }
}

// Create a singleton instance
export const soundManager = new SoundManager()
