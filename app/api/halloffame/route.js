import { NextResponse } from 'next/server'
import { getAuthenticatedUser } from '@/lib/supabase/auth'

export async function GET(request) {
    const { supabase, user, error: authError } = await getAuthenticatedUser()

    if (!user) {
        return NextResponse.json(
            { error: authError?.message || 'No autenticado' },
            { status: 401 }
        )
    }

    const { searchParams } = new URL(request.url)
    let userId = searchParams.get('userId')

    if (!userId) {
        userId = user.id
    }

    const pageSize = 1000
    let from = 0
    let allData = []

    while (true) {
        const { data, error } = await supabase
            .from('points_per_episode')
            .select(`
                point_type_id!inner(
                    id,
                    value
                ),
                ppe_reference!inner(
                    season_id!inner(
                        id,
                        name,
                        franchise,
                        year
                    ),
                    episode_id!inner(
                        esFinal,
                        esFinalDraga
                    ),
                    queen_id!inner(
                        id,
                        name
                    )
                )
            `)
            .eq('client_id', userId)
            .range(from, from + pageSize - 1)

        if (error) {
            return NextResponse.json(
                { error: error.message },
                { status: 500 }
            )
        }

        allData.push(...data)

        if (data.length < pageSize) {
            break
        }

        from += pageSize
    }

    const imageMap = await queensImgMap(supabase)

    const seasons = createCompleteSeasonMap(allData, imageMap)

    const hallOfFame = await hallOfFameArray(seasons)
    
    return NextResponse.json(hallOfFame)
}

const createCompleteSeasonMap = (data, imageMap) => {
    const seasons = new Map()
    
    data.forEach(item => {
        const season = item.ppe_reference.season_id
        const queen = item.ppe_reference.queen_id
        const pointType = item.point_type_id
        const esFinal = item.ppe_reference.episode_id.esFinal
        const esFinalDraga = item.ppe_reference.episode_id.esFinalDraga

        if (!seasons.has(season.id)) {
            seasons.set(season.id, new Map())
        }

        const queens = seasons.get(season.id)
        
        if (!queens.has(queen.id)) {
            const img = imageMap.get(`${season.id}|${queen.id}`)
            const seasonName = season.name.replace(/^rupaul's /i, '')
            queens.set(queen.id, {
                id: queen.id,
                name: queen.name,
                image_url: img,
                score: 0,
                season: seasonName,
                franchise: season.franchise,
                year: season.year,
                nEpisodes: 0,
                winner: false
            })
        }
        
        const currentQueen = queens.get(queen.id)

        if (esFinal || esFinalDraga) {
            if (pointType.id === 'point9') {
                currentQueen.winner = true
            }
        } else if (pointType.id !== 'point7'){
            currentQueen.nEpisodes += 1
            currentQueen.score += pointType.value
        }
    })

    return seasons
}

const queensImgMap = async (supabase) => {

    const { data: participates, error: participateError } = await supabase
        .from('participate')
        .select(`
            season_id,
            queen_id,
            image_url
        `)

    if (participateError) {
        return NextResponse.json(
            { error: participateError.message },
            { status: 500 }
        )
    }

    const imageMap = new Map()
    participates.forEach(item => {
        imageMap.set(
            `${item.season_id}|${item.queen_id}`,
            item.image_url
        )
    })

    return imageMap
}

const hallOfFameArray = async (seasons) => {
    const hallOfFame = []

    for (const [seasonId, queens] of seasons) {

        // 1. Prioridad absoluta: WINNER
        const winner = [...queens.values()].find(
            queen => queen.winner
        )

        // 2. Si no hay WINNER, gana la que más puntos tenga
        const seasonWinner = winner || [...queens.values()].reduce(
            (highest, queen) =>
                (queen.score / queen.nEpisodes) > (highest.score / highest.nEpisodes)
                    ? queen
                    : highest
        )

        seasonWinner.score = (seasonWinner.score / seasonWinner.nEpisodes).toFixed(3)

        hallOfFame.push({
            seasonId,
            winner: seasonWinner
        })
    }

    hallOfFame.sort((a, b) => {
      return b.winner.year - a.winner.year
    })
    
    return hallOfFame
}