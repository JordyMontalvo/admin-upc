import { NextResponse } from 'next/server'
import { getAllCampaigns, getCampaignStats } from '@/lib/db/campaigns'
import { connectToDatabase } from '@/lib/db/connection'
import dotenv from 'dotenv'

dotenv.config()

export async function GET() {
  try {
    await connectToDatabase()
    const campaigns = await getAllCampaigns()
    const stats = await getCampaignStats()

    return NextResponse.json({
      campaigns,
      stats
    })
  } catch (error: any) {
    console.error('[API] Error getting campaigns:', error)
    return NextResponse.json({ error: 'Failed to get campaigns' }, { status: 500 })
  }
}