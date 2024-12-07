'use client'

import { Dice5, Music2 } from "lucide-react"
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
          Loading the tavern...
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-background/50">
      <div className="container px-4 py-8">
        <div className="max-w-[1200px] mx-auto space-y-8">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Dice5 className="h-10 w-10 text-primary" />
              <h1 className="text-4xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
                Joboard
              </h1>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Music2 className="h-4 w-4" />
              <p>Click to play, right-click to stop</p>
            </div>
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
              <div className="max-w-[420px] mx-auto space-y-4">
                <Dice5 className="h-12 w-12 mx-auto text-muted-foreground/50" />
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold">No sounds found</h3>
                  <p className="text-sm text-muted-foreground">
                    Add some audio files (.aiff, .flac, .m4a, .mp3, or .wav) to the public/audio directory to get started.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
