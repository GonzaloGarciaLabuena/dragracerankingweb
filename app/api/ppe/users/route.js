import { NextResponse } from 'next/server'
import { getAuthenticatedUser } from '@/lib/supabase/auth'

export async function GET(request) {
    const { supabase, user, error: authError } = await getAuthenticatedUser()

    if (!user) {
        return Response.json(
            { error: authError.message },
            { status: 401 }
        )
    }

    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")
    const seasonId = searchParams.get("seasonId")

    const { data, error: dbError } = await supabase
        .from('points_per_episode')
        .select(`
            point_type_id!inner(id),
            ppe_reference!inner (
                episode_id!inner(id),
                queen_id!inner(id)
            )
        `)
        .eq('client_id', userId)
        .eq('ppe_reference.season_id', seasonId)

    //console.log("data", data)
    //console.log("error", dbError)
    if (dbError) {
        return NextResponse.json(
            { error: dbError.message },
            { status: 500 }
        );
    }
    return NextResponse.json(data)

}