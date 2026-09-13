import { NextResponse } from 'next/server'
import { getAuthenticatedUser, getAuthenticatedAdmin } from '@/lib/supabase/auth'

export async function GET(request) {
    const { supabase, user, error: authError } = await getAuthenticatedUser()

    if (!user) {
        return Response.json(
            { error: authError.message },
            { status: 401 }
        )
    }

    const { searchParams } = new URL(request.url)

    const page = Number(searchParams.get('page')) || 1
    const pageSize = Number(searchParams.get('pageSize')) || 20

    const from = (page - 1) * pageSize
    const to = from + pageSize - 1

    const { data, error, count } = await supabase
        .from('participate')
        .select(`
            image_url,
            season: season_id(
                franchise
            ),
            queen: queen_id (
                name
            )
            `, { count: 'exact' })
        .not('image_url', 'is', null)
        .order('season(franchise)', { ascending: true })
        .order('queen(name)', { ascending: true })
        .range(from, to)

    if (error) {
        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        )
    }

    const images = data.map(item => ({
        image_url: item.image_url
    }))

    return NextResponse.json({
        images,
        page,
        pageSize,
        total: count,
        totalPages: Math.ceil(count / pageSize)
    })
}