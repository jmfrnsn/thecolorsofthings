import { useEffect, useRef, useState } from 'react'

export function useSound(soundUrl: string) {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [loadError, setLoadError] = useState<string | null>(null)

  useEffect(() => {
    console.log('Initializing audio with URL:', soundUrl)
    const audio = new Audio()
    
    const handleCanPlay = () => {
      console.log('Audio file loaded and ready to play')
      setIsLoaded(true)
      setLoadError(null)
    }

    const handleError = (e: ErrorEvent) => {
      const error = e.target as HTMLAudioElement
      console.error('Audio loading error:', {
        error: error.error,
        networkState: error.networkState,
        readyState: error.readyState,
        src: error.src
      })
      setLoadError(`Failed to load audio: ${error.error}`)
      setIsLoaded(false)
    }

    audio.addEventListener('canplay', handleCanPlay)
    audio.addEventListener('error', handleError as EventListener)
    
    // Set properties before setting src to ensure proper loading
    audio.preload = 'auto'
    audio.volume = 1.0
    audio.src = soundUrl
    
    audioRef.current = audio

    return () => {
      audio.removeEventListener('canplay', handleCanPlay)
      audio.removeEventListener('error', handleError as EventListener)
      audio.pause()
      audioRef.current = null
    }
  }, [soundUrl])

  const play = async () => {
    if (!audioRef.current) {
      console.error('Audio element not initialized')
      return
    }

    if (!isLoaded) {
      console.error('Audio not loaded yet:', { loadError })
      return
    }

    try {
      console.log('Attempting to play sound...')
      audioRef.current.currentTime = 0
      audioRef.current.volume = 1.0
      await audioRef.current.play()
      console.log('Sound played successfully')
    } catch (error) {
      console.error('Error playing sound:', error)
      throw error // Propagate error to component
    }
  }

  return { play, isLoaded, loadError }
} 