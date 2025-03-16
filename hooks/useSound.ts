import { useEffect, useRef } from 'react'

export function useSound(soundUrl: string) {
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    audioRef.current = new Audio(soundUrl)
    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
    }
  }, [soundUrl])

  const play = () => {
    if (audioRef.current) {
      // Reset the audio to start if it's already playing
      audioRef.current.currentTime = 0
      audioRef.current.play().catch(error => {
        console.error('Error playing sound:', error)
      })
    }
  }

  return { play }
} 