import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/db/connection'
import { getStats } from '@/lib/db/contacts'
import dotenv from 'dotenv'

dotenv.config()

export async function GET() {
  try {
    await connectToDatabase()
    const stats = await getStats()
    return NextResponse.json(stats)
  } catch (error: any) {
    console.error('[API] Error getting contact count:', error)
    return NextResponse.json({ error: 'Failed to get contact count' }, { status: 500 })
  }
}