import { NextResponse } from 'next/server'
import { getCompetitions, getCompetition, getStandings, getFixtures } from '@/lib/api'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (id) {
      const competition = await getCompetition(id)
      const fixtures = await getFixtures(id)
      const standings = await getStandings(id)
      return NextResponse.json({ competition, fixtures, standings })
    }
    const competitions = await getCompetitions()

    return NextResponse.json(competitions)
  } catch (error) {
    console.error('Error fetching competitions:', error)
    return NextResponse.json(
      { error: 'Failed to fetch competitions' },
      { status: 500 }
    )
  }
}
