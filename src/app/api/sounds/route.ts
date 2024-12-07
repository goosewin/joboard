import { promises as fs } from "fs"
import { NextResponse } from "next/server"
import path from "path"

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const audioDir = path.join(process.cwd(), "public/audio")

    // Check if directory exists
    try {
      await fs.access(audioDir)
    } catch {
      await fs.mkdir(audioDir, { recursive: true })
      return NextResponse.json([])
    }

    const files = await fs.readdir(audioDir)
    const audioFiles = files.filter((file) => {
      const ext = path.extname(file).toLowerCase()
      return [".mp3", ".wav", ".aiff", ".flac", ".m4a"].includes(ext)
    })

    // Return paths relative to the public directory
    return NextResponse.json(audioFiles.map((file) => `/audio/${file}`))
  } catch (error) {
    console.error("Error reading audio directory:", error)
    return NextResponse.json({ error: "Failed to load sound files" }, { status: 500 })
  }
} 
