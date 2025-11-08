import { NextResponse } from 'next/server'
import { getLatestEvents } from '@/lib/contentfulService'
import dotenv from 'dotenv'

dotenv.config()

export const revalidate = 0
export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const events = await getLatestEvents()
    return NextResponse.json(
      { events },
      {
        headers: {
          'Cache-Control': 'no-store, max-age=0',
        },
      },
    )
  } catch (error: any) {
    console.error('[API] Error getting events:', error)
    return NextResponse.json(
      { error: 'Failed to get events' },
      {
        status: 500,
        headers: {
          'Cache-Control': 'no-store, max-age=0',
        },
      },
    )
  }
}