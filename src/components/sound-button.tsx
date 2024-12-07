import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Play, Square, Volume2, VolumeX } from "lucide-react"
import * as React from "react"

interface SoundButtonProps {
  name: string
  path: string
}

export function SoundButton({ name, path }: SoundButtonProps) {
  const [volume, setVolume] = React.useState(1)
  const [isMuted, setIsMuted] = React.useState(false)
  const [isPlaying, setIsPlaying] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const audioRef = React.useRef<HTMLAudioElement | null>(null)

  React.useEffect(() => {
    const audio = new Audio()

    const handleCanPlayThrough = () => {
      setIsLoading(false)
      setError(null)
    }

    const handleEnded = () => {
      setIsPlaying(false)
    }

    const handleError = (e: Event) => {
      const target = e.target as HTMLAudioElement
      console.error('Audio error:', target.error)
      setError(target.error?.message || 'Error loading audio')
      setIsLoading(false)
      setIsPlaying(false)
    }

    audio.addEventListener('canplaythrough', handleCanPlayThrough)
    audio.addEventListener('ended', handleEnded)
    audio.addEventListener('error', handleError)

    audio.src = path
    audio.volume = isMuted ? 0 : volume
    audio.preload = 'auto'
    audioRef.current = audio

    return () => {
      audio.removeEventListener('canplaythrough', handleCanPlayThrough)
      audio.removeEventListener('ended', handleEnded)
      audio.removeEventListener('error', handleError)
      audio.pause()
      audio.src = ''
      audioRef.current = null
    }
  }, [path, volume, isMuted])

  const play = async () => {
    if (!audioRef.current || isLoading) return

    try {
      setIsLoading(true)
      setError(null)
      if (isPlaying) {
        audioRef.current.currentTime = 0
      }
      await audioRef.current.play()
      setIsPlaying(true)
    } catch (error) {
      console.error('Playback error:', error)
      setError('Failed to play audio')
    } finally {
      setIsLoading(false)
    }
  }

  const stop = () => {
    if (!audioRef.current || isLoading) return
    audioRef.current.pause()
    audioRef.current.currentTime = 0
    setIsPlaying(false)
  }

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0]
    setVolume(newVolume)
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : newVolume
    }
    setIsMuted(false)
  }

  const toggleMute = () => {
    setIsMuted(!isMuted)
    if (audioRef.current) {
      audioRef.current.volume = !isMuted ? 0 : volume
    }
  }

  const formattedName = name
    .replace(/-/g, ' ')
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')

  return (
    <div className="group relative flex flex-col gap-3 p-4 bg-card/50 backdrop-blur-sm rounded-xl border border-border/50 hover:bg-card/80 hover:border-primary/20 transition-all duration-300">
      <Button
        variant={isPlaying ? "default" : error ? "destructive" : "secondary"}
        size="lg"
        onClick={play}
        onContextMenu={(e) => {
          e.preventDefault()
          stop()
        }}
        disabled={isLoading}
        className="w-full font-medium tracking-wide transition-all duration-300 flex items-center gap-2"
      >
        {isLoading ? (
          <span className="animate-pulse">Loading...</span>
        ) : error ? (
          "Error"
        ) : (
          <>
            {isPlaying ? <Square className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            <span>{formattedName}</span>
          </>
        )}
      </Button>

      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleMute}
          disabled={isLoading || !!error}
          className="h-8 w-8 opacity-60 group-hover:opacity-100 transition-opacity duration-300"
        >
          {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
        </Button>
        <Slider
          value={[volume]}
          onValueChange={handleVolumeChange}
          max={1}
          step={0.01}
          disabled={isLoading || !!error}
          className="w-24 opacity-60 group-hover:opacity-100 transition-opacity duration-300"
        />
      </div>
      {error && (
        <p className="text-xs text-destructive mt-1 text-center">{error}</p>
      )}
    </div>
  )
} 
