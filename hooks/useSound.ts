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
      const mediaElement = e.target as HTMLAudioElement
      const error = mediaElement.error
      
      // Get detailed error information
      let errorDetails = 'Unknown error'
      if (error) {
        const errorCodes = {
          1: 'MEDIA_ERR_ABORTED - The fetching of the audio file was aborted by the user.',
          2: 'MEDIA_ERR_NETWORK - A network error occurred while fetching the audio file.',
          3: 'MEDIA_ERR_DECODE - An error occurred while decoding the audio file.',
          4: 'MEDIA_ERR_SRC_NOT_SUPPORTED - The audio file format is not supported.'
        }
        errorDetails = errorCodes[error.code as keyof typeof errorCodes] || `Unknown error code: ${error.code}`
      }

      console.error('Audio loading error:', {
        errorCode: error?.code,
        errorMessage: error?.message,
        errorDetails,
        networkState: mediaElement.networkState,
        readyState: mediaElement.readyState,
        currentSrc: mediaElement.currentSrc,
        src: soundUrl
      })

      setLoadError(`Failed to load audio: ${errorDetails}`)
      setIsLoaded(false)
    }

    audio.addEventListener('canplay', handleCanPlay)
    audio.addEventListener('error', handleError as EventListener)
    
    // Set properties before setting src to ensure proper loading
    audio.preload = 'auto'
    audio.volume = 1.0

    // Test if the file exists before setting src
    fetch(soundUrl)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        audio.src = soundUrl
      })
      .catch(error => {
        console.error('Error fetching audio file:', error)
        setLoadError(`Failed to fetch audio file: ${error.message}`)
      })
    
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