import { NextResponse } from 'next/server'
import { getLatestEvents } from '@/lib/contentfulService'
import dotenv from 'dotenv'

dotenv.config()

export async function GET() {
  try {
    const events = await getLatestEvents()
    return NextResponse.json({ events })
  } catch (error: any) {
    console.error('[API] Error getting events:', error)
    return NextResponse.json({ error: 'Failed to get events' }, { status: 500 })
  }
}