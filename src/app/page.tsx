'use client'

import * as React from "react"
import { SoundButton } from "../components/sound-button"
import { getSoundFiles } from "../lib/utils"

interface SoundFile {
  name: string
  path: string
  type: string
}

export default function Home() {
  const [sounds, setSounds] = React.useState<SoundFile[]>([])
  const [isLoading, setIsLoading] = React.useState(true)

  React.useEffect(() => {
    const loadSounds = async () => {
      const files = await getSoundFiles()
      setSounds(files)
      setIsLoading(false)
    }

    loadSounds()
  }, [])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-background to-background/50">
        <div className="text-xl font-medium text-muted-foreground animate-pulse">
          Loading sounds...
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-background/50">
      <div className="container px-4 py-8">
        <div className="max-w-[1200px] mx-auto space-y-8">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
              GM Soundboard
            </h1>
            <p className="text-muted-foreground">
              Click to play, right-click to stop
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {sounds.map((sound) => (
              <SoundButton
                key={sound.path}
                name={sound.name}
                path={sound.path}
              />
            ))}
          </div>

          {sounds.length === 0 && (
            <div className="text-center rounded-xl border border-dashed border-border/50 p-12 bg-card/30">
              <p className="max-w-[420px] mx-auto text-muted-foreground">
                No sound files found in the audio directory.
                Add some .aiff, .flac, .m4a, .mp3, or .wav files to get started.
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
