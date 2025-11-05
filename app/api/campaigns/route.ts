import { NextResponse } from 'next/server'
import { getAllCampaigns, getCampaignStats } from '@/lib/db/campaigns'
import { connectToDatabase } from '@/lib/db/connection'
import dotenv from 'dotenv'

dotenv.config()

// Forzar renderizado dinámico (no cache, siempre ejecutar)
export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET() {
  try {
    await connectToDatabase()
    const campaigns = await getAllCampaigns()
    const stats = await getCampaignStats()

    // Headers para evitar cache y permitir actualización en vivo
    return NextResponse.json({
      campaigns,
      stats
    }, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
        'X-Accel-Buffering': 'no'
      }
    })
  } catch (error: any) {
    console.error('[API] Error getting campaigns:', error)
    return NextResponse.json({ error: 'Failed to get campaigns' }, { status: 500 })
  }
}