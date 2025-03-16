import { useEffect, useRef } from 'react'

export function useSound(soundUrl: string) {
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    console.log('Initializing audio with URL:', soundUrl)
    const audio = new Audio(soundUrl)
    audio.volume = 1.0 // Set maximum volume
    audioRef.current = audio

    // Log when the audio is loaded
    audio.addEventListener('canplaythrough', () => {
      console.log('Audio file loaded and ready to play')
    })

    // Log any errors
    audio.addEventListener('error', (e) => {
      console.error('Audio loading error:', e)
    })

    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
    }
  }, [soundUrl])

  const play = async () => {
    if (audioRef.current) {
      try {
        console.log('Attempting to play sound...')
        audioRef.current.currentTime = 0
        audioRef.current.volume = 1.0 // Ensure volume is at maximum
        await audioRef.current.play()
        console.log('Sound played successfully')
      } catch (error) {
        console.error('Error playing sound:', error)
      }
    } else {
      console.error('Audio element not initialized')
    }
  }

  return { play }
} 